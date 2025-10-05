const express = require('express');
const router = express.Router();
const chambresController = require('../controllers/chambresController');
const { verifierRole } = require('../middleware/auth');

// Routes publiques ou non protégées
router.get('/', chambresController.getAllChambres);
router.get('/hotel/:hotel_id', chambresController.getChambresByHotel);
router.post('/', chambresController.createChambre);

// Routes protégées par rôle
router.put('/api/chambres/:id/statut', verifierRole(['admin', 'reception']), chambresController.updateStatut);
router.put('/api/chambres/:id/check-out', verifierRole(['reception']), chambresController.checkOutChambre);
router.get('/api/chambres', verifierRole(['reception', 'admin']), chambresController.getChambresParStatut);

module.exports = router;

