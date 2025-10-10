const Reservation = require('../models/Reservation');
const Chambre = require('../models/Chambre');
const Hotel = require('../models/Hotel');
const TacheNettoyage = require('../models/TacheNettoyage');
const { Sequelize, Op } = require('sequelize');

const tableauDeBordController = {
    getTableauDeBordJour: async (req, res) => {
        try {
            const aujourdHui = new Date();
            aujourdHui.setHours(0, 0, 0, 0);
            const demain = new Date(aujourdHui);
            demain.setDate(demain.getDate() + 1);

            // Statistiques chambres
            const totalChambres = await Chambre.count();
            const chambresOccupees = await Chambre.count({ where: { statut: 'occupee' } });
            const chambresNettoyage = await Chambre.count({ where: { statut: 'nettoyage' } });
            const chambresLibres = await Chambre.count({ where: { statut: 'libre' } });

            // Arrivées aujourd'hui
            const arriveesAujourdhui = await Reservation.findAll({
                where: {
                    [Op.or]: [
                        {
                            type_reservation: 'classique',
                            date_arrivee: {
                                [Op.between]: [aujourdHui, demain]
                            }
                        },
                        {
                            type_reservation: 'horaire',
                            heure_debut: {
                                [Op.between]: [aujourdHui, demain]
                            }
                        }
                    ],
                    statut_reservation: 'confirmee'
                },
                include: [
                    { model: Client, attributes: ['id', 'prenom', 'nom'] },
                    { model: Chambre, attributes: ['id', 'numero'] }
                ]
            });

            // Départs aujourd'hui
            const departsAujourdhui = await Reservation.findAll({
                where: {
                    [Op.or]: [
                        {
                            type_reservation: 'classique',
                            date_depart: {
                                [Op.between]: [aujourdHui, demain]
                            }
                        },
                        {
                            type_reservation: 'horaire',
                            heure_fin: {
                                [Op.between]: [aujourdHui, demain]
                            }
                        }
                    ],
                    statut_reservation: 'confirmee'
                },
                include: [
                    { model: Client, attributes: ['id', 'prenom', 'nom'] },
                    { model: Chambre, attributes: ['id', 'numero'] }
                ]
            });

            // Tâches de nettoyage
            const tachesNettoyage = await TacheNettoyage.findAll({
                where: {
                    date_creation: {
                        [Op.between]: [aujourdHui, demain]
                    }
                },
                include: [Chambre],
                order: [['priorite', 'DESC']]
            });

            res.json({
                success: true,
                tableauDeBord: {
                    statistiquesChambres: {
                        total: totalChambres,
                        occupees: chambresOccupees,
                        nettoyage: chambresNettoyage,
                        libres: chambresLibres
                    },
                    arriveesAujourdhui,
                    departsAujourdhui,
                    tachesNettoyage,
                    occupationPourcentage: Math.round((chambresOccupees / totalChambres) * 100)
                }
            });

        } catch (error) {
            console.error('Erreur tableau de bord:', error);
            res.status(500).json({ error: 'Erreur lors de la récupération du tableau de bord' });
        }
    },

    getStatistiquesHotel: async (req, res) => {
        try {
            const { hotelId } = req.params;
            const aujourdHui = new Date();
            const debutMois = new Date(aujourdHui.getFullYear(), aujourdHui.getMonth(), 1);

            // Chiffre d'affaires du mois
            const resultatCA = await Reservation.findOne({
                attributes: [
                    [Sequelize.fn('SUM', Sequelize.col('montant_total')), 'chiffre_affaires']
                ],
                where: {
                    created_at: {
                        [Op.between]: [debutMois, aujourdHui]
                    },
                    statut_paiement: 'paye_en_ligne'
                },
                include: [{
                    model: Chambre,
                    where: { hotel_id: hotelId },
                    attributes: []
                }]
            });

            // Taux d'occupation
            const reservationsMois = await Reservation.count({
                where: {
                    created_at: {
                        [Op.between]: [debutMois, aujourdHui]
                    },
                    statut_reservation: 'confirmee'
                },
                include: [{
                    model: Chambre,
                    where: { hotel_id: hotelId }
                }]
            });

            const totalChambresHotel = await Chambre.count({ where: { hotel_id: hotelId } });
            const tauxOccupation = Math.round((reservationsMois / (totalChambresHotel * 30)) * 100);

            res.json({
                success: true,
                statistiques: {
                    chiffre_affaires: resultatCA.get('chiffre_affaires') || 0,
                    taux_occupation: tauxOccupation,
                    reservations_mois: reservationsMois,
                    total_chambres: totalChambresHotel
                }
            });

        } catch (error) {
            console.error('Erreur statistiques:', error);
            res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
        }
    }
};

module.exports = tableauDeBordController;