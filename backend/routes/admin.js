const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware.verifierToken);
router.use(authMiddleware.verifierRole(['admin'])); // Seulement pour les admins

router.post('/hotels', adminController.creerHotel);
router.get('/tableau-bord-global', adminController.getTableauBordGlobal);
router.get('/analyses/:hotel_id', adminController.getAnalysesDetaillees);

module.exports = router;