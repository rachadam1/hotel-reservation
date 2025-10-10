const Hotel = require('../models/Hotel');
const Chambre = require('../models/Chambre');
const Reservation = require('../models/Reservation');
const Client = require('../models/Client');
const { Sequelize, Op } = require('sequelize');

const adminController = {
    // Gestion des hôtels
    creerHotel: async (req, res) => {
        try {
            const { nom, adresse, ville, telephone, email, description } = req.body;

            const hotel = await Hotel.create({
                nom,
                adresse,
                ville,
                telephone,
                email,
                description,
                note: 0.00
            });

            res.status(201).json({
                success: true,
                message: 'Hôtel créé avec succès',
                hotel
            });

        } catch (error) {
            console.error('Erreur création hôtel:', error);
            res.status(500).json({ error: 'Erreur lors de la création de l\'hôtel' });
        }
    },

    // Tableau de bord global multi-hôtels
    getTableauBordGlobal: async (req, res) => {
        try {
            const hotels = await Hotel.findAll({
                include: [{
                    model: Chambre,
                    attributes: ['id', 'statut']
                }]
            });

            const statistiquesGlobales = {
                totalHotels: hotels.length,
                totalChambres: 0,
                chambresOccupees: 0,
                chiffreAffairesMois: 0,
                reservationsMois: 0
            };

            // Calcul des statistiques pour chaque hôtel
            const statistiquesHotels = await Promise.all(
                hotels.map(async (hotel) => {
                    const debutMois = new Date();
                    debutMois.setDate(1);
                    debutMois.setHours(0, 0, 0, 0);

                    const caMois = await Reservation.findOne({
                        attributes: [
                            [Sequelize.fn('SUM', Sequelize.col('montant_total')), 'chiffre_affaires']
                        ],
                        where: {
                            created_at: { [Op.gte]: debutMois },
                            statut_paiement: 'paye_en_ligne'
                        },
                        include: [{
                            model: Chambre,
                            where: { hotel_id: hotel.id },
                            attributes: []
                        }]
                    });

                    const chambresOccupees = await Chambre.count({
                        where: { 
                            hotel_id: hotel.id,
                            statut: 'occupee' 
                        }
                    });

                    const totalChambres = await Chambre.count({
                        where: { hotel_id: hotel.id }
                    });

                    // Mise à jour des totaux globaux
                    statistiquesGlobales.totalChambres += totalChambres;
                    statistiquesGlobales.chambresOccupees += chambresOccupees;
                    statistiquesGlobales.chiffreAffairesMois += parseFloat(caMois.get('chiffre_affaires') || 0);

                    return {
                        id: hotel.id,
                        nom: hotel.nom,
                        ville: hotel.ville,
                        statistiques: {
                            totalChambres,
                            chambresOccupees,
                            tauxOccupation: Math.round((chambresOccupees / totalChambres) * 100),
                            chiffreAffairesMois: parseFloat(caMois.get('chiffre_affaires') || 0)
                        }
                    };
                })
            );

            res.json({
                success: true,
                statistiquesGlobales,
                hotels: statistiquesHotels
            });

        } catch (error) {
            console.error('Erreur tableau de bord global:', error);
            res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
        }
    },

    // Analyses détaillées par hôtel
    getAnalysesDetaillees: async (req, res) => {
        try {
            const { hotel_id } = req.params;
            const aujourdHui = new Date();
            const debutMois = new Date(aujourdHui.getFullYear(), aujourdHui.getMonth(), 1);

            // Réservations classiques vs horaires
            const reservationsParType = await Reservation.findAll({
                attributes: [
                    'type_reservation',
                    [Sequelize.fn('COUNT', Sequelize.col('id')), 'nombre'],
                    [Sequelize.fn('SUM', Sequelize.col('montant_total')), 'revenu']
                ],
                where: {
                    created_at: { [Op.gte]: debutMois }
                },
                include: [{
                    model: Chambre,
                    where: { hotel_id },
                    attributes: []
                }],
                group: ['type_reservation']
            });

            // Performance par type de chambre
            const performanceParType = await Reservation.findAll({
                attributes: [
                    [Sequelize.col('Chambre.type_chambre'), 'type_chambre'],
                    [Sequelize.fn('COUNT', Sequelize.col('Reservation.id')), 'nombre_reservations'],
                    [Sequelize.fn('SUM', Sequelize.col('Reservation.montant_total')), 'revenu_total'],
                    [Sequelize.fn('AVG', Sequelize.col('Reservation.montant_total')), 'revenu_moyen']
                ],
                where: {
                    created_at: { [Op.gte]: debutMois }
                },
                include: [{
                    model: Chambre,
                    where: { hotel_id },
                    attributes: []
                }],
                group: ['Chambre.type_chambre']
            });

            // Taux d'occupation par jour du mois
            const occupationParJour = await Reservation.findAll({
                attributes: [
                    [Sequelize.fn('DATE', Sequelize.col('created_at')), 'date'],
                    [Sequelize.fn('COUNT', Sequelize.col('id')), 'reservations']
                ],
                where: {
                    created_at: { [Op.gte]: debutMois }
                },
                include: [{
                    model: Chambre,
                    where: { hotel_id },
                    attributes: []
                }],
                group: [Sequelize.fn('DATE', Sequelize.col('created_at'))],
                order: [[Sequelize.fn('DATE', Sequelize.col('created_at')), 'ASC']]
            });

            res.json({
                success: true,
                analyses: {
                    reservationsParType,
                    performanceParType,
                    occupationParJour
                }
            });

        } catch (error) {
            console.error('Erreur analyses détaillées:', error);
            res.status(500).json({ error: 'Erreur lors de la récupération des analyses' });
        }
    }
};

module.exports = adminController;