const express = require('express');
const router = express.Router();

const fileController = require('../../controllers/file.controller');

router.get('/:eventID', fileController.getFile);

module.exports = router;