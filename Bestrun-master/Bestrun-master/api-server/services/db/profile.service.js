var User = require('../../models/user.model');
var Payment = require('../../models/payment_method.model');
var passwordService = require('./../password.service');
const ObjectId = require('mongoose').Types.ObjectId;


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

//exports.getPaymentMethod = async function (userid) {

//    try {
//        var query = { _id: userid };
//        var options = {};
//        options.populate = [
//            {
//                path: "paymentMethods"
//            }
//        ];

//        var userData = await User.paginate(query, options);

//        return userData;
//    }

//    catch (e) {
//        throw Error(e.message);
//    }
//};

//exports.setPaymentMethod = async function (userid, paymentMethod) {

//    try {
//        var p = new Payment(paymentMethod);
//        p.save();
//        var userData = await User.findOneAndUpdate({ _id: userid }, { $push: { paymentMethods: p } });
//        return userData;
//    }
//    catch (e) {
//        throw Error(e.message);
//    }
//};

//exports.deletePaymentMethod = async function (userid, pid) {

//    try {

//        var userData = await Payment.findOneAndDelete({ _id: pid });
//        userData = await User.findOneAndUpdate({ _id: userid }, { $pull: { paymentMethods: pid } });

//        return userData;
//    }

//    catch (e) {
//        throw Error(e.message);
//    }
//};

exports.saveAddress = async function (userid, address) {

    try {
        var naddress = new Object({
            name: address.name,
            surnames: address.surnames,
            club: address.club,
            county: address.county,
            dni: address.dni,
            mobileNumber: address.mobileNumber,
            poblation: address.poblation,
            sex: address.sex,
            shirtsize: address.shirtsize,
            zipcode: address.zipcode, 
            address: address.address
        });

        var data = await User.findByIdAndUpdate({ _id: userid }, {
                $push: { addresses: naddress }
            }
        );

        return data;

    } catch (e) {
        throw Error(e.message);
    }
}

exports.editAddress = async function (userid, address) {

    try {
        var data = await User.find({ _id: userid }).update({ "addresses._id": address._id },
            {
                $set: {
                    "addresses.$.address": address.address,
                    "addresses.$.name": address.name,
                    "addresses.$.surnames": address.surnames,
                    "addresses.$.mobileNumber": address.mobileNumber,
                    "addresses.$.shirtsize": address.shirtsize,
                    "addresses.$.poblation": address.poblation,
                    "addresses.$.county": address.county,
                    "addresses.$.sex": address.sex,
                    "addresses.$.zipcode": address.zipcode,
                    "addresses.$.dni": address.dni,
                    "addresses.$.club": address.club
                }
            }, { multi: true });

        return data;
    }

    catch (e) {
        throw Error(e.message);
    }

}

exports.deleteAddress = async function (userid, address) {

    try {
        var data = await User.findByIdAndUpdate({ "_id": userid },
            {
                "$pull": {
                    "addresses": { "_id": address }
                }
            }, { multi: true, safe: true });


        return data;
    }

    catch (e) {
        throw Error(e.message);
    }
}