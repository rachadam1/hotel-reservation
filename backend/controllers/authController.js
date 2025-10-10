const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const Client = require('../models/Client');

const authController = {
    register: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { nom, prenom, email, mot_de_passe, telephone } = req.body;

            const clientExist = await Client.findOne({ where: { email } });
            if (clientExist) {
                return res.status(400).json({ error: 'Un client avec cet email existe déjà' });
            }

            const client = await Client.create({
                nom,
                prenom,
                email,
                mot_de_passe,
                telephone,
                role: 'client'
            });

            const token = jwt.sign(
                { id: client.id, email: client.email, role: client.role },
                process.env.JWT_SECRET,
                { expiresIn: '30d' }
            );

            res.status(201).json({
                success: true,
                message: 'Client créé avec succès',
                client: {
                    id: client.id,
                    nom: client.nom,
                    prenom: client.prenom,
                    email: client.email,
                    telephone: client.telephone,
                    role: client.role
                },
                token
            });

        } catch (error) {
            console.error('Erreur inscription:', error);
            res.status(500).json({ error: 'Erreur lors de l\'inscription' });
        }
    },

    login: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { email, mot_de_passe } = req.body;

            const client = await Client.findOne({ where: { email } });
            if (!client) {
                return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
            }

            const isPasswordValid = await client.verifierMotDePasse(mot_de_passe);
            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
            }

            const token = jwt.sign(
                { id: client.id, email: client.email, role: client.role },
                process.env.JWT_SECRET,
                { expiresIn: '30d' }
            );

            res.json({
                success: true,
                message: 'Connexion réussie',
                client: {
                    id: client.id,
                    nom: client.nom,
                    prenom: client.prenom,
                    email: client.email,
                    telephone: client.telephone,
                    role: client.role
                },
                token
            });

        } catch (error) {
            console.error('Erreur connexion:', error);
            res.status(500).json({ error: 'Erreur lors de la connexion' });
        }
    },

    getProfile: async (req, res) => {
        try {
            const client = await Client.findByPk(req.client.id, {
                attributes: { exclude: ['mot_de_passe'] }
            });

            res.json({
                success: true,
                client
            });

        } catch (error) {
            console.error('Erreur profil:', error);
            res.status(500).json({ error: 'Erreur lors de la récupération du profil' });
        }
    }
};

module.exports = authController;