const db = require('../config/db');
const crypto = require('crypto');

// 🔍 Récupérer toutes les réservations
exports.getAllReservations = (req, res) => {
  db.query('SELECT * FROM reservations', (err, results) => {
    if (err) return res.status(500).json({ message: "Erreur lors de la récupération des réservations." });
    res.json(results);
  });
};

// 🔍 Récupérer les réservations d’un client
exports.getReservationsByClient = (req, res) => {
  const client_id = req.params.client_id;
  db.query('SELECT * FROM reservations WHERE client_id = ?', [client_id], (err, results) => {
    if (err) return res.status(500).json({ message: "Erreur lors de la récupération des réservations du client." });
    res.json(results);
  });
};

// 🆕 Créer une nouvelle réservation
exports.createReservation = (req, res) => {
  const {
    client_id,
    hotel_id,
    chambre_id,
    type,
    date_arrivee,
    date_depart,
    heure_arrivee,
    heure_depart,
    statut_paiement,
    statut_reservation
  } = req.body;

  // ✅ Validation des champs obligatoires
  if (!client_id || !hotel_id || !chambre_id || !type || !statut_paiement || !statut_reservation) {
    return res.status(400).json({ message: "Certains champs obligatoires sont manquants." });
  }

  // 🆔 Génération d’un code de réservation unique
  const reference = 'RES-' + crypto.randomBytes(4).toString('hex').toUpperCase();

  // 🕒 Adaptation selon le type de réservation
  const isHoraire = type === 'horaire';
  const dateArriveeFinale = isHoraire ? null : date_arrivee;
  const dateDepartFinale = isHoraire ? null : date_depart;

  // 💾 Insertion dans la base de données
  db.query(
    `INSERT INTO reservations 
     (client_id, hotel_id, chambre_id, type, date_arrivee, date_depart, heure_arrivee, heure_depart, statut_paiement, statut_reservation, reference)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      client_id,
      hotel_id,
      chambre_id,
      type,
      dateArriveeFinale,
      dateDepartFinale,
      heure_arrivee,
      heure_depart,
      statut_paiement,
      statut_reservation,
      reference
    ],
    (err, result) => {
      if (err) {
        console.error("Erreur MySQL :", err);
        return res.status(500).json({ message: "Erreur serveur lors de l'enregistrement de la réservation." });
      }
      res.status(201).json({
        message: "Réservation enregistrée avec succès.",
        id: result.insertId,
        reference
      });
    }
  );
};
