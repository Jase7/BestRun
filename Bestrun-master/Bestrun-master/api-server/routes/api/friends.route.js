const express = require('express');
const router = express.Router();

const friendsController = require('../../controllers/friends.controller');

router.get('/:userid', friendsController.getAllFriends);
router.get('/pending/:userid', friendsController.getPendRequests);
router.post('/', friendsController.sendFriendship);
router.put('/', friendsController.acceptFriendship);
router.delete('/:id', friendsController.rejectFriendship);
router.delete('/friend/:myID/:fID', friendsController.deleteFriendship);
module.exports = router;