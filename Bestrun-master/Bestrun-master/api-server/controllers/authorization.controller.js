const httpStatus = require('http-status');
const JWTService = require('../services/jwt.service');

exports.onlySuperadmin = async function (req, res, next) {
    const result = await JWTService.getData(req.headers);
    if (!result)
        return res.status(httpStatus.UNAUTHORIZED).json({status: httpStatus.UNAUTHORIZED, message: "Not JWT token"});
    if (result.role !== 'Superadmin') {
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
    if ((result.role === 'Superadmin') || (result.role === 'Admin')) {
        next();
    } else {
        return res.status(httpStatus.FORBIDDEN).json({
            status: httpStatus.FORBIDDEN,
            message: "You not have permission"
        });
    }
};