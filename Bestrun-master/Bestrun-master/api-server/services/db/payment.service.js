const Payment = require('../../models/payment.model');
const ObjectId = require('mongoose').Types.ObjectId;

exports.savePayment = async function (user, address, inscriptionID, event) {

    try {
        var payment = new Payment({

            address: address,
            user: user,
            event: event.id,
            typeInscription: inscriptionID,
            price: inscriptionID.price,
            shippingCosts: inscriptionID.shippingCosts,
            paymentDate: Date.now(),
            sending: inscriptionID.shippingCosts > 0 ? true : false
        });

        payment = await payment.save();

        return payment;

    }

    catch (e) {

        throw Error(e);
    }
}