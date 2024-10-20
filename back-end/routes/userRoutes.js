const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authenticate')
router.post('/register', userController.register);
router.post('/verify-Email', userController.verifyEmail);
router.post('/login', userController.login);
router.post('/adduser', authMiddleware, userController.addUser);

router.get('/:id', authMiddleware, userController.getUser);
router.get('/', authMiddleware, userController.getAllUsers);

router.put('/:id', authMiddleware, userController.updateUser);
router.delete('/:id', authMiddleware, userController.deleteUser);

module.exports = router; 