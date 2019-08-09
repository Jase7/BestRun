const express = require('express');
const router = express.Router();

const profileController = require('../../controllers/profile.controller');

router.get('/:userid', profileController.getMyData);
router.delete('/deleteAccount/:userid', profileController.deleteUser);
router.put('/photo/:userid', profileController.setNewPhoto);
router.put('/email/:userid', profileController.setNewEmail);
router.put('/password/:userid', profileController.setNewPassword);
router.post('/profileData/address/:userid', profileController.saveAddress);
router.put('/profileData/address/:userid', profileController.editAddress);
router.delete('/profileData/address/:userid/:aid', profileController.deleteAddress);
//router.get('/paymentMethod/:userid', profileController.getPaymentMethod);
//router.post('/paymentMethod/:userid', profileController.setPaymentMethod);
//router.delete('/paymentMethod/:userid/:pid', profileController.deletePaymentMethod);

module.exports = router;