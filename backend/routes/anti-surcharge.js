const express = require('express');
const router = express.Router();
const antiSurchargeController = require('../controllers/antiSurchargeController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware.verifierToken);

router.post('/verifier-disponibilite', antiSurchargeController.verifierDisponibilite);
router.get('/statut-securite/:hotel_id', antiSurchargeController.getStatutSecurite);
router.post('/utiliser-chambre-joker', antiSurchargeController.utiliserChambreJoker);

module.exports = router;