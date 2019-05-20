const express = require('express');
const router = express.Router();

const profileController = require('../../controllers/profile.controller');

router.get('/:userid', profileController.getMyData);
router.get('/paymentMethod/:userid', profileController.getPaymentMethod);
router.put('/photo/:userid', profileController.setNewPhoto);
router.put('/email/:userid', profileController.setNewEmail);
router.put('/password/:userid', profileController.setNewPassword);
router.post('/paymentMethod/:userid', profileController.setPaymentMethod);
router.delete('/:userid', profileController.deleteUser);

module.exports = router;