const paymentService = require('../services/db/payment.service');
const httpStatus = require('http-status');
const Redsys = require('node-redsys-api').Redsys;

exports.startPayment = async function (req, res, next) {

    var user = req.body.user ? req.body.user : null;
    var address = req.body.address ? req.body.address : null;
    var event = req.body.event ? req.body.event : null;
    var inscription = req.body.inscription ? req.body.inscription : null;

    if (user !== null && address !== null && inscription !== null && event !== null) {

        var payment = await paymentService.savePayment(user, address, inscription, event);

        let paymentData = createPayment(
            event.tittle + " " + inscription.tittle + " " + inscription.description,
            parseFloat((inscription.price + inscription.shippingCosts).toFixed(2)),
            address.name + " " + address.surnames, 
            payment._id, 
            ""
        );

        return res.status(httpStatus.OK).json({ status: httpStatus.OK, data: paymentData });
    }

    else {
        return res.status(httpStatus.BAD_REQUEST).json({ error: "No se han ofrecido todos los datos necesarios para realizar el pago" });
    }    

};

function createPayment(description, total, titular, orderId, paymentId) {
    const redsys = new Redsys();
    const encryptKey = "sq7HjrUOBfKmC576ILgskD5srU870gJ7";

    const mParams = {
        "DS_MERCHANT_AMOUNT": convertToValidAmount(total),
        "DS_MERCHANT_ORDER": orderId.toString().slice(-12),
        "DS_MERCHANT_MERCHANTCODE": "124392903",
        "DS_MERCHANT_CURRENCY": "978",
        //"DS_MERCHANT_TRANSACTIONTYPE": tpvInfo.transaction_type,
        "DS_MERCHANT_TERMINAL": "001",
        //"DS_MERCHANT_MERCHANTURL": "https://rollandrace.com/",
        //"DS_MERCHANT_URLOK": "https://rollandrace.com/",
        //"DS_MERCHANT_URLKO": "https://rollandrace.com/"
    };

    return { signature: redsys.createMerchantSignature(encryptKey, mParams), merchantParameters: redsys.createMerchantParameters(mParams), raw: mParams };
}

function convertToValidAmount(amount) {

    var amountToString = (amount * 100).toString();
    var withoutDots = amountToString.replace('.', '');

    return withoutDots

}