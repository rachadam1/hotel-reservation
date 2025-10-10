const TacheNettoyage = require('../models/TacheNettoyage');
const Chambre = require('../models/Chambre');
const Client = require('../models/Client');

const nettoyageController = {
    creerTacheNettoyage: async (req, res) => {
        try {
            const { chambre_id, priorite = 'moyenne' } = req.body;

            const chambre = await Chambre.findByPk(chambre_id);
            if (!chambre) {
                return res.status(404).json({ error: 'Chambre non trouvée' });
            }

            const tache = await TacheNettoyage.create({
                chambre_id: chambre_id,
                date_creation: new Date(),
                statut: 'a_faire',
                priorite: priorite,
                duree_estimee: 30
            });

            await Chambre.update({ statut: 'nettoyage' }, { 
                where: { id: chambre_id } 
            });

            const tacheComplete = await TacheNettoyage.findByPk(tache.id, {
                include: [Chambre]
            });

            res.status(201).json({
                succes: true,
                tache: tacheComplete,
                message: 'Tâche de nettoyage créée'
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    obtenirTachesNettoyage: async (req, res) => {
        try {
            const { statut, hotel_id } = req.query;
            
            const filtre = {};
            if (statut) filtre.statut = statut;

            const taches = await TacheNettoyage.findAll({
                include: [
                    {
                        model: Chambre,
                        attributes: ['id', 'numero', 'type_chambre', 'etage'],
                        where: hotel_id ? { hotel_id } : {}
                    }
                ],
                order: [
                    ['statut', 'ASC'],
                    ['priorite', 'DESC'],
                    ['date_creation', 'ASC']
                ]
            });

            res.json(taches);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    mettreAJourStatutTache: async (req, res) => {
        try {
            const { id } = req.params;
            const { statut, notes } = req.body;

            const donneesMAJ = { statut };
            if (notes) donneesMAJ.notes = notes;

            if (statut === 'en_cours') {
                donneesMAJ.date_debut = new Date();
            } else if (statut === 'termine') {
                donneesMAJ.date_fin = new Date();
            }

            await TacheNettoyage.update(donneesMAJ, {
                where: { id }
            });

            const tacheMAJ = await TacheNettoyage.findByPk(id, {
                include: [Chambre]
            });

            res.json({
                succes: true,
                tache: tacheMAJ,
                message: 'Statut mis à jour'
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    validerTache: async (req, res) => {
        try {
            const { id } = req.params;

            const tache = await TacheNettoyage.findByPk(id);
            if (!tache) {
                return res.status(404).json({ error: 'Tâche non trouvée' });
            }

            await TacheNettoyage.update(
                {
                    statut: 'validee',
                    validee_le: new Date(),
                    validee_par: req.client.id
                },
                { where: { id } }
            );

            await Chambre.update(
                {
                    statut: 'libre'
                },
                { where: { id: tache.chambre_id } }
            );

            const tacheMAJ = await TacheNettoyage.findByPk(id, {
                include: [Chambre]
            });

            res.json({
                succes: true,
                tache: tacheMAJ,
                message: 'Tâche validée - Chambre prête'
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = nettoyageController;