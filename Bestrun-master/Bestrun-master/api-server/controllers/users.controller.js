const userService = require('../services/db/user.service');
const httpStatus = require('http-status');

exports.getAllUsers = async function (req, res, next) {
    var page = req.query.page ? req.query.page : 1;
    var limit = req.query.limit ? req.query.limit : 15;
    var term = req.query.search ? req.query.search : null;

    var query = {active: true};

    if (term) {
        query = {
            active: true,
            $or: [
                {name: {$regex: term, $options: 'i'}},
                {surnames: {$regex: term, $options: 'i'}},
                {email: {$regex: term, $options: 'i'}},
                {"$where": `function() { return this._id.toString().match(/${term}/) != null;}`}
            ]

        }
    }

    try {

        var users = await userService.getAllUsers(query, page, limit);
        users.docs = users.docs.map((users) => {
            return formatUsers(users);
        });
        return res.status(httpStatus.OK).json({status: httpStatus.OK, data: users});
    } catch (e) {
        return res.status(httpStatus.BAD_REQUEST).json({status: httpStatus.BAD_REQUEST, message: e.message});
    }
};

function formatUsers(users) {
    return {
        id: users._id,
        name: users.name,
        surnames: users.surnames,
        email: users.email,
        mobileNumber: users.mobileNumber,
        photo: users.photo,
        role: users.role,
        active: users.active,
        createdAt: users.createdAt,
    }
}