const paymentService = require('../services/db/payment.service');
const httpStatus = require('http-status');
const Redsys = require('node-redsys-api').Redsys;
var logService = require('../services/db/logs.service');
const ParticipantService = require('../services/db/participant.service');
const UserService = require('../services/db/user.service');
const EventService = require('../services/db/event.service');

exports.startPayment = async function (req, res, next) {

    var user = req.body.user ? req.body.user : null;
    var address = req.body.address ? req.body.address : null;
    var event = req.body.event ? req.body.event : null;
    var inscription = req.body.inscription ? req.body.inscription : null;

    if (user !== null && address !== null && inscription !== null && event !== null) {

        var payment = await paymentService.savePayment(user, address, inscription, event);
        await paymentService.savePaymentOrder(payment);

        let paymentData = createPayment(
            event.tittle + " " + inscription.tittle + " " + inscription.description,
            parseFloat((inscription.price + inscription.shippingCosts).toFixed(2)),
            address.name + " " + address.surnames, 
            payment._id, 
            "",
            event.id
        );

        //also we create a participant since tpv won't give us any info
        //let participant = 

        return res.status(httpStatus.OK).json({ status: httpStatus.OK, data: paymentData });
    }

    else {
        return res.status(httpStatus.BAD_REQUEST).json({ error: "No se han ofrecido todos los datos necesarios para realizar el pago" });
    }    

};

exports.paymentStatus = async function (req, res, next) {

    var params = req.body.Ds_MerchantParameters;

    var paramsString = (new Buffer(params, 'base64')).toString('utf8');
    var paramsObject = JSON.parse(paramsString);

    if (paramsObject.Ds_Response === "0000") {
        let paymentID = paramsObject.Ds_Order ? paramsObject.Ds_Order : null;

        if (paymentID) {
            let payment = await paymentService.getPayment(paymentID);

            if (payment) {
                logService.createLog({ description: "Actualizando pago " + JSON.stringify(payment) });

                //PaymentStatus = 'Aceptado'
                await paymentService.updatePaymentStatus(payment, 'Aceptado');

                let user, event;

                user = await UserService.getUser(payment[0].user);
                event = await EventService.getEvent(payment[0].event);                

                //Create participant
                let participant = {
                    user: payment[0].user,
                    event: payment[0].event,
                    nameEvent: event.tittle,
                    nameUser: user.name,
                    surnames: user.surnames,
                    email: user.email,
                    dorsal: "",
                    time: "",
                    category: event.category,
                    position: "",
                    createdAt: Date.now()
                };

                console.log(JSON.stringify(participant))

                await ParticipantService.createParticipant(participant);

                return res.status(httpStatus.OK).json({ data: payment });
            }

            else {
                return res.status(httpStatus.BAD_REQUEST).json({ error: "PaymentOrder not found" });
            }
            
        }
        else {
            return res.status(httpStatus.BAD_REQUEST).json({ error: "PaymentID not found" });
        }
    }

    else {

        let paymentID = paramsObject.Ds_Order ? paramsObject.Ds_Order : null;
        let payment = await paymentService.getPayment(paymentID);

        payment.status = "Rechazado";
        payment.save();

        return res.status(httpStatus.BAD_REQUEST).json({ error: "Ds_Response is not 0000" });
    }

    
    
}


function createPayment(description, total, titular, orderId, paymentId, eventID) {
    const redsys = new Redsys();
    const encryptKey = "sq7HjrUOBfKmC576ILgskD5srU870gJ7";

    const mParams = {
        "DS_MERCHANT_AMOUNT": convertToValidAmount(total),
        "DS_MERCHANT_ORDER": orderId.toString().slice(-12),
        "DS_MERCHANT_MERCHANTCODE": "124392903",
        "DS_MERCHANT_CURRENCY": "978",
        //"DS_MERCHANT_TRANSACTIONTYPE": tpvInfo.transaction_type,
        "DS_MERCHANT_TERMINAL": "001",
        "DS_MERCHANT_MERCHANTURL": "https://rollandrace.com:3000/api/payment/paymentStatus",
        //"DS_MERCHANT_URLOK": "http://localhost:3000/api/paymentOK/" + eventID,
        //"DS_MERCHANT_URLKO": "http://localhost:3000/api/paymentNOK" + eventID
    };

    return { signature: redsys.createMerchantSignature(encryptKey, mParams), merchantParameters: redsys.createMerchantParameters(mParams), raw: mParams };
}

function convertToValidAmount(amount) {

    var amountToString = parseInt((amount * 100)).toString();
    var withoutDots = amountToString.replace('.', '');

    return withoutDots

}