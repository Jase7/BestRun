const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

const UsersFriendsSchema = new mongoose.Schema({
    user1: {
        type: Schema.Types.ObjectId,
        ref: "Users",
        required: true, 
        unique: true
    },
    user2: {
        type: Schema.Types.ObjectId,
        ref: "Users",
        required: true,
        unique: true
    },
});

UsersFriendsSchema.plugin(mongoosePaginate);
const UsersFriends = mongoose.model('UsersFriends', UsersFriendsSchema);
module.exports = UsersFriends;