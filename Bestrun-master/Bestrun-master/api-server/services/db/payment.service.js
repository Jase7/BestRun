const Payment = require('../../models/payment.model');
const ObjectId = require('mongoose').Types.ObjectId;


exports.getPayments = async function (query, options) {

    try {
        var allPayments = await Payment.paginate(query, options);
        return allPayments;
    } catch (e) {
        console.log(e);
        throw Error(`Error while Paginating allPayments`);
    }
}

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
            sending: inscriptionID.shippingCosts > 0 ? true : false,
            status: 'Pendiente'
        });

        payment = await payment.save();

        return payment;

    }

    catch (e) {

        throw Error(e);
    }
};

exports.savePaymentOrder = async function (payment) {

    var data = await Payment.findById(payment);
    data.paymentOrder = payment._id.toString().slice(-12);
    data.save();

    return data;
}

exports.getPayment = async function (paymentID) {

    var payment = await Payment.find({ paymentOrder: paymentID })
    return payment;
};

exports.updatePaymentStatus = async function (payment, status) {

    console.log(JSON.stringify(payment));
    console.log("ID " + payment[0]._id);

    let paymentObj = await Payment.findById(payment[0]._id);
    paymentObj.status = status;

    paymentObj.save();

    return paymentObj;
}