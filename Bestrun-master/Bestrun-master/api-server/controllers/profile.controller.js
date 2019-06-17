const httpStatus = require('http-status');
const profileService = require('../services/db/profile.service');
const userService = require('../services/db/user.service');
const ObjectId = require('mongoose').Types.ObjectId;

exports.getMyData = async function (req, res, next) {

    try {

        var userid = req.params.userid ? new ObjectId(req.params.userid) : null;
        var userData = await profileService.getMyData(userid);

        return res.json({ status: httpStatus.OK, data: userData });
    }
    catch (e) {
        return res.json({ status: httpStatus.BAD_REQUEST, data: e.message });
    }
};

exports.setNewPhoto = async function (req, res, next) {

    try {

        var userid = req.params.userid ? new ObjectId(req.params.userid) : null;
        var srcPhoto = req.body.srcPhoto ? req.body.srcPhoto : "";

        var userData = await profileService.setNewPhoto(userid, srcPhoto);

        return res.json({ status: httpStatus.OK, data: userData });
    }    
    catch (e) {
        return res.json({ status: httpStatus.BAD_REQUEST, data: e.message });
    }
};

exports.setNewEmail = async function (req, res, next) {

    try {
        var userid = req.params.userid ? new ObjectId(req.params.userid) : null;
        var newEmail = req.body.newEmail ? req.body.newEmail : "";

        var userData = await profileService.setNewEmail(userid, newEmail);

        return res.json({ status: httpStatus.OK, data: userData });
    }
    catch (e) {
        return res.status(400).json({ error: e.message });
    }

};

exports.setNewPassword = async function (req, res, next) {

    try {
        var userid = req.params.userid ? new ObjectId(req.params.userid) : null;
        var strOldPassword = req.body.strOldPassword ? req.body.strOldPassword : "";
        var strNewPassword = req.body.strNewPassword ? req.body.strNewPassword : "";

        var userData = await profileService.setNewPassword(userid, strOldPassword, strNewPassword);

        return res.json({ status: httpStatus.OK, data: userData });
    }
    catch (e) {
        return res.status(400).json({ error: e.message });
    }
};

exports.deleteUser = async function (req, res, next) {

    try {
        var userid = req.params.userid ? new ObjectId(req.params.userid) : null;

        var userData = await userService.deleteUser(userid);
        return res.json({ status: httpStatus.BAD_REQUEST, data: userData }); 
    }
    catch (e) {
        res.status(400).json({ error: e.message });
    }
};

exports.getPaymentMethod = async function (req, res, next) {

    try {

        var userid = req.params.userid ? new ObjectId(req.params.userid) : null;
        var paymentMethods = await profileService.getPaymentMethod(userid);

        return res.json(httpStatus.OK, { data: paymentMethods });
    }

    catch (e) {
        return res.status(400).json({ error: e.message });
    }


};

exports.setPaymentMethod = async function (req, res, next) {

    try {
        var userid = req.params.userid ? new ObjectId(req.params.userid) : null;
        var paymentMethod = req.body.paymentMethod ? req.body.paymentMethod : null;

        var userData = await profileService.setPaymentMethod(userid, paymentMethod);

        return res.json({ status: httpStatus.OK, data: userData });
    }

    catch (e) {
        return res.status(400).json({ error: e.message });
    }
};

exports.deletePaymentMethod = async function (req, res, next) {

    try {
        var userid = req.params.userid ? new ObjectId(req.params.userid) : null;
        var paymentID = req.params.pid ? req.params.pid : null;

        var userData = await profileService.deletePaymentMethod(userid, paymentID);

        return res.json({ status: httpStatus.OK, data: userData });
    }

    catch (e) {
        return res.status(400).json({ error: e.message });
    }
};

exports.saveProfileData = async function (req, res, next) {

    try {

        var userid = req.params.userid ? new ObjectId(req.params.userid) : null;
        var user = req.body.modelUser ? req.body.modelUser : null;

        if (user !== null) {
            var userData = await profileService.saveProfileData(userid, user);
            return res.status(httpStatus.OK).json({ data: userData });
        }
        else res.status(400).json({ error: "No se han facilitado datos para guardar" });
    }

    catch (e) {
        res.status(400).json({ error: e.message });
    }
}