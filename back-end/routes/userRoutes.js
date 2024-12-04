const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authenticate')
router.post('/register', userController.register);
router.post('/verify-Email', userController.verifyEmail);
router.post('/login', userController.login);

router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);

//feedbacl
router.post('/submit-feedback', authMiddleware, userController.submitFeedback);
router.get('/get-all-feedback', authMiddleware, userController.getAllFeedback);
router.get('/get-feedback-by-id/:userId', authMiddleware, userController.getFeedbackById);



router.post('/adduser', authMiddleware, userController.addUser);
router.get('/', authMiddleware, userController.getUserByhimself);
router.get('/:id', authMiddleware, userController.getUserByid);
router.get('/all-users', authMiddleware, userController.getAllUsers);

router.put('/:id?', authMiddleware, userController.updateUser);
router.delete('/:id?', authMiddleware, userController.deleteUser);

module.exports = router; 