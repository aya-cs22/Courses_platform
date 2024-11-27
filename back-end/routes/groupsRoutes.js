const express = require('express');
const router = express.Router();
const Groups = require('../models/groups');
const groupsController = require('../controllers/groupsController.js');
const authMiddleware = require('../middleware/authenticate')
router.post('/', authMiddleware, groupsController.creatGroups);
router.post('/send-group-id', authMiddleware, groupsController.sendGroupId);
router.get('/', groupsController.getAllGroups);
router.get('/:id', groupsController.getGroupsById);

router.put('/:id', authMiddleware, groupsController.updateGroupsById);
router.delete('/:id', authMiddleware, groupsController.deleteGroupsById);

module.exports = router;