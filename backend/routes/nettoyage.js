const express = require('express');
const router = express.Router();
const nettoyageController = require('../controllers/nettoyageController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware.verifierToken);

router.post('/taches', nettoyageController.creerTacheNettoyage);
router.get('/taches', nettoyageController.obtenirTachesNettoyage);
router.patch('/taches/:id/statut', nettoyageController.mettreAJourStatutTache);
router.patch('/taches/:id/valider', nettoyageController.validerTache);

module.exports = router;