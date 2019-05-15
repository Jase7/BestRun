const httpStatus = require('http-status');
const friendsService = require('../services/db/friends.service');
var ObjectId = require('mongoose').Types.ObjectId

exports.getAllFriends = async function (req, res, next) {

    try {

        var page = req.query.page ? req.query.page : 1;
        var limit = req.query.limit ? req.query.limit : 15;
        var term = req.params.userid ? req.params.userid : "";

        var query = { userTo: new ObjectId(term) };

        var friends = await friendsService.getAllFriends(query, page, limit);

        friends.docs = friends.docs.map((friend) => {
            return friend;            
        });

        return res.status(httpStatus.OK).json({ status: httpStatus.OK, data: friends });
    }

    catch (e) {
        return res.status(httpStatus.BAD_REQUEST).json({ status: httpStatus.BAD_REQUEST, message: e.message });
    }

};

//METHOD: POST
//Create a new friendship/friend request
exports.sendFriendship = async function (req, res, next) {

    try {
        var sendFrienship = await friendsService.setPendFriendship(req.body.user1, req.body.user2);

        return res.json({ status: httpStatus.OK, data: sendFrienship.id });
    }

    catch (e) {

        return res.status(httpStatus.BAD_REQUEST).json({ status: httpStatus.BAD_REQUEST, message: e.message });
    }
};

//Method: PUT
//Accepts a friendship
exports.acceptFriendship = async function (req, res, next) {

    try {

        var id = req.body.id ? req.body.id : null;

        if (!id) throw Error("No user_friends id was provided by front-end");
        else {
            id = new ObjectId(id);
            var result = await friendsService.acceptFriendship(id);
            return res.json({ status: httpStatus.OK, data: result });
        }
    }
    catch (e) {

        return res.status(httpStatus.BAD_REQUEST).json({ status: httpStatus.BAD_REQUEST, message: e.message });
    }
};


//Method: DELETE
//Rejects a friendship/Delete document
exports.rejectFriendship = async function (req, res, next) {

    try {

        var id = req.params.id ? req.params.id : null;

        if (!id) throw Error("No user_friends id was provided by front-end");
        else {
            id = new ObjectId(id);
            var result = await friendsService.rejectFriendship(id);
            return res.json({ status: httpStatus.OK, data: result });
        }
    }

    catch (e) {

        return res.status(httpStatus.BAD_REQUEST).json({ status: httpStatus.BAD_REQUEST, message: e.message });
    }
};