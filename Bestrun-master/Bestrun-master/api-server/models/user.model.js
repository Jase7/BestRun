const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var deepPopulate = require('mongoose-deep-populate')(mongoose);

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
    mobileNumber: {
        type: String
        // match: [/\d{9}$/, 'The value of path {PATH} ({VALUE}) is not a valid mobile number.']
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
    address: {
        type: String
    },
    shirtsize: {
        type: String,
        enum: ['S', 'M', 'L', 'XL', 'XXL']
    }, 
    paymentMethods: [{type: Schema.Types.ObjectId, ref: "PaymentMethod"}]

});

UserSchema.path('events').index({sparse: true});
UserSchema.plugin(mongoosePaginate);
UserSchema.plugin(deepPopulate);
const User = mongoose.model('User', UserSchema);
module.exports = User;
