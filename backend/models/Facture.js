const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Facture = sequelize.define('Facture', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  numero_facture: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  reservation_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  client_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  chambre_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  hotel_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  articles: {
    type: DataTypes.JSON,
    allowNull: false
  },
  sous_total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  taxe: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  montant_paye: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  solde_du: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  statut_paiement: {
    type: DataTypes.ENUM('payee', 'en_attente', 'partiel', 'annulee'),
    defaultValue: 'en_attente'
  },
  methode_paiement: {
    type: DataTypes.ENUM('carte', 'especes', 'virement', 'en_ligne', 'sur_place'),
    allowNull: true
  },
  date_echeance: {
    type: DataTypes.DATE,
    allowNull: true
  },
  payee_le: {
    type: DataTypes.DATE,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'factures',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Facture;