const db = require('../config/db');

exports.getAllOptions = (req, res) => {
  db.query('SELECT * FROM options', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.createOption = (req, res) => {
  const { nom, description, prix } = req.body;
  db.query(
    'INSERT INTO options (nom, description, prix) VALUES (?, ?, ?)',
    [nom, description, prix],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.status(201).json({ message: 'Option ajoutée', id: result.insertId });
    }
  );
};
