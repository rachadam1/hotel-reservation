const Reservation = require('../models/Reservation');
const Chambre = require('../models/Chambre');
const Client = require('../models/Client');
const Hotel = require('../models/Hotel');
const emailController = require('./emailController');
const antiSurchargeController = require('./antiSurchargeController');

// Modifier la fonction createReservation
createReservation: async (req, res) => {
    try {
        const { chambre_id, type_reservation, date_arrivee, date_depart, heure_debut, heure_fin, nombre_adultes, nombre_enfants, options_supplementaires, methode_paiement } = req.body;

        // VÉRIFICATION ANTI-SUR-RÉSERVATION
        const verification = await antiSurchargeController.verifierDisponibilite({ 
            body: { chambre_id, date_debut: date_arrivee || heure_debut, date_fin: date_depart || heure_fin, type_reservation } 
        }, { json: () => {} });

        if (!verification.disponible) {
            return res.status(400).json({ 
                error: 'Chambre non disponible - Conflit détecté',
                details: verification 
            });
        }

        // ... reste du code existant ...

        // APRÈS création réservation, envoyer email
        await emailController.envoyerEmailConfirmation(reservation.id, methode_paiement);

        // ... reste du code ...
    } catch (error) {
        // ... gestion erreur ...
    }
}

const reservationController = {
    createReservation: async (req, res) => {
        try {
            const { chambre_id, type_reservation, date_arrivee, date_depart, heure_debut, heure_fin, nombre_adultes, nombre_enfants, options_supplementaires } = req.body;

            const chambre = await Chambre.findByPk(chambre_id);
            if (!chambre) {
                return res.status(404).json({ error: 'Chambre non trouvée' });
            }

            if (chambre.statut !== 'libre') {
                return res.status(400).json({ error: 'Chambre non disponible' });
            }

            let montant_total = 0;
            if (type_reservation === 'classique') {
                const nuits = Math.ceil((new Date(date_depart) - new Date(date_arrivee)) / (1000 * 60 * 60 * 24));
                montant_total = chambre.prix_nuit * nuits;
            } else {
                const heures = Math.ceil((new Date(heure_fin) - new Date(heure_debut)) / (1000 * 60 * 60));
                if (heures <= 2) montant_total = chambre.prix_2h;
                else if (heures <= 4) montant_total = chambre.prix_4h;
                else if (heures <= 6) montant_total = chambre.prix_6h;
                else montant_total = chambre.prix_8h;
            }

            const reservation = await Reservation.create({
                numero_reservation: 'HTL-' + Date.now(),
                client_id: req.client.id,
                chambre_id,
                type_reservation,
                date_arrivee: type_reservation === 'classique' ? date_arrivee : null,
                date_depart: type_reservation === 'classique' ? date_depart : null,
                heure_debut: type_reservation === 'horaire' ? heure_debut : null,
                heure_fin: type_reservation === 'horaire' ? heure_fin : null,
                nombre_adultes: nombre_adultes || 1,
                nombre_enfants: nombre_enfants || 0,
                montant_total,
                options_supplementaires: options_supplementaires || {},
                statut_paiement: 'en_attente',
                statut_reservation: 'confirmee'
            });

            await Chambre.update({ statut: 'occupee' }, { where: { id: chambre_id } });

            const reservationComplete = await Reservation.findByPk(reservation.id, {
                include: [
                    { model: Client, attributes: ['id', 'prenom', 'nom', 'email'] },
                    { model: Chambre, include: [Hotel] }
                ]
            });

            res.status(201).json({
                success: true,
                message: 'Réservation créée avec succès',
                reservation: reservationComplete
            });

        } catch (error) {
            console.error('Erreur création réservation:', error);
            res.status(500).json({ error: 'Erreur lors de la création de la réservation' });
        }
    },

    getClientReservations: async (req, res) => {
        try {
            const reservations = await Reservation.findAll({
                where: { client_id: req.client.id },
                include: [
                    { model: Chambre, include: [Hotel] }
                ],
                order: [['created_at', 'DESC']]
            });

            res.json({
                success: true,
                reservations
            });

        } catch (error) {
            console.error('Erreur historique réservations:', error);
            res.status(500).json({ error: 'Erreur lors de la récupération des réservations' });
        }
    },

    cancelReservation: async (req, res) => {
        try {
            const { id } = req.params;

            const reservation = await Reservation.findByPk(id);
            if (!reservation) {
                return res.status(404).json({ error: 'Réservation non trouvée' });
            }

            if (reservation.client_id !== req.client.id) {
                return res.status(403).json({ error: 'Non autorisé' });
            }

            await Chambre.update({ statut: 'libre' }, { where: { id: reservation.chambre_id } });

            await Reservation.update(
                { statut_reservation: 'annulee' },
                { where: { id } }
            );

            res.json({
                success: true,
                message: 'Réservation annulée avec succès'
            });

        } catch (error) {
            console.error('Erreur annulation réservation:', error);
            res.status(500).json({ error: 'Erreur lors de l\'annulation de la réservation' });
        }
    }
};

module.exports = reservationController;