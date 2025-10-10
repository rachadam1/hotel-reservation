const Chambre = require('../models/Chambre');
const Reservation = require('../models/Reservation');
const { Op } = require('sequelize');

const antiSurchargeController = {
    verifierDisponibilite: async (req, res) => {
        try {
            const { chambre_id, date_debut, date_fin, type_reservation } = req.body;

            const chambre = await Chambre.findByPk(chambre_id);
            if (!chambre) {
                return res.status(404).json({ error: 'Chambre non trouvée' });
            }

            // Buffer de 1 heure
            const bufferDebut = new Date(date_debut);
            bufferDebut.setHours(bufferDebut.getHours() - 1);
            
            const bufferFin = new Date(date_fin);
            bufferFin.setHours(bufferFin.getHours() + 1);

            // Vérifier les conflits de réservation
            const conflits = await Reservation.findAll({
                where: {
                    chambre_id,
                    statut_reservation: 'confirmee',
                    [Op.or]: [
                        // Conflit de dates pour réservation classique
                        {
                            type_reservation: 'classique',
                            [Op.and]: [
                                { date_arrivee: { [Op.lt]: bufferFin } },
                                { date_depart: { [Op.gt]: bufferDebut } }
                            ]
                        },
                        // Conflit d'heures pour réservation horaire
                        {
                            type_reservation: 'horaire',
                            [Op.and]: [
                                { heure_debut: { [Op.lt]: bufferFin } },
                                { heure_fin: { [Op.gt]: bufferDebut } }
                            ]
                        }
                    ]
                }
            });

            // Vérifier occupation globale
            const totalChambres = await Chambre.count({ where: { hotel_id: chambre.hotel_id } });
            const chambresOccupees = await Chambre.count({ 
                where: { 
                    hotel_id: chambre.hotel_id,
                    statut: 'occupee' 
                } 
            });
            const tauxOccupation = (chambresOccupees / totalChambres) * 100;

            const disponible = conflits.length === 0;
            const alerteOccupation = tauxOccupation > 90;

            res.json({
                success: true,
                disponible,
                conflits: conflits.length,
                tauxOccupation: Math.round(tauxOccupation),
                alerteOccupation,
                message: disponible ? 
                    'Chambre disponible' : 
                    'Chambre non disponible - Conflit de réservation détecté'
            });

        } catch (error) {
            console.error('Erreur vérification disponibilité:', error);
            res.status(500).json({ error: 'Erreur lors de la vérification' });
        }
    },

    getStatutSecurite: async (req, res) => {
        try {
            const { hotel_id } = req.params;

            const totalChambres = await Chambre.count({ where: { hotel_id } });
            const chambresOccupees = await Chambre.count({ 
                where: { 
                    hotel_id,
                    statut: 'occupee' 
                } 
            });
            const chambreJoker = await Chambre.findOne({ 
                where: { 
                    hotel_id,
                    numero: '999'
                } 
            });

            const tauxOccupation = (chambresOccupees / totalChambres) * 100;
            const alerteActive = tauxOccupation > 90;

            res.json({
                success: true,
                securite: {
                    occupationActuelle: Math.round(tauxOccupation),
                    chambreJoker: chambreJoker ? chambreJoker.statut : 'inexistante',
                    alerteOccupation: alerteActive,
                    bufferActif: true,
                    blocageAuto: true,
                    prochaineAlerte: '90%'
                }
            });

        } catch (error) {
            console.error('Erreur statut sécurité:', error);
            res.status(500).json({ error: 'Erreur lors de la récupération du statut' });
        }
    },

    utiliserChambreJoker: async (req, res) => {
        try {
            const { hotel_id, reservation_id } = req.body;

            const chambreJoker = await Chambre.findOne({ 
                where: { 
                    hotel_id,
                    numero: '999',
                    statut: 'libre'
                } 
            });

            if (!chambreJoker) {
                return res.status(400).json({ 
                    error: 'Chambre joker non disponible' 
                });
            }

            // Marquer la chambre joker comme occupée
            await Chambre.update(
                { statut: 'occupee' },
                { where: { id: chambreJoker.id } }
            );

            // Mettre à jour la réservation avec la chambre joker
            await Reservation.update(
                { chambre_id: chambreJoker.id },
                { where: { id: reservation_id } }
            );

            res.json({
                success: true,
                message: 'Chambre joker 999 attribuée pour urgence',
                chambre: chambreJoker,
                compensation: 'Boisson offerte + excuses'
            });

        } catch (error) {
            console.error('Erreur chambre joker:', error);
            res.status(500).json({ error: 'Erreur lors de l\'utilisation de la chambre joker' });
        }
    }
};

module.exports = antiSurchargeController;