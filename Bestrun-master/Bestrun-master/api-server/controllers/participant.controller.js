const userService = require('../services/db/user.service');
const eventService = require('../services/db/event.service');
const participantService = require('../services/db/participant.service');
const httpStatus = require('http-status');
var logService = require('../services/db/logs.service');

exports.getAllParticipants = async function (req, res, next) {
    const idEvent = req.params.idEvent;
    var page = req.query.page ? req.query.page : 1;
    var limit = req.query.limit ? req.query.limit : 15;
    var term = req.query.search ? req.query.search : null;

    var query = {event: {$eq: idEvent}};

    if (term) {
        query = {
            event: {$eq: idEvent},
            $or: [
                {nameUser: {$regex: term, $options: 'i'}},
                {surnames: {$regex: term, $options: 'i'}},
                {email: {$regex: term, $options: 'i'}},
                {dorsal: {$regex: term, $options: 'i'}},
                {"$where": `function() { return this.user.toString().match(/${term}/) != null;}`}]
        }
    }
    var options = {
        page,
        limit
    };

    try {

        var participants = await participantService.getAllParticipant(query, options);
        participants.docs = participants.docs.map((participant) => {
            return formatParticipant(participant);
        });
        return res.status(httpStatus.OK).json({status: httpStatus.OK, data: participants});
    } catch (e) {
        return res.status(httpStatus.BAD_REQUEST).json({status: httpStatus.BAD_REQUEST, message: e.message});
    }
};

exports.addParticipant = async function (req, res, next) {
    const idEvent = req.params.idEvent;
    const idUser = req.params.idUser;

    try {
        let user = await userService.addEvent(idUser, idEvent);
        let event = await eventService.addParticipant(idEvent, idUser);
        let participant = {
            user: idUser,
            event: idEvent,
            nameEvent: event.tittle,
            nameUser: user.name,
            surnames: user.surnames,
            email: user.email,
            dorsal: req.body.dorsal ? req.body.dorsal : null,
            time: req.body.time ? req.body.time : null,
            category: req.body.category ? req.body.category : null,
            position: req.body.position ? req.body.position : null
        };
        let newParticipant = await participantService.createParticipant(participant);

        logService.createLog({
            description: `Añadido participante ${newParticipant.nameUser} (${newParticipant.user}) a evento  ${newParticipant.tittleEvent} (${newParticipant.event}) 
        por ${req.authUser.role}: ${req.authUser.name} ${req.authUser.surnames}`
        });
        return res.status(httpStatus.CREATED).json({
            status: httpStatus.CREATED,
            data: formatParticipant(newParticipant)
        });
    } catch (e) {
        return res.status(httpStatus.BAD_REQUEST).json({status: httpStatus.BAD_REQUEST, message: e.message});
    }
};

exports.updateParticipant = async function (req, res, next) {
    try {

        var participant = {
            id: req.body.participantId,
            nameUser: req.body.nameUser,
            surnames: req.body.surnames,
            nameEvent: req.body.nameEvent,
            email: req.body.email,
            dorsal: req.body.dorsal,
            time: req.body.time,
            category: req.body.category ? req.body.category : null,
            position: req.body.position ? req.body.position : null
        };

        var updatedParticipant = await participantService.updateParticipant(participant);
        if (updatedParticipant)
            logService.createLog({
                description: `Actualizados tiempos del participante ${updatedParticipant.nameUser} (${updatedParticipant.user}) a evento  ${updatedParticipant.tittleEvent} (${updatedParticipant.event}) 
        por ${req.authUser.role}: ${req.authUser.name} ${req.authUser.surnames}`
            });
        return res.status(httpStatus.OK).json({status: httpStatus.OK, data: formatParticipant(updatedParticipant)});
        return res.status(httpStatus.NOT_FOUND).json({status: httpStatus.NOT_FOUND, message: "Participant not found"});
    } catch (e) {
        return res.status(httpStatus.BAD_REQUEST).json({status: httpStatus.BAD_REQUEST, message: e.message})
    }
};

exports.removeParticipant = async function (req, res, next) {

    var id = req.params.idParticipant;

    try {
        var deleted = await participantService.deleteParticipant(id);
        if (deleted)
            logService.createLog({
                description: `Eliminado participante ${deleted.nameUser} (${deleted.user}) a evento  ${deleted.tittleEvent} (${deleted.event}) 
        por ${req.authUser.role}: ${req.authUser.name} ${req.authUser.surnames}`
            });
        return res.status(httpStatus.NO_CONTENT).json({
            status: httpStatus.NO_CONTENT,
            message: "Succesfully Event Deleted"
        });
        return res.status(httpStatus.NOT_FOUND).json({status: httpStatus.NOT_FOUND, message: "Participant not found"});
    } catch (e) {
        return res.status(httpStatus.BAD_REQUEST).json({status: httpStatus.BAD_REQUEST, message: e.message})
    }
};

function formatParticipant(participant) {
    return {
        participantId: participant._id,
        userId: participant.user,
        eventId: participant.event,
        nameUser: participant.nameUser,
        surnames: participant.surnames,
        email: participant.email,
        nameEvent: participant.tittleEvent,
        dorsal: participant.dorsal,
        time: participant.time,
        category: participant.category,
        position: participant.position,
        createdAt: participant.createdAt,
    }
}