const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

const UsersFriendsSchema = new mongoose.Schema({
    userSent: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    userTo: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    isFriendship: {
        type: Boolean,
        default: false
    }
}).index({ userSent: 1, userTo: 1 }, { unique: true });

UsersFriendsSchema.path("users");
UsersFriendsSchema.plugin(mongoosePaginate);
const UsersFriends = mongoose.model('UsersFriends', UsersFriendsSchema);
module.exports = UsersFriends;