var User = require('../../models/user.model');

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
    }
    catch (e) {
        throw Error(e.message)
    }
};

exports.setNewEmail = async function (query, options) {

};

exports.setNewPassword = async function (query, options) {

};

exports.deleteUser = async function (query, options) {

};