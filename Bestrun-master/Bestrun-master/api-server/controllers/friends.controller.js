const httpStatus = require('http-status');
const friendsService = require('../services/db/friends.service');
var ObjectId = require('mongoose').Types.ObjectId

exports.getAllFriends = async function (req, res, next) {

    var page = req.query.page ? req.query.page : 1;
    var limit = req.query.limit ? req.query.limit : 15;
    var term = req.params.userid ? req.params.userid : "";

    var query = { user1: new ObjectId(term) };

    try {

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

exports.sendFriendship = async function (req, res, next) {

    try {
        var sendFrienship = await friendsService.setPendFriendship(req.body.user1, req.body.user2);

        return res.json({ status: httpStatus.OK, data: true });
    }

    catch (e) {
        return res.status(httpStatus.BAD_REQUEST).json({ status: httpStatus.BAD_REQUEST, message: e.message });
    }
};