const express = require('express');
const router = express.Router();

const paymentController = require('../../controllers/payment.controller');

router.put('/', paymentController.startPayment);

module.exports = router;