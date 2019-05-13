var Friends = require('../../models/users_friends.model');
var LogService = require('./logs.service');
_this = this;

exports.getAllFriends = async function(query, page, limit) {

    var options = {
        page,
        limit
    };

    try {

        var allFriends = await Friends.paginate(query, options)
        return allFriends;

    } catch (err) {       
        throw Error(`Error while Paginating friends`);
    }
}

exports.setPendFriendship = async function (user1, user2) {

    try {

        var newFriendship = new Friends({
            user1: user1,
            user2: user2
        });

        return await newFriendship.save();

    }
    catch (e) {
        throw Error('Error creating friendship');
    }
}