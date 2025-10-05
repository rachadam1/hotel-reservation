const db = require('../config/db');

exports.getAllChambres = (req, res) => {
  db.query('SELECT * FROM chambres', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.getChambresByHotel = (req, res) => {
  const hotel_id = req.params.hotel_id;
  db.query('SELECT * FROM chambres WHERE hotel_id = ?', [hotel_id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.createChambre = (req, res) => {
  const {
    hotel_id,
    numero,
    type,
    superficie,
    capacite,
    statut,
    prix_classique,
    prix_horaire
  } = req.body;

  db.query(
    `INSERT INTO chambres (hotel_id, numero, type, superficie, capacite, statut, prix_classique, prix_horaire)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [hotel_id, numero, type, superficie, capacite, statut, prix_classique, prix_horaire],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.status(201).json({ message: 'Chambre ajoutée', id: result.insertId });
    }
  );
};
exports.updateStatutChambre = (req, res) => {
  const chambreId = req.params.id;
  const { statut } = req.body;

  const statutsValides = ['disponible', 'occupée', 'à nettoyer', 'hors service', 'réservée'];
  if (!statutsValides.includes(statut)) {
    return res.status(400).json({ message: 'Statut invalide.' });
  }

  db.query(
    'UPDATE chambres SET statut = ? WHERE id = ?',
    [statut, chambreId],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: `Chambre ${chambreId} mise à jour avec le statut "${statut}".` });
    }
  );
};
exports.getChambresByHotel = (req, res) => {
  const { hotel_id, statut } = req.query;
  let sql = "SELECT * FROM chambres WHERE hotel_id = ?";
  const params = [hotel_id];

  if (statut) {
    sql += " AND statut = ?";
    params.push(statut);
  }

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ message: "Erreur lors de la récupération des chambres." });
    res.json(results);
  });
};
exports.getChambresParStatut = (req, res) => {
  const { statut } = req.query;
  db.query("SELECT * FROM chambres WHERE statut = ?", [statut], (err, results) => {
    if (err) return res.status(500).json({ message: "Erreur serveur." });
    res.json(results);
  });
};
exports.checkOutChambre = (req, res) => {
  const chambreId = req.params.id;
  const heure = new Date();

  db.query(
    "UPDATE chambres SET statut = 'à nettoyer', heure_check_out = ? WHERE id = ?",
    [heure, chambreId],
    (err) => {
      if (err) return res.status(500).json({ message: "Erreur lors du départ du client." });
      res.json({ message: "Départ enregistré. Chambre à nettoyer." });
    }
  );
};
