const db = require('../config/db');

exports.addOptionToReservation = (req, res) => {
  const { reservation_id, option_id } = req.body;
  db.query(
    'INSERT INTO reservationoptions (reservation_id, option_id) VALUES (?, ?)',
    [reservation_id, option_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.status(201).json({ message: 'Option ajoutée à la réservation' });
    }
  );
};

exports.getOptionsForReservation = (req, res) => {
  const reservation_id = req.params.reservation_id;
  db.query(
    `SELECT o.nom, o.description, o.prix
     FROM reservationoptions ro
     JOIN options o ON ro.option_id = o.id
     WHERE ro.reservation_id = ?`,
    [reservation_id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    }
  );
};
