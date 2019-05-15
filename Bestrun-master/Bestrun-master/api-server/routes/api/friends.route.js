const express = require('express');
const router = express.Router();

const friendsController = require('../../controllers/friends.controller');

router.get('/:userid', friendsController.getAllFriends);
router.post('/', friendsController.sendFriendship);
router.put('/', friendsController.acceptFriendship);
router.delete('/:id', friendsController.rejectFriendship);

module.exports = router;