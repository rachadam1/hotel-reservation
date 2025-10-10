const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware.verifierToken);

router.post('/confirmation/:reservation_id', async (req, res) => {
    try {
        const { reservation_id } = req.params;
        const { type_paiement } = req.body;
        
        const succes = await emailController.envoyerEmailConfirmation(reservation_id, type_paiement);
        
        res.json({
            success: succes,
            message: succes ? 'Email envoyé avec succès' : 'Erreur envoi email'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;