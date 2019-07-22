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

exports.getPendRequests = async function (query, page, limit) {

    try {

        var options = {
            page: page,
            limit: limit,
            populate: 'userSent'
        };

        var pendRequests = Friends.paginate(query, options);
        return pendRequests;

    } catch (e) {
        throw Error(e);
    }
}

exports.setPendFriendship = async function (user1, user2) {

    try {

        var newFriendship = new Friends({
            userSent: user1,
            userTo: user2
        });

        var exists = false;

        //Search if this exists, because that's mean we've a friendship request already
        await Friends.find({
            $and: [{ userSent: user2 }, { userTo: user1 }]
        }, function(err, docs) {
                if (docs.length && docs.length === 1) {
                    exists = true;
                }
            }
        );

        if (!exists) return await newFriendship.save();
        else throw Error("Ya tienes una solicitud de amistad pendiente con esta persona")

    }
    catch (e) {
        throw Error(e.message);
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

exports.deleteFriendship = async function (myID, fID) {

    try {
        return Friends.findOneAndDelete({ $or: [{ userSent: myID, userTo: fID }, { userSent: fID, userTo: myID }] });
    }
    catch (e) {
        throw Error(e.message);
    }
}