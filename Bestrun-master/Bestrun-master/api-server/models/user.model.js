const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var deepPopulate = require('mongoose-deep-populate')(mongoose);

const AddressSchema = new mongoose.Schema({
    name: {
        type: String,
        maxlength: [40, 'too many characters'],
        required: true
    },
    surnames: {
        type: String,
        maxlength: [40, 'too many characters'],
    },
    mobileNumber: {
        type: String
    },
    address: {
        type: String
    },
    shirtsize: {
        type: String,
        enum: ['S', 'M', 'L', 'XL', 'XXL']
    },
    poblation: {
        type: String
    },
    county: {
        type: String
    },
    sex: {
        type: String,
        enum: ['Hombre', 'Mujer']
    },
    zipcode: {
        type: String
    },
    dni: {
        type: String
    },
    club: {
        type: String
    }

});

AddressSchema.plugin(deepPopulate);
const Address = mongoose.model('Address', AddressSchema);

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        maxlength: [40, 'too many characters'],
        required: true
    },
    surnames: {
        type: String,
        maxlength: [40, 'too many characters'],
    },
    email: {
        type: String,
        unique: [true, 'email is already in use']
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    photo: {
        type: String
    },
    accessProvider: {
        type: String,
        enum: ['Password', 'Google', 'Facebook']
    },
    password: {
        type: String,
        minlength: [8, 'so few characters']
    },
    facebookId: {
        type:String
    },
    googleId: {
        type:String
    },
    role: {
        type: String,
        enum: ['Sportsman', 'Admin', 'SuperAdmin'],
        default: 'Sportsman'
    },
    active: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    events: [{
        event: {
            type: Schema.Types.ObjectId,
            ref: 'Event'
        }
    }],
    addresses: [AddressSchema]    

});

UserSchema.path('events').index({sparse: true});
UserSchema.plugin(mongoosePaginate);
UserSchema.plugin(deepPopulate);
const User = mongoose.model('User', UserSchema);
module.exports = User;
