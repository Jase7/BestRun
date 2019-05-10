const express = require('express');
const router = express.Router();

const friendsController = require('../../controllers/friends.controller');

router.get('/:userid', friendsController.getAllFriends);
router.post('/:userid1/:userid2', friendsController.sendFriendship);

module.exports = router;