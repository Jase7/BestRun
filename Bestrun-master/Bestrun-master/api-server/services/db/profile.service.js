var User = require('../../models/user.model');
var Payment = require('../../models/payment_method.model');
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

exports.getPaymentMethod = async function (userid) {

    try {
        var query = { _id: userid };
        var options = {};
        options.populate = [
            {
                path: "paymentMethods"
            }
        ];

        var userData = await User.paginate(query, options);

        return userData;
    }

    catch (e) {
        throw Error(e.message);
    }
};

exports.setPaymentMethod = async function (userid, paymentMethod) {

    try {
        var p = new Payment(paymentMethod);
        p.save();
        var userData = await User.findOneAndUpdate({ _id: userid }, { $push: { paymentMethods: p } });
        return userData;
    }
    catch (e) {
        throw Error(e.message);
    }
};

exports.deletePaymentMethod = async function (userid, pid) {

    try {

        var userData = await Payment.findOneAndDelete({ _id: pid });
        userData = await User.findOneAndUpdate({ _id: userid }, { $pull: { paymentMethods: pid } });

        return userData;
    }

    catch (e) {
        throw Error(e.message);
    }
};

exports.saveProfileData = async function (userid, user) {

    try {
        var modelUser = new User(user);
        var data = await User.findByIdAndUpdate({ _id: userid }, {
            name: modelUser.name, surnames: modelUser.surnames, mobileNumber: modelUser.mobileNumber,
            address: modelUser.address, shirtsize: modelUser.shirtsize, poblation: modelUser.poblation,
            county: modelUser.county, sex: modelUser.sex, zipcode: modelUser.zipcode, dni: modelUser.dni, club: modelUser.club
        });

        return data;

    } catch (e) {
        throw Error(e.message);
    }
}