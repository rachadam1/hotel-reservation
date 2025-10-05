const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const { verifierToken, verifierRole } = require('../middleware/auth');

// 🔓 Routes publiques
router.post('/register', usersController.register);
router.post('/login', usersController.login);

// 🔐 Routes sécurisées
router.get('/:id', verifierToken, usersController.getUserById);
router.put('/:id', verifierRole(['admin', 'client']), usersController.updateUser);

module.exports = router;
