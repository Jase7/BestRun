var Friends = require('../../models/users_friends.model');
var LogService = require('./logs.service');
_this = this;

exports.getAllFriends = async function (query, page, limit, next) {

    var options = {
        page,
        limit
    };

    options.populate = [
        {
            path: 'userSent'
        },
        {
            path: 'userTo'
        }
    ];

    try {

    var allFriends = await Friends.paginate(query, options);
        return allFriends;

    } catch (err) {
        throw Error(err);
    }
};

exports.setPendFriendship = async function (user1, user2) {

    try {

        var newFriendship = new Friends({
            userSent: user1,
            userTo: user2
        });

        return await newFriendship.save();

    }
    catch (e) {
        throw Error('Error creating friendship');

    }
};

exports.acceptFriendship = async function (id) {

    try {
        return Friends.findOneAndUpdate({ _id: id }, { isFriendship: true });
    }

    catch (e) {
        throw Error(e.message);
    }


};


exports.rejectFriendship = async function (id) {

    try {
        return Friends.findOneAndDelete({ _id: id });
    }
    catch (e) {
        throw Error(e.message);
    }
};