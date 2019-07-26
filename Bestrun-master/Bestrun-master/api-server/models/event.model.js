const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

const InscriptionSchema = new mongoose.Schema({
    tittle: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    active: {
        type: Boolean,
        default: true
    },
    price: {
        type: Number,
        required: true
    },
    taxPercentage: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    }
});
const Inscription = mongoose.model('Inscription', InscriptionSchema);

const EventSchema = new mongoose.Schema({
    tittle: {
        type: String,
        required: true
    },
    celebrationDate: {
        type: Date,
        default: Date.now
    },
    month: {
        type: Number,
        min: 1,
        max: 12,
        default: new Date().getUTCMonth() + 1
    },
    closeInscriptions: {
        type: Date
    },
    description: {
        type: String
    },
    typeEvent: {
        type: Schema.Types.ObjectId,
        ref: 'TypeEvent',
    },
    categories: {
        type: String
    },
    distance: {
        type: String
    },
    limitInscriptions: {
        type: Number,
        default: 0
    },
    typeInscription: [InscriptionSchema],
    city: {
        type: String
    },
    location: {
        type: String
    },
    photo: {
        type: String
    },
    active: {
        type: Boolean,
        default: true
    },
    document: {
        type: String
    },
    sponsored: {
        type: Boolean,
        default: false
    },
    participants: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            sparse: true
        }
    }],
    temperature: {
        type: Number
    },
    temperatureMax: {
        type: Number
    },
    temperatureMin: {
        type: Number
    },
    chanceRain: {
        type: Number
    },
    overallStatus: {
        type: String
    },
    iconWeather: {
        type: Number
    },
    showWeather: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    organizer: {
        type: String
    }
});

EventSchema.path('participants').index({sparse: true});
EventSchema.plugin(mongoosePaginate);
const Event = mongoose.model('Event', EventSchema);
module.exports = Event;
