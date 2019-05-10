const httpStatus = require('http-status');
const friendsService = require('../services/db/friends.service')

exports.getAllFriends = async function(req, res, next) {

    var page = req.query.page ? req.query.page : 1;
    var limit = req.query.limit ? req.query.limit : 15;
    var term = req.query.userid ? req.query.user1 : "";

    var query = {user1: userid};

    // if (term) {
    //     query = {
    //         active: true,
    //         $or: [
    //             {name: {$regex: term, $options: 'i'}},
    //             {surnames: {$regex: term, $options: 'i'}},
    //             {email: {$regex: term, $options: 'i'}},
    //             {"$where": `function() { return this._id.toString().match(/${term}/) != null;}`}
    //         ]
    //     }
    // }

    try {
        var friends = await friendsService.getAllFriends(query, page, limit)     
        
        friends.docs = friends.docs.map((friend) => {             
            
            return res.status(httpStatus.OK).json({status: httpStatus.OK, data: friends});
        });        
    }

    catch(e) {
        return res.status(httpStatus.BAD_REQUEST).json({status: httpStatus.BAD_REQUEST, message: e.message});
    }

}

exports.sendFriendship = async function(user1, user2) {

}