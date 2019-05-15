﻿const httpStatus = require('http-status');
const profileService = require('../services/db/profile.service');
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
    }    
    catch (e) {
        return res.json({ status: httpStatus.BAD_REQUEST, data: e.message });
    }
};

exports.setNewEmail = async function (req, res, next) {
    return res.json({ status: httpStatus.BAD_REQUEST, data: "" });
};

exports.setNewPassword = async function (req, res, next) {
    return res.json({ status: httpStatus.BAD_REQUEST, data: "" });
};

exports.deleteUser = async function (req, res, next) {
    return res.json({ status: httpStatus.BAD_REQUEST, data: "" }); 
};