const User = require('../models/user.model');
const httpStatus = require('http-status');
const UserService = require('../services/db/user.service');
const ValidationService = require('../services/validation.service');
const logService = require('../services/db/logs.service');
const participantService = require('../services/db/participant.service');
const fileService = require('../services/files.service');
const PasswordService = require('../services/password.service');
const EventService = require("../services/db/event.service");
var ObjectId = require('mongoose').Types.ObjectId

exports.getAllSportsman = async function (req, res, next) {
    var page = req.query.page ? req.query.page : 1;
    var limit = req.query.limit ? req.query.limit : 15;
    var term = req.query.search ? req.query.search : null;

    // var query = {role: {$eq: 'Sportsman'}};
    var query = {};

    if (term) {
        query = {
            $or: [
                { name: { $regex: term, $options: 'i' } },
                { surnames: { $regex: term, $options: 'i' } },
                { email: { $regex: term, $options: 'i' } },
                { mobileNumber: { $regex: term, $options: 'i' } },
                { "$where": `function() { return this._id.toString().match(/${term}/) != null;}` }]
        }
    }

    try {
        var sportsmans = await
            UserService.getAllUsers(query, page, limit);
        sportsmans.docs = sportsmans.docs.map((sportsman) => {
            return formatSportsman(sportsman);
        });
        return res.status(httpStatus.OK).json({ status: httpStatus.OK, data: sportsmans });
    } catch (e) {
        return res.status(httpStatus.BAD_REQUEST).json({ status: httpStatus.BAD_REQUEST, message: e.message });
    }
}
    ;

exports.createSportsman = async function (req, res, next) {

    try {
        const errors = await ValidationService.sportsmanCreateValidate(req.body);
        if (errors) {
            let err = extractMessageErrors(errors);
            return res.status(httpStatus.BAD_REQUEST).json({ status: httpStatus.BAD_REQUEST, message: err });
        }

        req.body.role = 'Sportsman';
        req.body.accessProvider = 'Password';
        req.body.password = await PasswordService.generateHash(req.body.password);
        var newSportsman = await UserService.createUser(req.body);
        logService.createLog({
            description: `Añadido usuario ${newSportsman.name} (${newSportsman._id}) 
        por ${req.authUser.role}: ${req.authUser.name} ${req.authUser.surnames}`
        });
        return res.status(httpStatus.CREATED).json({
            status: httpStatus.CREATED,
            data: formatSportsman(newSportsman),
            message: "Succesfully Created Sportsman"
        });
    } catch (e) {
        return res.status(httpStatus.BAD_REQUEST).json({ status: httpStatus.BAD_REQUEST, message: e.message });
    }
};

exports.getSportsman = async function (req, res, next) {
    var id = req.params.id;

    try {
        var savedSportsman = await UserService.getUser(id);
        if (!savedSportsman)
            return res.status(httpStatus.NOT_FOUND).json({ status: httpStatus.NOT_FOUND, message: "User not found" });
        return res.status(httpStatus.OK).json({ status: httpStatus.OK, data: formatSportsman(savedSportsman) });
    } catch (e) {
        return res.status(httpStatus.NOT_FOUND).json({ status: httpStatus.NOT_FOUND, message: e.message });
    }
};

exports.updateSportsman = async function (req, res, next) {
    try {
        const errors = await ValidationService.sportsmanUpdateValidate(req.body);
        if (errors) {
            let err = extractMessageErrors(errors);
            return res.status(httpStatus.BAD_REQUEST).json({ status: httpStatus.BAD_REQUEST, message: err });
        }

        var savedSportsman = await UserService.getUser(id);
        if (!savedSportsman) {
            return res.status(httpStatus.NOT_FOUND).json({ status: httpStatus.NOT_FOUND, message: "User not found" });
        }
        if (savedSportsman.role !== "Sportsman") {
            return res.status(httpStatus.BAD_REQUEST).json({ status: httpStatus.BAD_REQUEST, message: "User is Admin" });
        }

        var sportsman = {
            id: req.body.id,
            name: req.body.name ? req.body.name : null,
            surnames: req.body.surnames ? req.body.surnames : null,
            email: req.body.email ? req.body.email : null,
            mobileNumber: req.body.mobileNumber ? req.body.mobileNumber : null,
            active: req.body.active,
            password: req.body.password ? req.body.password : null
        };


        var updatedSportsman = await UserService.updateUser(sportsman);
        logService.createLog({
            description: `Actualizado usuario ${updatedSportsman.name} (${updatedSportsman._id}) 
        por ${req.authUser.role}: ${req.authUser.name} ${req.authUser.surnames}`
        });
        return res.status(httpStatus.OK).json({ status: httpStatus.OK, data: formatSportsman(updatedSportsman) });
    } catch (e) {
        return res.status(httpStatus.BAD_REQUEST).json({ status: httpStatus.BAD_REQUEST, message: e.message })
    }
};

exports.removeSportsman = async function (req, res, next) {

    var id = req.params.id;

    try {

        var savedSportsman = await UserService.getUser(id);

        if (savedSportsman.role !== "Sportsman") {
            return res.status(httpStatus.BAD_REQUEST).json({ status: httpStatus.BAD_REQUEST, message: "User is Admin" });
        }

        var deleted = await UserService.deleteUser(id);

        if (deleted) {
            logService.createLog({
                description: `Eliminado usuario ${deleted.name} (${deleted._id}) 
        por ${req.authUser.role}: ${req.authUser.name} ${req.authUser.surnames}`
            });
            return res.status(httpStatus.NO_CONTENT).json({
                status: httpStatus.NO_CONTENT,
                message: "Succesfully User Deleted"
            });
        }
        else {
            return res.status(httpStatus.NOT_FOUND).json({ status: httpStatus.NOT_FOUND, message: "User not found" });
        }

    } catch (e) {
        return res.status(httpStatus.BAD_REQUEST).json({ status: httpStatus.BAD_REQUEST, message: e.message })
    }
};

exports.getMyEvents = async function (req, res, next) {

    try {

        let user = req.authUser;

        var page = req.query.page ? req.query.page : 1;
        var limit = isNaN(req.query.limit) ? 5 : Number(req.query.limit);
        var term = req.query.search ? req.query.search : null;
        var type = req.query.type ? req.query.type : null;

        var query = { user: { $eq: user.id } };

        if (term) {
            query.$and = { tittleEvent: { $regex: term, $options: 'i' } };
        }

        var options = {
            page,
            limit
        };

        if (type)
            options.populate = [{
                path: 'event',
                match: { typeEvent: { $ne: type } }
            }];

        else
            options.populate = 'event';

        var participants = await participantService.getAllParticipant(query, options);

        participants.docs = participants.docs.map((participant) => {
            return formatParticipant(participant);
        });

        return res.status(httpStatus.OK).json({ status: httpStatus.OK, data: participants });

    } catch (e) {
        return res.status(httpStatus.BAD_REQUEST).json({ status: httpStatus.BAD_REQUEST, message: e.message });
    }
};

exports.getEventsTimeComparator = async function (req, res, next) {

    try {

        var myID = req.params.myID ? new ObjectId(req.params.myID) : null;
        var friendID = req.params.friendID ? new ObjectId(req.params.friendID) : null;

        var eventData = await EventService.getEventsTimecomparator(myID, friendID);

        return res.status(httpStatus.OK).json({ eventData });
    }

    catch (e) {
        return res.status(httpStatus.BAD_REQUEST).json({ error: e })
    }
};

function extractMessageErrors(errors) {
    let err = errors.details.map((o) => {
        return o.message;
    });
    return err;
}

function formatSportsman(sportsman) {
    return {
        id: sportsman._id,
        name: sportsman.name,
        surnames: sportsman.surnames,
        email: sportsman.email,
        mobileNumber: sportsman.mobileNumber,
        photo: sportsman.photo,
        role: sportsman.role,
        active: sportsman.active,
        createdAt: sportsman.createdAt,
    }
}

function formatParticipant(participant) {
    return {
        participantId: participant._id,
        event: participant.event ? formatEvent(participant.event) : null,
        dorsal: participant.dorsal,
        time: participant.time,
        category: participant.category,
        position: participant.position
    }
}

function formatEvent(event) {
    return {
        _id: event._id,
        tittle: event.tittle,
        celebrationDate: event.celebrationDate,
        closeInscriptions: event.closeInscriptions,
        description: event.description,
        typeEvent: event.typeEvent,
        categories: event.categories,
        distance: event.distance,
        limitInscriptions: event.limitInscriptions,
        typeInscription: event.typeInscription,
        city: event.city,
        location: event.location,
        photo: fileService.getPublicUrl(event.photo),
        document: fileService.getPublicUrl(event.document),
        active: event.active,
        sponsored: event.sponsored,
        temperature: event.temperature,
        temperatureMax: event.temperatureMax,
        temperatureMin: event.temperatureMin,
        chanceRain: event.chanceRain,
        overallStatus: event.overallStatus,
        createdAt: event.createdAt
    }
}