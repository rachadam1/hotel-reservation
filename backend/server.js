const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, '../frontend')));

// =================================
// IMPORTATION DES ROUTES EXISTANTES
// =================================
const authRoutes = require('./routes/auth');
const hotelRoutes = require('./routes/hotels');
const reservationRoutes = require('./routes/reservations');
const nettoyageRoutes = require('./routes/nettoyage');
const paiementRoutes = require('./routes/paiements');
const tableauDeBordRoutes = require('./routes/tableau-de-bord');

// =================================
// IMPORTATION DES NOUVELLES ROUTES
// =================================
const antiSurchargeRoutes = require('./routes/anti-surcharge');
const adminRoutes = require('./routes/admin');
const emailRoutes = require('./routes/emails');

// =================================
// UTILISATION DES ROUTES EXISTANTES
// =================================
app.use('/api/auth', authRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/nettoyage', nettoyageRoutes);
app.use('/api/paiements', paiementRoutes);
app.use('/api/tableau-de-bord', tableauDeBordRoutes);

// =================================
// UTILISATION DES NOUVELLES ROUTES
// =================================
app.use('/api/anti-surcharge', antiSurchargeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/emails', emailRoutes);

// =================================
// ROUTES DE BASE
// =================================
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: '🏨 API Hotel en ligne - SYSTÈME COMPLET',
        timestamp: new Date().toISOString(),
        version: '2.0.0',
        fonctionnalites: [
            'Authentification multi-rôles',
            'Gestion multi-hôtels',
            'Réservations classiques/horaires',
            'Système anti-sur-réservation',
            'Nettoyage intelligent',
            'Paiements en ligne/sur place',
            'Emails automatiques',
            'Tableaux de bord avancés',
            'Administration complète'
        ]
    });
});

app.get('/api', (req, res) => {
    res.json({
        message: 'API Gestion Hôtelière - Système Complet',
        version: '2.0.0',
        endpoints: {
            // Routes existantes
            auth: '/api/auth',
            hotels: '/api/hotels',
            reservations: '/api/reservations',
            nettoyage: '/api/nettoyage',
            paiements: '/api/paiements',
            tableau_de_bord: '/api/tableau-de-bord',
            
            // Nouvelles routes
            anti_surcharge: '/api/anti-surcharge',
            admin: '/api/admin',
            emails: '/api/emails'
        },
        documentation: {
            health_check: 'GET /api/health',
            liste_endpoints: 'GET /api'
        }
    });
});

app.get('/', (req, res) => {
    res.json({
        message: '🏨 Bienvenue sur le système de gestion hôtelière multi-hôtels',
        description: 'Système complet de réservation, gestion et administration hôtelière',
        version: '2.0.0',
        status: '🟢 EN LIGNE',
        documentation: 'Visitez /api pour voir tous les endpoints disponibles',
        fonctionnalites_principales: [
            'Réservations clients en ligne',
            'Gestion réception en temps réel',
            'Système de nettoyage intelligent',
            'Protection anti-sur-réservation',
            'Tableaux de bord analytiques',
            'Administration multi-hôtels'
        ]
    });
});

// =================================
// GESTION DES ERREURS ET ROUTES NON TROUVÉES
// =================================

// Gestion des routes non trouvées
app.use('*', (req, res) => {
    res.status(404).json({ 
        error: 'Route non trouvée: ' + req.originalUrl,
        available_routes: [
            'GET /api/health - Statut du système',
            'GET /api - Liste des endpoints',
            'POST /api/auth/register - Inscription',
            'POST /api/auth/login - Connexion',
            'GET /api/hotels - Liste des hôtels',
            'POST /api/reservations - Créer réservation',
            'GET /api/anti-surcharge/statut-securite/:hotel_id - Statut sécurité',
            'POST /api/anti-surcharge/verifier-disponibilite - Vérifier disponibilité',
            'GET /api/admin/tableau-bord-global - Tableau de bord admin'
        ],
        documentation: 'Consultez GET /api pour la documentation complète'
    });
});

// Gestion globale des erreurs
app.use((error, req, res, next) => {
    console.error('🚨 Erreur globale du serveur:', {
        message: error.message,
        stack: error.stack,
        url: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString()
    });
    
    res.status(500).json({ 
        error: 'Erreur interne du serveur',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Une erreur est survenue',
        reference: Date.now() // ID unique pour le debugging
    });
});

// =================================
// DÉMARRAGE DU SERVEUR
// =================================

app.listen(PORT, async () => {
    console.log('🚀 ==================================================');
    console.log('🏨  SERVEUR HOTEL DÉMARRÉ - SYSTÈME 100% COMPLET');
    console.log('🚀 ==================================================');
    console.log(`📍 Port: ${PORT}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`🔧 Environnement: ${process.env.NODE_ENV || 'development'}`);
    console.log('📊 Base de données: Connexion en cours...');
    
    // Test de la base de données
    try {
        const sequelize = require('./config/database');
        await sequelize.authenticate();
        console.log('✅ Base de données connectée avec succès');
        
        // Synchronisation des modèles
        await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
        console.log('✅ Modèles synchronisés');
        
    } catch (error) {
        console.log('❌ Erreur base de données:', error.message);
        console.log('💡 Vérifiez que MySQL est démarré et que la base existe');
    }
    
    console.log('🚀 ==================================================');
    console.log('🎯 FONCTIONNALITÉS IMPLÉMENTÉES:');
    console.log('   ✅ Authentification clients/réception/admin');
    console.log('   ✅ Gestion multi-hôtels complète');
    console.log('   ✅ Réservations classiques et horaires');
    console.log('   ✅ 🛡️  Système anti-sur-réservation intelligent');
    console.log('   ✅ 🧹 Système de nettoyage avec validation qualité');
    console.log('   ✅ 💳 Paiements en ligne et sur place');
    console.log('   ✅ 📧 Emails automatiques de confirmation');
    console.log('   ✅ 📊 Tableaux de bord réception et admin');
    console.log('   ✅ 🔧 Administration multi-hôtels complète');
    console.log('   ✅ 🎯 Chambre joker 999 pour urgences');
    console.log('   ✅ 📈 Analyses et rapports détaillés');
    console.log('🚀 ==================================================');
    console.log('🔗 ENDPOINTS PRINCIPAUX:');
    console.log('   📍 GET  /api/health          → Statut du système');
    console.log('   📍 GET  /api                 → Documentation');
    console.log('   📍 POST /api/auth/login      → Connexion');
    console.log('   📍 GET  /api/hotels          → Liste hôtels');
    console.log('   📍 POST /api/reservations    → Réserver');
    console.log('   📍 GET  /api/admin/tableau-bord-global → Admin');
    console.log('🚀 ==================================================');
    console.log('🌟 Le système est prêt pour la production!');
    console.log('🚀 ==================================================');
    
    // Message de bienvenue supplémentaire
    console.log('\n💡 ASTUCES:');
    console.log('   • Exécutez "npm run seed" pour peupler la base de données');
    console.log('   • Testez avec "node scripts/test-complet.js"');
    console.log('   • Les logs détaillés sont activés pour le debugging\n');
});