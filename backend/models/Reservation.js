const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Reservation = sequelize.define('Reservation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  numero_reservation: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  client_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  chambre_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  type_reservation: {
    type: DataTypes.ENUM('horaire', 'classique'),
    allowNull: false
  },
  date_arrivee: {
    type: DataTypes.DATE,
    allowNull: true
  },
  date_depart: {
    type: DataTypes.DATE,
    allowNull: true
  },
  heure_debut: {
    type: DataTypes.DATE,
    allowNull: true
  },
  heure_fin: {
    type: DataTypes.DATE,
    allowNull: true
  },
  nombre_adultes: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  nombre_enfants: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  montant_total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  statut_paiement: {
    type: DataTypes.ENUM('en_attente', 'paye_en_ligne', 'a_payer_sur_place'),
    defaultValue: 'en_attente'
  },
  statut_reservation: {
    type: DataTypes.ENUM('confirmee', 'annulee', 'terminee', 'en_cours'),
    defaultValue: 'confirmee'
  },
  options_supplementaires: {
    type: DataTypes.JSON,
    allowNull: true
  }
}, {
  tableName: 'reservations',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Reservation;
