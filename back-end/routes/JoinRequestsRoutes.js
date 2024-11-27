const express = require('express');
const router = express.Router();
const JoinRequests = require('../models/JoinRequests');
const JoinRequestsController = require('../controllers/JoinRequestsController');
const authMiddleware = require('../middleware/authenticate')

router.post('/join-request', authMiddleware, JoinRequestsController.sendJoinRequest);
router.get('/get-all-join-requests', authMiddleware, JoinRequestsController.getAllJoinRequests);
router.post('/approve-join-request', authMiddleware, JoinRequestsController.approveJoinRequest);
router.post('/reject-Join-request', authMiddleware, JoinRequestsController.rejectJoinRequest);
router.delete('/delet-join-request', authMiddleware, JoinRequestsController.deletJoinRequest);
router.put('/update-join-requestStatus', authMiddleware, JoinRequestsController.updateJoinRequestStatus);

module.exports = router;
