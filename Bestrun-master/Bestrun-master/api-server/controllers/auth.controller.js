const httpStatus = require('http-status');

const ValidationService = require('../services/validation.service');
var UserService = require('../services/db/user.service');
var PasswordService = require('../services/password.service');
var JWTService = require('../services/jwt.service');
const Format = require('./utils/models.format');
var logService = require('../services/db/logs.service');
var utils = require('./utils/models.format');
var passwordService = require('../services/password.service');
const GoogleService = require('../services/google-credentials.service');
const FacebookService = require('../services/facebook-credentials.service');

_this = this;

exports.authenticated = async function (req, res, next) {
    const result = await JWTService.getData(req.headers);
    if (!result)
        return res.status(httpStatus.UNAUTHORIZED).json({status: httpStatus.UNAUTHORIZED, message: "Not JWT token"});
    req.authUser = result;
    next();
};

exports.getAuthUser = async function (req, res, next) {
    const result = await JWTService.getData(req.headers);
    req.authUser = result;
    next();
};

exports.signIn = async function (req, res, next) {
    var email = req.body.email;
    var password = req.body.password;

    try {
        var user = await UserService.getUserByEmail(email);
        if (!user)
            return res.status(httpStatus.UNAUTHORIZED).json({
                status: httpStatus.UNAUTHORIZED,
                message: 'Authentication failed. User not found.'
            });
        if(user.accessProvider!=='Password')
            return res.status(httpStatus.BAD_REQUEST).json({status: httpStatus.BAD_REQUEST, message: `Authentication failed. Your access by ${user.accessProvider}`});
        var correctPassword = await PasswordService.comparePasswords(password, user.password);
        if (correctPassword) {
            logService.createLog({description: `Acceso de usuario ${user.name}${user.surnames}: ${user.role}`});
            return res.status(httpStatus.OK)
                .json(
                    {
                        token: 'JWT ' + JWTService.generateJWT(user.name, user.surnames, user.id, user.email, user.role, user.active),
                        role: user.role,
                        userid: user.id
                    });
        }
        return res.status(httpStatus.UNAUTHORIZED).json({
            status: httpStatus.UNAUTHORIZED,
            message: 'Authentication failed. Wrong password.'
        });
    } catch (e) {
        return res.status(httpStatus.BAD_REQUEST).json({status: httpStatus.BAD_REQUEST, message: e.message});
    }
};

exports.register = async function (req, res, next) {
    try {
        const errors = await ValidationService.sportsmanCreateValidate(req.body);
        if (errors) {
            let err = utils.extractMessageErrors(errors);
            return res.status(httpStatus.BAD_REQUEST).json({status: httpStatus.BAD_REQUEST, message: err});
        }

        req.body.role = utils.USER_TYPES.SPORTSMAN
        req.body.accessProvider= 'Password';
        req.body.password = await passwordService.generateHash(req.body.password);
        const newSportsman = await UserService.createUser(req.body);
        return res.status(httpStatus.CREATED).json({
            status: httpStatus.CREATED,
            data: {
                token: 'JWT ' + JWTService.generateJWT(newSportsman.name, newSportsman.surnames, newSportsman.id, newSportsman.email, newSportsman.role, newSportsman.active),
                data: utils.formatSportsman(newSportsman),
                role: newSportsman.role,
                userid: newSportsman.id
            },
            message: "Succesfully Created Sportsman"
        });
    } catch (e) {
        return res.status(httpStatus.BAD_REQUEST).json({status: httpStatus.BAD_REQUEST, message: e.message});
    }
};

exports.getProfile = async function (req, res, next) {
    const result = await JWTService.getData(req.headers);
    if (!result)
        return res.status(httpStatus.UNAUTHORIZED).json({status: httpStatus.UNAUTHORIZED, message: "Not JWT token"});
    try {
        var admin = await UserService.getUser(result.id);
        if (!admin)
            return res.status(httpStatus.UNAUTHORIZED).json({
                status: httpStatus.UNAUTHORIZED,
                message: 'Authentication failed. User not found.'
            });
        return res.status(httpStatus.OK).json({status: httpStatus.OK, data: Format.formatAdmin(admin)});
    } catch (e) {
        return res.status(httpStatus.NOT_FOUND).json({status: httpStatus.NOT_FOUND, message: e.message});
    }
};

exports.signInFacebook = async function (req, res, next) {
    var code = req.body.code;
    try {
        var userFacebook = await FacebookService.getUser(code);
        userFacebook.role = utils.USER_TYPES.SPORTSMAN;
        userFacebook.accessProvider= 'Facebook';
        var user = await UserService.getUserFacebookId(userFacebook.facebookId);
        if (!user) {
            const newSportsman = await UserService.createUser(userFacebook);
            return res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                data: {
                    token: 'JWT ' + JWTService.generateJWT(newSportsman.name, newSportsman.surnames, newSportsman.id, newSportsman.email, newSportsman.role, newSportsman.active),
                    data: utils.formatSportsman(newSportsman),
                    role: newSportsman.role,
                    userid: newSportsman.id
                },
                message: "Successfully Logged Sportsman"
            });
        }
        return res.status(httpStatus.OK)
            .json({
                status: httpStatus.OK,
                data: {
                    token: 'JWT ' + JWTService.generateJWT(user.name, user.surnames, user.id, user.email, user.role, user.active),
                    data: utils.formatSportsman(user),
                    role: user.role,
                    userid: user.id
                },
                message: "Successfully Logged Sportsman"
            });
    } catch (e) {
        console.log(e);
        return res.status(httpStatus.UNAUTHORIZED).json({
            status: httpStatus.UNAUTHORIZED,
            message: 'Authentication with facebook failed. Already register with password o google?'
        });
    }
};


exports.signInGoogle = async function (req, res, next) {
    var code = req.body.code;
    try {
        var userGoogle = await GoogleService.getUser(code);
        userGoogle.role = utils.USER_TYPES.SPORTSMAN;
        userGoogle.accessProvider= 'Google';
        var user = await UserService.getUserGoogleId(userGoogle.googleId);
        if (!user) {
            const newSportsman = await UserService.createUser(userGoogle);
            console.log(newSportsman);
            return res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                data: {
                    token: 'JWT ' + JWTService.generateJWT(newSportsman.name, newSportsman.surnames, newSportsman.id, newSportsman.email, newSportsman.role, newSportsman.active),
                    data: utils.formatSportsman(newSportsman),
                    role: newSportsman.role,
                    userid: newSportsman.id
                },
                message: "Successfully Logged Sportsman"
            });
        }
        return res.status(httpStatus.OK)
            .json({
                status: httpStatus.OK,
                data: {
                    token: 'JWT ' + JWTService.generateJWT(user.name, user.surnames, user.id, user.email, user.role, user.active),
                    data: utils.formatSportsman(user),
                    role: user.role,
                    userid: user.id
                },
                message: "Successfully Logged Sportsman"
            });
    } catch (e) {
        console.log(e);
        return res.status(httpStatus.UNAUTHORIZED).json({
            status: httpStatus.UNAUTHORIZED,
            message: 'Authentication with google failed. Already register with password o google?'
        });
    }
};