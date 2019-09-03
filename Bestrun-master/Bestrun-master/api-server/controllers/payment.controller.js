const paymentService = require('../services/db/payment.service');
const httpStatus = require('http-status');
const Redsys = require('node-redsys-api').Redsys;
var logService = require('../services/db/logs.service');
const ParticipantService = require('../services/db/participant.service');
const UserService = require('../services/db/user.service');
const EventService = require('../services/db/event.service');
const Event = require('../models/event.model');

exports.getPayments = async function (req, res, next) {

    var page = req.query.page ? req.query.page : 1;
    var limit = isNaN(req.query.limit) ? 20 : Number(req.query.limit);

    var query = {};

    query.$and = [
        { status: { $ne: "Pendiente" } }
    ];

    var options = {
        page,
        limit
    };

    options.populate = [
        {
            path: 'user'
        },
        {
            path: 'event'
        }
    ];

    var payments = await paymentService.getPayments(query, options);

    payments.docs = payments.docs.map((payment) => {
        return formatPayment(payment);
    });

    return res.status(httpStatus.OK).json({ data: payments });

};

exports.getDataFromPayment = async function (req, res, next) {

    var paymentID = req.params.id ? req.params.id : null; 

    if (paymentID) {

        var payment = await paymentService.getPayment(paymentID.slice(-12)); 

        if (payment !== null) {

            var event = await EventService.getEvent(payment[0].event._id);
            var inscription = event.typeInscription.filter(e => e._id.toString() === payment[0].typeInscription._id.toString());
            var user = await UserService.getUser(payment[0].user._id);
            var address = user.addresses.filter(e => e._id.toString() === payment[0].address._id.toString());

            if (inscription.length > 0 && address.length > 0) {
                return res.status(httpStatus.OK).json({ event: event, inscription: inscription[0], address: address[0]});
            }

            else {
                return res.status(httpStatus.BAD_REQUEST).json({ error: "TypeInscription not found, maybe deleted from BBDD" });
            }

        }

        else {
            return res.status(httpStatus.BAD_REQUEST).json({ error: "Payment not found, maybe deleted from BBDD" });
        }
    }
};


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
    const encryptKey = process.env.ENCRYPT_KEY;

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

function formatPayment(payment) {

    return {
        _id: payment._id,
        user: payment.user,
        event: payment.event ? payment.event : new Event(),
        paymentDate: payment.paymentDate,
        status: payment.status
    };
}