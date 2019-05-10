const httpStatus = require('http-status');
const JWTService = require('../services/jwt.service');
const utils = require("./utils/models.format")

exports.onlySuperadmin = async function (req, res, next) {
    const result = await JWTService.getData(req.headers);
    if (!result)
        return res.status(httpStatus.UNAUTHORIZED).json({status: httpStatus.UNAUTHORIZED, message: "Not JWT token"});
    if (result.role !== utils.USER_TYPES.SUPERADMIN) {
        return res.status(httpStatus.FORBIDDEN).json({
            status: httpStatus.FORBIDDEN,
            message: "You not have permission"
        });
    }
    next();
};

exports.anyAdmin = async function (req, res, next) {
    
    const result = await JWTService.getData(req.headers);
    if (!result)
        return res.status(httpStatus.UNAUTHORIZED).json({status: httpStatus.UNAUTHORIZED, message: "Not JWT token"});
    if ((result.role === utils.USER_TYPES.SUPERADMIN) || (result.role === utils.USER_TYPES.ADMIN)) {
        next();
    } else {
        return res.status(httpStatus.FORBIDDEN).json({
            status: httpStatus.FORBIDDEN,
            message: "You not have permission"
        });
    }
};