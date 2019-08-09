const Event = require('../models/event.model');
const EventService = require('../services/db/event.service');
const fs = require('fs');
const httpStatus = require('http-status');

exports.getFile = async function (req, res, next) {

    var id = req.params.eventID ? req.params.eventID : null;

    if (id) {
        var event = await EventService.getEvent(id);        

        res.status(httpStatus.OK).json({ data: event.document });
    }
}