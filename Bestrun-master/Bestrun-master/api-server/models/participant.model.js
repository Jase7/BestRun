const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

const ParticipantSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required:true,
        unique: false
    },
    event:{
        type: Schema.Types.ObjectId,
        ref: 'Event',
        required:true,
        unique: false
    },
    tittleEvent: {
        type: String,
        required: true
    },
    nameUser: {
        type: String,
        required: true
    },
    surnames: {
        type: String
    },
    email: {
        type: String
    },
    dorsal:{
        type:String
    },
    time:{
        type:String
    },
    category:{
        type:String
    },
    position:{
        type:String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

ParticipantSchema.index({ user: 1, event: 1 }, { unique: true });
ParticipantSchema.plugin(mongoosePaginate);
const Participant = mongoose.model('Participant', ParticipantSchema);
module.exports = Participant;
