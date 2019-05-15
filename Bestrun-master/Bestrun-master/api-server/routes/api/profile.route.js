const express = require('express');
const router = express.Router();

const profileController = require('../../controllers/profile.controller');

router.get('/:userid', profileController.getMyData);
router.put('/:userid', profileController.setNewPhoto);
router.put('/', profileController.setNewEmail);
router.put('/', profileController.setNewPassword);
router.delete('/:id', profileController.deleteUser);

module.exports = router;