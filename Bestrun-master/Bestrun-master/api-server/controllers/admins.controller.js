const User = require('../models/user.model');
const httpStatus = require('http-status');
const UserService = require('../services/db/user.service');
const ValidationService = require('../services/validation.service');
const PasswordService = require('../services/password.service');
const logService = require('../services/db/logs.service');
const utils = require("./utils/models.format")

exports.getAllAdmins = async function (req, res, next) {
    var page = req.query.page ? req.query.page : 1;
    var limit = req.query.limit ? req.query.limit : 15;

    try {
        const errors = await ValidationService.queryValidate(req.query);
        if(errors){
            return res.status(httpStatus.BAD_REQUEST).json({status: httpStatus.BAD_REQUEST, message: errors});
        }

        var admins = await UserService.getAllUsers({role:[utils.USER_TYPES.ADMIN, utils.USER_TYPES.SUPERADMIN]}, page, limit);
        admins.docs = admins.docs.map((admin) => {
            return formatAdmin(admin);
        });
        return res.status(httpStatus.OK).json({status: httpStatus.OK, data: admins});
    } catch (e) {
        return res.status(httpStatus.BAD_REQUEST).json({status: httpStatus.BAD_REQUEST, message: e.message});
    }
};

exports.createAdmin = async function (req, res, next) {

    try {
        const errors = await ValidationService.adminCreateValidate(req.body);
        if(errors){
            let err = extractMessageErrors(errors);
            return res.status(httpStatus.BAD_REQUEST).json({status: httpStatus.BAD_REQUEST, message: err});
        }

        req.body.role = utils.USER_TYPES.ADMIN
        req.body.accessProvider= 'Password';
        req.body.password = await PasswordService.generateHash(req.body.password);
        var newAdmin = await UserService.createUser(req.body);

        logService.createLog({description:`Usuario administrador ${newAdmin.name} creado 
        por ${req.authUser.role}: ${req.authUser.name} ${req.authUser.surnames}`});

        return res.status(httpStatus.CREATED).json({
            status: httpStatus.CREATED,
            data: formatAdmin(newAdmin),
            message: "Succesfully Created Admin"
        });
    } catch (e) {
        return res.status(httpStatus.BAD_REQUEST).json({status: httpStatus.BAD_REQUEST, message: e.message});
    }
};

exports.getAdmin = async function (req, res, next) {
    var id = req.params.id;

    try {
        var savedAdmin = await UserService.getUser(id);
        if(savedAdmin)
            return res.status(httpStatus.OK).json({status: httpStatus.OK, data: formatAdmin(savedAdmin)});
        return res.status(httpStatus.NOT_FOUND).json({status: httpStatus.NOT_FOUND, message: "User not found"});
    } catch (e) {
        return res.status(httpStatus.NOT_FOUND).json({status: httpStatus.NOT_FOUND, message: e.message});
    }
};

exports.updateAdmin = async function (req, res, next) {
    try {

        const errors = await ValidationService.adminUpdateValidate(req.body);
        if(errors){
            let err = extractMessageErrors(errors);
            return res.status(httpStatus.BAD_REQUEST).json({status: httpStatus.BAD_REQUEST, message: err});
        }

        var admin = {
            id:req.body.id,
            name: req.body.name ? req.body.name : null,
            surnames: req.body.surnames ? req.body.surnames : null,
            email: req.body.email ? req.body.email : null,
            mobileNumber: req.body.mobileNumber ? req.body.mobileNumber : null,
            active: req.body.active,
            password: req.body.password ? req.body.password : null,
            role: req.body.rol ? req.body.rol : "Admin"
        };

        var updatedAdmin = await UserService.updateUser(admin);
        logService.createLog({description:`Usuario administrador ${updatedAdmin.name} actualizado 
        por ${req.authUser.role}: ${req.authUser.name} ${req.authUser.surnames}`});
        if(updatedAdmin)
            return res.status(httpStatus.OK).json({status: httpStatus.OK, data: formatAdmin(updatedAdmin)});
        return res.status(httpStatus.NOT_FOUND).json({status: httpStatus.NOT_FOUND, message: "User not found"});
    } catch (e) {
        return res.status(httpStatus.BAD_REQUEST).json({status: httpStatus.BAD_REQUEST, message: e.message})
    }
};

exports.removeAdmin = async function (req, res, next) {

    var id = req.params.id;

    try {
        var savedAdmin = await UserService.getUser(id);
        if (savedAdmin.role !== utils.USER_TYPES.ADMIN) {
            return res.status(httpStatus.BAD_REQUEST).json({status: httpStatus.BAD_REQUEST, message: "User is Superadmin"});
        }
        var deleted = await UserService.deleteUser(id);
        logService.createLog({description:`Usuario administrador ${deleted.name} eliminado 
        por ${req.authUser.role}: ${req.authUser.name} ${req.authUser.surnames}`});
        if(deleted)
            return res.status(httpStatus.NO_CONTENT).json({status: httpStatus.NO_CONTENT, message: "Succesfully User Deleted"})
        return res.status(httpStatus.NOT_FOUND).json({status: httpStatus.NOT_FOUND, message: "User not found"});
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

function formatAdmin(admin) {
    return {
        id: admin._id,
        name: admin.name,
        surnames: admin.surnames,
        email: admin.email,
        mobileNumber: admin.mobileNumber,
        photo: admin.photo,
        role: admin.role,
        active: admin.active,
        createdAt: admin.createdAt,
    }
}