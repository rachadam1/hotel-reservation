const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const validationRules = require('../middleware/validation');

router.post('/register', validationRules.register, authController.register);
router.post('/login', validationRules.login, authController.login);
router.get('/profile', authMiddleware.verifierToken, authController.getProfile);

module.exports = router;