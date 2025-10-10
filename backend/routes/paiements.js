const express = require('express');
const router = express.Router();
const paiementController = require('../controllers/paiementController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware.verifierToken);

router.post('/paiement-en-ligne', paiementController.traiterPaiementEnLigne);
router.post('/paiement-sur-place', paiementController.traiterPaiementSurPlace);
router.post('/facture/:reservation_id', paiementController.genererFacture);

module.exports = router;