const mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

const PaymentMethodSchema = new mongoose.Schema({    
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        default: "MasterCard"
    },
    cardNumber: {
        type: String,
        required: true
    },
    yearExpire: {
        type: Number,
        required: true
    },
    monthExpire: {
        type: Number,
        required: true
    }, 
    CVC: {
        type: String, 
        required: true
    }
});

PaymentMethodSchema.plugin(mongoosePaginate);
const PaymentMethod = mongoose.model('PaymentMethod', PaymentMethodSchema);
module.exports = PaymentMethod;