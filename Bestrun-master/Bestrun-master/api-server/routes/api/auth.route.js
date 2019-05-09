var express = require('express');
var router = express.Router();

var authController = require('../../controllers/auth.controller');

router.post('/signin', authController.signIn);
router.post('/register', authController.register);
router.post('/facebook', authController.signInFacebook);
router.post('/google', authController.signInGoogle);
router.get('/profile', authController.getProfile);

module.exports = router;