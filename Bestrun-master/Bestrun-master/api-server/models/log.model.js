const mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

const LogSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

LogSchema.plugin(mongoosePaginate);
const Logs = mongoose.model('Logs', LogSchema);
module.exports = Logs;