var express = require('express');

var router = express.Router();
var auth = require('./api/auth.route');
var admins = require('./api/admins.route');
var sportsman = require('./api/sportsman.route');
var events = require('./api/events.route');
var typeEvents = require('./api/typeEvents.route');
var users = require('./api/users.route');
var friends = require("./api/friends.route")

var AuthController = require('../controllers/auth.controller');
var AuthorizationController = require('../controllers/authorization.controller');
var LogsController = require('../controllers/logs.controller');

router.use('/auth', auth);
//router.use('/users', AuthController.authenticated);
//router.use('/users', AuthorizationController.anyAdmin);
router.use('/users', users);
router.use('/admins', AuthController.authenticated);
router.use('/admins', AuthorizationController.onlySuperadmin);
router.use('/admins', admins);
//router.use('/sportsman', AuthController.authenticated);
router.use('/sportsman', sportsman);
router.use('/events', events);
router.use('/type-events', typeEvents);
router.use('/logs', AuthController.authenticated);
router.use('/logs', AuthorizationController.onlySuperadmin);
router.use('/logs', LogsController.getAllLogs);
router.use('/friends', friends);

module.exports = router;