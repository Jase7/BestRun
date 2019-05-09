const express = require('express');
const router = express.Router();

const adminController = require('../../controllers/admins.controller');

router.get('/', adminController.getAllAdmins);
router.post('/', adminController.createAdmin);
router.get('/:id', adminController.getAdmin);
router.put('/', adminController.updateAdmin);
router.delete('/:id', adminController.removeAdmin);

module.exports = router;