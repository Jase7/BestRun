var User = require('../../models/user.model');
var passwordService = require('../password.service');
var PaymentMethod = require('../../models/payment_method.model');
_this = this;

exports.getUserByEmail = async function (email) {
    try {
        var user = await User.findOne({email: email});
        if (!user) return null;
        return user;
    } catch (e) {
        throw Error('Error while get User');
    }
};

exports.getUserGoogleId = async function (googleId) {
    try {
        var user = await User.findOne({googleId: googleId});
        if (!user) return null;
        return user;
    } catch (e) {
        throw Error('Error while get User');
    }
};

exports.getUserFacebookId = async function (facebookId) {
    try {
        var user = await User.findOne({facebookId: facebookId});
        console.log(facebookId);
        console.log(user);
        if (!user) return null;
        return user;
    } catch (e) {
        throw Error('Error while get User');
    }
};

exports.getUserByName = async function (query, page, limit) {

    var options = {
        page,
        limit
    };

    try {
        return User.paginate(query, options);
    }
    catch (e) {
        throw Error(e.message);
    }
};

exports.createUser = async function (user) {
    var newUser = new User({
        name: user.name,
        surnames: user.surnames,
        email: user.email,
        emailVerified: user.emailVerified,
        mobileNumber: user.mobileNumber,
        accessProvider: user.accessProvider,
        password: user.password,
        facebookId: user.facebookId,
        googleId: user.googleId,
        photo: user.photo,
        role: user.role,
        active: user.active,
        createdAt: new Date(),
        events: new Array()
    });

    try {
        var savedUser = await newUser.save();
        return savedUser;
    } catch (e) {
        manageErrors(e);
    }
};

existsUser = async (email) => {
    try {
        let userExists = await this.getUserByEmail(email);
        if (userExists)
            return true;
        return false;
    } catch (e) {
        manageErrors(e);
    }
};

exports.getUser = async function (idUser) {
    try {
        var savedUser = await User.findById(idUser);
        return savedUser;
    } catch (e) {
        throw Error(`Not exist user ${idUser}`);
    }
};

exports.getAllUsers = async function (query, page, limit) {
    var options = {
        page,
        limit
    };

    try {
        var allUsers = await User.paginate(query, options);
        return allUsers;
    } catch (e) {
        throw Error(`Error while Paginating admins`);
    }
};

exports.updateUser = async function (user) {
    var id = user.id;

    try {
        var oldUser = await User.findById(id);
    } catch (e) {
        throw Error("Error occured while Finding the User")
    }

    if (!oldUser) {
        return false;
    }

    oldUser.name = user.name;
    oldUser.surnames = user.surnames;
    oldUser.email = user.email;
    oldUser.mobileNumber = user.mobileNumber;
    oldUser.photo = user.photo ? user.photo : oldUser.photo;
    oldUser.active = user.active;
    oldUser.role = user.role;
    oldUser.password = user.password ? await passwordService.generateHash(user.password) : oldUser.password;

    try {
        var savedUser = await oldUser.save();
        return savedUser;
    } catch (e) {
        manageErrors(e);
    }
};

exports.deleteUser = async function (id) {

    try {
        var deleted = await User.findByIdAndRemove(id);
        return deleted
    } catch (e) {
        throw Error("Error Occured while Deleting the User")
    }
};

exports.addEvent = async function (idUser, idEvent) {
    try {
        return await User.findOneAndUpdate({_id: idUser}, {$push: {user: idEvent}});
    } catch (e) {
        //no tratado posible evento ya anadido
        throw Error('Error adding event to User');
    }
};

function manageErrors(e) {
    let err;
    switch (e.code || e.name) {
        case "ValidationError":
            err = e._message;
            break;
        case 11000:
            err = 'Email already exists!';
            break;
        default:
            err = e.message;
            break;
    }
    throw Error(err);
}