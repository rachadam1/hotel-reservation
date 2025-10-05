const express = require('express');
const router = express.Router();
const optionsController = require('../controllers/optionsController');
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');

router.get('/', auth, optionsController.getAllOptions);
router.post('/', auth, roles(['admin']), optionsController.createOption);

router.get('/', optionsController.getAllOptions);
router.post('/', optionsController.createOption);

module.exports = router;
