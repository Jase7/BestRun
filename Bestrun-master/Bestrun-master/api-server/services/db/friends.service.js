var Friends = require('../../models/users_friends.model');
var LogService = require('./logs.service')
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