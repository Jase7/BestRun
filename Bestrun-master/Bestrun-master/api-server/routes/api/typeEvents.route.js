const express = require('express');
const router = express.Router();

const typeEventsController = require('../../controllers/type-event.controller');
var AuthController = require('../../controllers/auth.controller');
var AuthorizationController = require('../../controllers/authorization.controller');

router.get('/', typeEventsController.getAllTypeEvents);
router.post('/', AuthController.authenticated, AuthorizationController.anyAdmin, typeEventsController.createTypeEvent);
router.delete('/:id', AuthController.authenticated, AuthorizationController.anyAdmin, typeEventsController.removeTypeEvent);

module.exports = router;