const mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

const UserTypeSchema = new mongoose.Schema({
    description: {
        type: String,
        unique: true
    }
});

UserTypeSchema.plugin(mongoosePaginate);
const UserType = mongoose.model('Usertype', UserTypeSchema);
module.exports = UserType;