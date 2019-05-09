const express = require('express');
const router = express.Router();

const sportsmanController = require('../../controllers/sportsman.controller.js');
var AuthorizationController = require('../../controllers/authorization.controller');

router.get('/my-events', sportsmanController.getMyEvents);
router.get('/', AuthorizationController.anyAdmin, sportsmanController.getAllSportsman);
router.post('/', AuthorizationController.anyAdmin, sportsmanController.createSportsman);
router.get('/:id', AuthorizationController.anyAdmin, sportsmanController.getSportsman);
router.put('/', AuthorizationController.anyAdmin, sportsmanController.updateSportsman);
router.delete('/:id', AuthorizationController.anyAdmin, sportsmanController.removeSportsman);

module.exports = router;