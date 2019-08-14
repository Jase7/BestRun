const express = require('express');
const router = express.Router();

const paymentController = require('../../controllers/payment.controller');
var AuthController = require('../../controllers/auth.controller');

router.put('/', paymentController.startPayment, AuthController.authenticated);
router.post('/paymentStatus', paymentController.paymentStatus);

module.exports = router;