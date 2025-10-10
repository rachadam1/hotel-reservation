const Hotel = require('../models/Hotel');
const Chambre = require('../models/Chambre');

const hotelController = {
    getAllHotels: async (req, res) => {
        try {
            const hotels = await Hotel.findAll({
                include: [{
                    model: Chambre,
                    attributes: ['id', 'numero', 'type_chambre', 'prix_nuit', 'statut']
                }]
            });

            res.json({
                success: true,
                hotels
            });

        } catch (error) {
            console.error('Erreur liste hôtels:', error);
            res.status(500).json({ error: 'Erreur lors de la récupération des hôtels' });
        }
    },

    getHotelById: async (req, res) => {
        try {
            const { id } = req.params;

            const hotel = await Hotel.findByPk(id, {
                include: [{
                    model: Chambre,
                    attributes: ['id', 'numero', 'type_chambre', 'superficie', 'capacite', 'prix_nuit', 'statut', 'equipements']
                }]
            });

            if (!hotel) {
                return res.status(404).json({ error: 'Hôtel non trouvé' });
            }

            res.json({
                success: true,
                hotel
            });

        } catch (error) {
            console.error('Erreur détail hôtel:', error);
            res.status(500).json({ error: 'Erreur lors de la récupération de l\'hôtel' });
        }
    },

    getAvailableRooms: async (req, res) => {
        try {
            const { hotelId } = req.params;
            const { type_chambre } = req.query;

            const whereCondition = { 
                hotel_id: hotelId, 
                statut: 'libre' 
            };

            if (type_chambre) {
                whereCondition.type_chambre = type_chambre;
            }

            const chambres = await Chambre.findAll({
                where: whereCondition,
                include: [{
                    model: Hotel,
                    attributes: ['nom', 'ville']
                }]
            });

            res.json({
                success: true,
                chambres
            });

        } catch (error) {
            console.error('Erreur chambres disponibles:', error);
            res.status(500).json({ error: 'Erreur lors de la récupération des chambres' });
        }
    }
};

module.exports = hotelController;