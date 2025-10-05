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
exports.createReservation = (req, res) => {
  const {
    nom_client, date_arrivee, date_depart,
    heure_arrivee, heure_depart,
    type_reservation, chambre_id, hotel_id
  } = req.body;

  // Vérification de conflit
  const checkConflit = `
    SELECT * FROM reservations 
    WHERE chambre_id = ? AND (
      (date_arrivee <= ? AND date_depart >= ?) OR
      (heure_arrivee <= ? AND heure_depart >= ?)
    )
  `;

  db.query(checkConflit, [chambre_id, date_arrivee, date_depart, heure_arrivee, heure_depart], (err, rows) => {
    if (err) return res.status(500).json({ message: "Erreur lors de la vérification." });
    if (rows.length > 0) return res.status(409).json({ message: "Conflit : chambre déjà réservée." });

    // Insertion
    const insert = `
      INSERT INTO reservations (nom_client, date_arrivee, date_depart, heure_arrivee, heure_depart, type_reservation, chambre_id, hotel_id, statut_reservation)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'confirmée')
    `;

    db.query(insert, [nom_client, date_arrivee, date_depart, heure_arrivee, heure_depart, type_reservation, chambre_id, hotel_id], (err2, result) => {
      if (err2) return res.status(500).json({ message: "Erreur lors de l’enregistrement." });

      // Mise à jour du statut de la chambre
      db.query("UPDATE chambres SET statut = 'occupée' WHERE id = ?", [chambre_id]);
      res.status(201).json({ message: "Réservation enregistrée." });
    });
  });
};
exports.getReservationsByHotel = (req, res) => {
  const { hotel_id, date } = req.query;
  let sql = `
    SELECT r.*, c.numero AS numero_chambre 
    FROM reservations r 
    JOIN chambres c ON r.chambre_id = c.id 
    WHERE r.hotel_id = ?
  `;
  const params = [hotel_id];

  if (date) {
    sql += " AND r.date_arrivee <= ? AND r.date_depart >= ?";
    params.push(date, date);
  }

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ message: "Erreur lors de la récupération." });
    res.json(results);
  });
};
