var User = require('../../models/user.model');
var passwordService = require('./../password.service');

exports.getMyData = async function (userid) {

    try {

        var userData = await User.findById(userid);
        return userData;
    }
    catch (e) {
        throw Error(e.message);
    }
};

exports.setNewPhoto = async function (userid, srcPhoto) {
    try {

        var userData = await User.findOneAndUpdate({ _id: userid }, { photo: srcPhoto });
        return userData;
    }
    catch (e) {
        throw Error(e.message);
    }
};

exports.setNewEmail = async function (userid, strEmail) {
    try {

        var userData = await User.findOneAndUpdate({ _id: userid }, { email: strEmail });
        return userData;
    }
    catch (e) {
        throw Error(e.message);
    }
};

exports.setNewPassword = async function (userid, strOldPassword, strNewPassword) {
    try {

        var oldPassword = await this.getMyData(userid).then((data) => {
            return data.password;
        });

        if (await passwordService.comparePasswords(strOldPassword, oldPassword)) {

            var hashPassword = await passwordService.generateHash(strNewPassword);
            var userData = await User.findOneAndUpdate({ _id: userid }, { password: hashPassword });
        }
        else {
            throw Error("Incorrect password");
        }

        return userData;
    }
    catch (e) {
        throw Error(e.message);
    }
};

exports.deleteUser = async function (userid) {
    try {

        var userData = await User.findOneAndDelete({ _id: userid });
    }
    catch (e) {
        throw Error(e.message);
    }
};