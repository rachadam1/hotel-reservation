const express = require('express');
const router = express.Router();
const tableauDeBordController = require('../controllers/tableauDeBordController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware.verifierToken);

router.get('/jour', tableauDeBordController.getTableauDeBordJour);
router.get('/statistiques/:hotelId', tableauDeBordController.getStatistiquesHotel);

module.exports = router;