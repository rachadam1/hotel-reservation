const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TacheNettoyage = sequelize.define('TacheNettoyage', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  chambre_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  personnel_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  date_creation: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  date_debut: {
    type: DataTypes.DATE,
    allowNull: true
  },
  date_fin: {
    type: DataTypes.DATE,
    allowNull: true
  },
  statut: {
    type: DataTypes.ENUM('a_faire', 'en_cours', 'termine', 'a_controler', 'validee'),
    defaultValue: 'a_faire'
  },
  priorite: {
    type: DataTypes.ENUM('faible', 'moyenne', 'haute', 'urgente'),
    defaultValue: 'moyenne'
  },
  duree_estimee: {
    type: DataTypes.INTEGER,
    defaultValue: 30
  },
  duree_reelle: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  validee_par: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  validee_le: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'taches_nettoyage',
  timestamps: false
});

module.exports = TacheNettoyage;