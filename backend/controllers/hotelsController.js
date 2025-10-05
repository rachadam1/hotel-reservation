const db = require('../config/db');

exports.getAllHotels = (req, res) => {
  db.query('SELECT * FROM hotels', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.createHotel = (req, res) => {
  const { nom, adresse, email_contact, téléphone, logo_url, description } = req.body;
  db.query(
    'INSERT INTO hotels (nom, adresse, email_contact, téléphone, logo_url, description) VALUES (?, ?, ?, ?, ?, ?)',
    [nom, adresse, email_contact, téléphone, logo_url, description],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.status(201).json({ message: 'Hôtel ajouté', id: result.insertId });
    }
  );
};
exports.getAllHotels = (req, res) => {
  db.query('SELECT * FROM hotels', (err, results) => {
    if (err) return res.status(500).json({ message: "Erreur lors de la récupération des hôtels." });
    res.json(results);
  });
};
exports.getHotelById = (req, res) => {
  const id = req.params.id;
  db.query('SELECT * FROM hotels WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ message: "Erreur serveur." });
    if (results.length === 0) return res.status(404).json({ message: "Hôtel introuvable." });
    res.json(results[0]);
  });
};

exports.updateHotel = (req, res) => {
  const id = req.params.id;
  const {
    nom, adresse, ville, pays, email_contact, téléphone, logo_url, description
  } = req.body;

  db.query(
    `UPDATE hotels SET nom = ?, adresse = ?, ville = ?, pays = ?, email_contact = ?, téléphone = ?, logo_url = ?, description = ? WHERE id = ?`,
    [nom, adresse, ville, pays, email_contact, téléphone, logo_url, description, id],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Erreur lors de la mise à jour." });
      res.json({ message: "Hôtel mis à jour avec succès." });
    }
  );
};
exports.createHotel = (req, res) => {
  const {
    nom, adresse, ville, pays, email_contact, téléphone, logo_url, description
  } = req.body;

  if (!nom) return res.status(400).json({ message: "Le nom de l'hôtel est obligatoire." });

  db.query(
    `INSERT INTO hotels (nom, adresse, ville, pays, email_contact, téléphone, logo_url, description)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [nom, adresse, ville, pays, email_contact, téléphone, logo_url, description],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Erreur lors de l'ajout de l'hôtel." });
      res.status(201).json({ message: "Hôtel ajouté avec succès.", id: result.insertId });
    }
  );
};
exports.getHotelStats = (req, res) => {
  const hotelId = req.params.id;

  const sql = `
    SELECT 
      h.nom,
      (SELECT COUNT(*) FROM chambres WHERE hotel_id = ?) AS total_chambres,
      (SELECT COUNT(*) FROM chambres WHERE hotel_id = ? AND statut = 'disponible') AS chambres_disponibles,
      (SELECT COUNT(*) FROM chambres WHERE hotel_id = ? AND statut = 'occupée') AS chambres_occupees,
      (SELECT COUNT(*) FROM reservations WHERE hotel_id = ? AND statut_reservation = 'confirmée') AS reservations_actives,
      (SELECT SUM(prix_classique) FROM chambres WHERE hotel_id = ?) AS revenu_classique,
      (SELECT SUM(prix_horaire) FROM chambres WHERE hotel_id = ?) AS revenu_horaire
    FROM hotels h
    WHERE h.id = ?
  `;

  db.query(sql, [hotelId, hotelId, hotelId, hotelId, hotelId, hotelId, hotelId], (err, results) => {
    if (err) return res.status(500).json({ message: "Erreur lors du calcul des statistiques." });
    res.json(results[0]);
  });
};

