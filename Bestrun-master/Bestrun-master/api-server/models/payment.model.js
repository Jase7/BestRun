const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
const UserModel = require('./user.model');
const EventModel = require('./event.model');

const PaymentMethodSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    address: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    event: {
        type: Schema.Types.ObjectId,
        ref: 'Event'
    },
    typeInscription: {
        type: Schema.Types.ObjectId,
        ref: 'Event'
    },
    price: {
        type: String
    },
    shippingCosts: {
        type: String
    },
    paymentDate: {
        type: Date,
        default: Date.now()
    },
    status: {
        type: String,
        default: 'Pendiente'
    },
    sending: {
        type: Boolean
    }, 
    paymentOrder: {
        type: String
    }
})

PaymentMethodSchema.plugin(mongoosePaginate);
const Payment = mongoose.model('Payment', PaymentMethodSchema);
module.exports = Payment;
