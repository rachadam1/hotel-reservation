const Reservation = require('../models/Reservation');
const Facture = require('../models/Facture');
const Chambre = require('../models/Chambre');
const Client = require('../models/Client');
const Hotel = require('../models/Hotel');
const emailController = require('./emailController');

// Modifier traiterPaiementEnLigne
traiterPaiementEnLigne: async (req, res) => {
    try {
        // ... code existant ...

        // Envoyer email de confirmation
        await emailController.envoyerEmailConfirmation(reservation_id, 'en_ligne');

        // ... reste du code ...
    } catch (error) {
        // ... gestion erreur ...
    }
}

const paiementController = {
    traiterPaiementEnLigne: async (req, res) => {
        try {
            const { reservation_id } = req.body;

            const reservation = await Reservation.findByPk(reservation_id, {
                include: [Chambre, Client]
            });

            if (!reservation) {
                return res.status(404).json({ error: 'Réservation non trouvée' });
            }

            // Simuler le paiement en ligne
            await Reservation.update(
                { 
                    statut_paiement: 'paye_en_ligne',
                    statut_reservation: 'confirmee'
                },
                { where: { id: reservation_id } }
            );

            // Générer la facture
            const facture = await Facture.create({
                numero_facture: 'FAC-' + Date.now(),
                reservation_id: reservation.id,
                client_id: reservation.client_id,
                chambre_id: reservation.chambre_id,
                hotel_id: reservation.Chambre.hotel_id,
                articles: [
                    {
                        description: `Réservation ${reservation.type_reservation} - Chambre ${reservation.Chambre.numero}`,
                        quantite: 1,
                        prix_unitaire: reservation.montant_total
                    }
                ],
                sous_total: reservation.montant_total,
                taxe: 0,
                total: reservation.montant_total,
                montant_paye: reservation.montant_total,
                solde_du: 0,
                statut_paiement: 'payee',
                methode_paiement: 'en_ligne',
                payee_le: new Date()
            });

            const factureComplete = await Facture.findByPk(facture.id, {
                include: [
                    { model: Reservation, include: [Chambre, Client] }
                ]
            });

            res.json({
                success: true,
                message: 'Paiement en ligne traité avec succès',
                facture: factureComplete,
                reservation: await Reservation.findByPk(reservation_id)
            });

        } catch (error) {
            console.error('Erreur paiement en ligne:', error);
            res.status(500).json({ error: 'Erreur lors du traitement du paiement' });
        }
    },

    traiterPaiementSurPlace: async (req, res) => {
        try {
            const { reservation_id } = req.body;

            const reservation = await Reservation.findByPk(reservation_id, {
                include: [Chambre, Client]
            });

            if (!reservation) {
                return res.status(404).json({ error: 'Réservation non trouvée' });
            }

            await Reservation.update(
                { statut_paiement: 'a_payer_sur_place' },
                { where: { id: reservation_id } }
            );

            // Créer facture en attente
            const facture = await Facture.create({
                numero_facture: 'FAC-' + Date.now(),
                reservation_id: reservation.id,
                client_id: reservation.client_id,
                chambre_id: reservation.chambre_id,
                hotel_id: reservation.Chambre.hotel_id,
                articles: [
                    {
                        description: `Réservation ${reservation.type_reservation} - Chambre ${reservation.Chambre.numero}`,
                        quantite: 1,
                        prix_unitaire: reservation.montant_total
                    }
                ],
                sous_total: reservation.montant_total,
                taxe: 0,
                total: reservation.montant_total,
                montant_paye: 0,
                solde_du: reservation.montant_total,
                statut_paiement: 'en_attente',
                methode_paiement: 'sur_place',
                date_echeance: reservation.date_arrivee || reservation.heure_debut
            });

            res.json({
                success: true,
                message: 'Réservation confirmée - Paiement à effectuer sur place',
                facture,
                reservation: await Reservation.findByPk(reservation_id)
            });

        } catch (error) {
            console.error('Erreur paiement sur place:', error);
            res.status(500).json({ error: 'Erreur lors de la confirmation de réservation' });
        }
    },

    genererFacture: async (req, res) => {
        try {
            const { reservation_id } = req.params;

            const reservation = await Reservation.findByPk(reservation_id, {
                include: [Chambre, Client, Hotel]
            });

            if (!reservation) {
                return res.status(404).json({ error: 'Réservation non trouvée' });
            }

            const facture = await Facture.create({
                numero_facture: 'FAC-' + Date.now(),
                reservation_id: reservation.id,
                client_id: reservation.client_id,
                chambre_id: reservation.chambre_id,
                hotel_id: reservation.Chambre.hotel_id,
                articles: [
                    {
                        description: `Séjour - Chambre ${reservation.Chambre.numero}`,
                        quantite: 1,
                        prix_unitaire: reservation.montant_total
                    }
                ],
                sous_total: reservation.montant_total,
                taxe: 0,
                total: reservation.montant_total,
                montant_paye: 0,
                solde_du: reservation.montant_total,
                statut_paiement: 'en_attente',
                date_echeance: new Date()
            });

            const factureComplete = await Facture.findByPk(facture.id, {
                include: [
                    { model: Reservation, include: [Chambre, Client, Hotel] }
                ]
            });

            res.json({
                success: true,
                facture: factureComplete
            });

        } catch (error) {
            console.error('Erreur génération facture:', error);
            res.status(500).json({ error: 'Erreur lors de la génération de la facture' });
        }
    }
};

module.exports = paiementController;