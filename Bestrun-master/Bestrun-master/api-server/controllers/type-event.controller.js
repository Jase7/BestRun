const httpStatus = require('http-status');
const TypeEventService = require('../services/db/type-event.service');
const ValidationService = require('../services/validation.service');
var logService = require('../services/db/logs.service');

exports.getAllTypeEvents = async function (req, res, next) {
    try {
        var typeEvents = await TypeEventService.getAllTypeEvents();
        typeEvents = typeEvents.map((typeEvent) => {
            return formatTypeEvent(typeEvent);
        });
        return res.status(httpStatus.OK).json({status: httpStatus.OK, data: typeEvents});
    } catch (e) {
        return res.status(httpStatus.BAD_REQUEST).json({status: httpStatus.BAD_REQUEST, message: e.message});
    }
};

exports.createTypeEvent = async function (req, res, next) {

    try {
        const errors = await ValidationService.typeEventCreateValidate(req.body);
        if (errors) {
            let err = extractMessageErrors(errors);
            return res.status(httpStatus.BAD_REQUEST).json({status: httpStatus.BAD_REQUEST, message: err});
        }

        var newTypeEvent = await TypeEventService.createTypeEvent(req.body);

        logService.createLog({description:`Tipo de evento ${newTypeEvent.name} creado 
        por ${req.authUser.role}: ${req.authUser.name} ${req.authUser.surnames}`});

        return res.status(httpStatus.CREATED).json({
            status: httpStatus.CREATED,
            data: formatTypeEvent(newTypeEvent),
            message: "Succesfully Created Type Event"
        });
    } catch (e) {
        return res.status(httpStatus.BAD_REQUEST).json({status: httpStatus.BAD_REQUEST, message: e.message});
    }
};

exports.removeTypeEvent = async function (req, res, next) {

    var id = req.params.id;

    try {
        var deleted = await TypeEventService.deleteTypeEvent(id);
        logService.createLog({description:`Tipo de evento ${deleted.name} eliminado 
        por ${req.authUser.role}: ${req.authUser.name} ${req.authUser.surnames}`});
        if (deleted)
            return res.status(httpStatus.NO_CONTENT).json({
                status: httpStatus.NO_CONTENT,
                message: "Succesfully Type Event Deleted"
            });
        return res.status(httpStatus.NOT_FOUND).json({status: httpStatus.NOT_FOUND, message: "Type Event not found"});
    } catch (e) {
        return res.status(httpStatus.BAD_REQUEST).json({status: httpStatus.BAD_REQUEST, message: e.message})
    }
};

function formatTypeEvent(typeEvent) {
    return {
        id: typeEvent._id,
        name: typeEvent.name
    }
}

function extractMessageErrors(errors) {
    let err = errors.details.map((o) => {
        return o.message
    });
    return err;
}