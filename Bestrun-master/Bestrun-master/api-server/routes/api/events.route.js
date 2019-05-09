const express = require('express');
const router = express.Router();

const eventsController = require('../../controllers/events.controller');
const fileService = require('../../services/files.service');
const participantController = require('../../controllers/participant.controller');

var AuthController = require('../../controllers/auth.controller');
var AuthorizationController = require('../../controllers/authorization.controller');

router.get('/all',  AuthController.getAuthUser, AuthorizationController.anyAdmin,eventsController.getAllEvents);
router.get('/',  AuthController.getAuthUser, eventsController.getEvents);
router.post('/', AuthController.authenticated, AuthorizationController.anyAdmin, eventsController.createEvent);
router.get('/:id', AuthController.getAuthUser, eventsController.getEvent);
router.put('/', AuthController.authenticated, AuthorizationController.anyAdmin, eventsController.updateEvent);
router.delete('/:id', AuthController.authenticated, AuthorizationController.anyAdmin, eventsController.removeEvent);
router.post('/:id/file', AuthController.authenticated, AuthorizationController.anyAdmin, fileService.multerFile.single('document'), eventsController.uploadFile);
router.delete('/:id/file', AuthController.authenticated, AuthorizationController.anyAdmin, eventsController.deleteFile);
router.post('/:id/photo', AuthController.authenticated, AuthorizationController.anyAdmin, fileService.multerImage.single('photo'), eventsController.uploadPhoto);
router.delete('/:id/photo', AuthController.authenticated, AuthorizationController.anyAdmin, eventsController.deletePhoto);

router.get('/:idEvent/participant', AuthController.authenticated, AuthorizationController.anyAdmin, participantController.getAllParticipants);
router.post('/:idEvent/participant/:idUser', AuthController.authenticated, AuthorizationController.anyAdmin, participantController.addParticipant);
router.put('/:idEvent/participant', AuthController.authenticated, AuthorizationController.anyAdmin, participantController.updateParticipant);
router.delete('/:idEvent/participant/:idParticipant', AuthController.authenticated, AuthorizationController.anyAdmin, participantController.removeParticipant);

module.exports = router;