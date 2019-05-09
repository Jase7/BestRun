const httpStatus = require('http-status');
const LogsService = require('../services/db/logs.service');

exports.getAllLogs = async function (req, res, next) {
    var page = req.query.page ? req.query.page : 1;
    var limit = req.query.limit ? req.query.limit : 20;

    try {
        var logs = await LogsService.getAllLogs({}, page, limit);
        return res.status(httpStatus.OK).json({status: httpStatus.OK, data: logs});
    } catch (e) {
        return res.status(httpStatus.BAD_REQUEST).json({status: httpStatus.BAD_REQUEST, message: e.message});
    }
};