const Event = require('../models/event.model');
const httpStatus = require('http-status');
const EventService = require('../services/db/event.service');
const fileService = require('../services/files.service');
const ValidationService = require('../services/validation.service');
var logService = require('../services/db/logs.service');

exports.getAllEvents = async function (req, res, next) {
    var page = req.query.page ? req.query.page : 1;
    var limit = isNaN(req.query.limit) ? 5 : Number(req.query.limit);
    var term = req.query.search ? req.query.search : null;

    var query = {};

    if (req.authUser && req.authUser.role !== "Sportsman") {
        if (term) {
            query.$or = [
                {tittle: {$regex: term, $options: 'i'}},
                {"$where": `function() { return this._id.toString().match(/${term}/) != null;}`}
            ];
        }
    }
    try {
        var events = await EventService.getAllEvents(query, page, limit);
        events.docs = events.docs.map((event) => {
            return formatEvent(event);
        });
        return res.status(httpStatus.OK).json({status: httpStatus.OK, data: events});
    } catch (e) {
        return res.status(httpStatus.BAD_REQUEST).json({status: httpStatus.BAD_REQUEST, message: e.message});
    }
};

exports.getEvents = async function (req, res, next) {
    var page = req.query.page ? req.query.page : 1;
    var limit = isNaN(req.query.limit) ? 5 : Number(req.query.limit);
    var term = req.query.search ? req.query.search : null;
    var type = req.query.type ? req.query.type : null;
    var city = req.query.city ? req.query.city : null;
    var month = req.query.month ? req.query.month : null;

    var query = {};

    query.active = true;
    query.celebrationDate = {"$gte": Date.now()};
    if (type)
        query.typeEvent = type;
    if (city) {
        if (!query.$and)
            query.$and = [];
        query.$and.push({city: {$regex: city, $options: 'i'}});
    }
    if (month)
        query.month = month;
    // if (term) {
    //     if (!query.$or)
    //         query.$or = [];
    //     query.$or.push({tittle: {$regex: term, $options: 'i'}});
    // }
    try {
        var events = await EventService.getAllEvents(query, page, limit);
        events.docs = events.docs.map((event) => {
            return formatEvent(event);
        });
        return res.status(httpStatus.OK).json({status: httpStatus.OK, data: events});
    } catch (e) {
        return res.status(httpStatus.BAD_REQUEST).json({status: httpStatus.BAD_REQUEST, message: e.message});
    }
};

exports.createEvent = async function (req, res, next) {

    try {
        const errors = await ValidationService.eventsCreateValidate(req.body);
        if (errors) {
            let err = extractMessageErrors(errors);
            return res.status(httpStatus.BAD_REQUEST).json({status: httpStatus.BAD_REQUEST, message: err});
        }

        var newEvent = await EventService.createEvent(req.body);

        logService.createLog({
            description: `Nuevo evento ${newEvent.tittle} (${newEvent._id}) creado 
        por ${req.authUser.role}: ${req.authUser.name} ${req.authUser.surnames}`
        });

        return res.status(httpStatus.CREATED).json({
            status: httpStatus.CREATED,
            data: formatEvent(newEvent),
            message: "Succesfully Created Event"
        });
    } catch (e) {
        return res.status(httpStatus.BAD_REQUEST).json({status: httpStatus.BAD_REQUEST, message: e.message});
    }
};

exports.getEvent = async function (req, res, next) {
    var id = req.params.id;

    try {
        var savedEvent = await EventService.getEvent(id);
        if (savedEvent)
            return res.status(httpStatus.OK).json({status: httpStatus.OK, data: formatEvent(savedEvent)});
        return res.status(httpStatus.NOT_FOUND).json({status: httpStatus.NOT_FOUND, message: "Event not found"});
    } catch (e) {
        return res.status(httpStatus.NOT_FOUND).json({status: httpStatus.NOT_FOUND, message: e.message});
    }
};

exports.updateEvent = async function (req, res, next) {
    try {

        const errors = await ValidationService.eventsUpdateValidate(req.body);
        if (errors) {
            let err = extractMessageErrors(errors);
            return res.status(httpStatus.BAD_REQUEST).json({status: httpStatus.BAD_REQUEST, message: err});
        }

        var event = {
            id: req.body.id,
            tittle: req.body.tittle ? req.body.tittle : null,
            categories: req.body.categories ? req.body.categories : null,
            celebrationDate: req.body.celebrationDate ? req.body.celebrationDate : null,
            closeInscriptions: req.body.closeInscriptions ? req.body.closeInscriptions : null,
            city: req.body.city ? req.body.city : null,
            description: req.body.description ? req.body.description : null,
            distance: req.body.distance ? req.body.distance : null,
            typeEvent: req.body.typeEvent ? req.body.typeEvent : null,
            typeInscription: req.body.typeInscription ? req.body.typeInscription : null,
            location: req.body.location ? req.body.location : null,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            sponsored: req.body.sponsored,
            temperature: req.body.temperature,
            temperatureMax: req.body.temperatureMax,
            temperatureMin: req.body.temperatureMin,
            chanceRain: req.body.chanceRain,
            overallStatus: req.body.overallStatus,
            iconWeather: req.body.iconWeather,
            showWeather: req.body.showWeather,
            active: req.body.active,
            organizer: req.body.organizer
        };

        var updatedEvent = await EventService.updateEvent(event);
        logService.createLog({
            description: `Evento ${updatedEvent.tittle} (${updatedEvent._id}) actualizado 
        por ${req.authUser.role}: ${req.authUser.name} ${req.authUser.surnames}`
        });
        if (updatedEvent)
            return res.status(httpStatus.OK).json({status: httpStatus.OK, data: formatEvent(updatedEvent)});
        return res.status(httpStatus.NOT_FOUND).json({status: httpStatus.NOT_FOUND, message: "Event not found"});
    } catch (e) {
        return res.status(httpStatus.BAD_REQUEST).json({status: httpStatus.BAD_REQUEST, message: e.message})
    }
};

exports.removeEvent = async function (req, res, next) {

    var id = req.params.id;

    try {
        var deleted = await EventService.deleteEvent(id);
        if (deleted)
            logService.createLog({
                description: `Evento ${deleted.tittle} (${id}) eliminado 
        por ${req.authUser.role}: ${req.authUser.name} ${req.authUser.surnames}`
            });
        return res.status(httpStatus.NO_CONTENT).json({
            status: httpStatus.NO_CONTENT,
            message: "Succesfully Event Deleted"
        })
        
    } catch (e) {
        return res.status(httpStatus.BAD_REQUEST).json({status: httpStatus.BAD_REQUEST, message: e.message})
    }
};

exports.uploadFile = async function (req, res, next) {
    if (!req.file) {
        return res.status(httpStatus.BAD_REQUEST).json({
            status: httpStatus.BAD_REQUEST,
            message: 'Not document to upload'
        })
    }

    var id = req.params.id;

    try {
        var fileName = await fileService.sendFileToGCS(req.file);
        var previousDoc = await EventService.changeDocument(id, fileName);

        if (previousDoc)
            fileService.deleteFileToGCS(previousDoc);
        var updatedEvent = await EventService.getEvent(id);
        logService.createLog({
            description: `Añadido archivo ${fileName} a evento ${updatedEvent.tittle} (${id}) subido 
        por ${req.authUser.role}: ${req.authUser.name} ${req.authUser.surnames}`
        });
        return res.status(httpStatus.OK).json({status: httpStatus.OK, data: formatEvent(updatedEvent)});
    } catch (e) {
        return res.status(httpStatus.BAD_REQUEST).json({status: httpStatus.BAD_REQUEST, message: e.message})
    }
};

exports.deleteFile = async function (req, res, next) {
    var id = req.params.id;

    try {
        var previousDoc = await EventService.changeDocument(id, null);
        if (previousDoc)
            fileService.deleteFileToGCS(previousDoc);
        var updatedEvent = await EventService.getEvent(id);
        logService.createLog({
            description: `Eliminado archivo ${previousDoc} a evento ${updatedEvent.tittle} (${id}) eliminado 
        por ${req.authUser.role}: ${req.authUser.name} ${req.authUser.surnames}`
        });
        return res.status(httpStatus.OK).json({status: httpStatus.OK, data: formatEvent(updatedEvent)});
    } catch (e) {
        return res.status(httpStatus.BAD_REQUEST).json({status: httpStatus.BAD_REQUEST, message: e.message})
    }
};

exports.uploadPhoto = async function (req, res, next) {
    if (!req.file) {
        return res.status(httpStatus.BAD_REQUEST).json({status: httpStatus.BAD_REQUEST, message: 'Not image to upload'})
    }

    var id = req.params.id;

    try {
        var fileName = await fileService.sendFileToGCS(req.file);
        var previousImage = await EventService.changePhoto(id, fileName);

        if (previousImage)
            fileService.deleteFileToGCS(previousImage);

        var updatedEvent = await EventService.getEvent(id);
        logService.createLog({
            description: `Añadida imagen ${fileName} a evento ${updatedEvent.tittle} (${id}) añadida 
        por ${req.authUser.role}: ${req.authUser.name} ${req.authUser.surnames}`
        });
        return res.status(httpStatus.OK).json({status: httpStatus.OK, data: formatEvent(updatedEvent)});
    } catch (e) {
        return res.status(httpStatus.BAD_REQUEST).json({status: httpStatus.BAD_REQUEST, message: e.message})
    }
};

exports.deletePhoto = async function (req, res, next) {
    var id = req.params.id;

    try {
        var previousImage = await EventService.changePhoto(id, null);
        if (previousImage)
            fileService.deleteFileToGCS(previousImage);
        var updatedEvent = await EventService.getEvent(id);
        logService.createLog({
            description: `Eliminada imagen ${previousImage} a evento ${updatedEvent.tittle} (${id}) eliminada 
        por ${req.authUser.role}: ${req.authUser.name} ${req.authUser.surnames}`
        });
        return res.status(httpStatus.OK).json({status: httpStatus.OK, data: formatEvent(updatedEvent)});
    } catch (e) {
        return res.status(httpStatus.BAD_REQUEST).json({status: httpStatus.BAD_REQUEST, message: e.message})
    }
};

function extractMessageErrors(errors) {
    let err = errors.details.map((o) => {
        return o.message
    });
    return err;
}

function formatEvent(event) {
    return {
        id: event._id,
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
        iconWeather: event.iconWeather,
        showWeather: event.showWeather,
        createdAt: event.createdAt,
        organizer: event.organizer
    }
}