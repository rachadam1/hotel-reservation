const jwt = require('jsonwebtoken');
const Client = require('../models/Client');

const authMiddleware = {
    verifierToken: async (req, res, next) => {
        try {
            const token = req.header('Authorization')?.replace('Bearer ', '');
            
            if (!token) {
                return res.status(401).json({ error: 'Token manquant' });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const client = await Client.findByPk(decoded.id, {
                attributes: { exclude: ['mot_de_passe'] }
            });

            if (!client) {
                return res.status(401).json({ error: 'Token invalide' });
            }

            req.client = client;
            next();
        } catch (error) {
            console.error('Erreur vérification token:', error);
            res.status(401).json({ error: 'Token invalide' });
        }
    },

    verifierRole: (roles) => {
        return (req, res, next) => {
            if (!roles.includes(req.client.role)) {
                return res.status(403).json({ 
                    error: 'Accès non autorisé pour ce rôle' 
                });
            }
            next();
        };
    }
};

module.exports = authMiddleware;