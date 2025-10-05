const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 🔐 Fonction utilitaire pour valider le mot de passe
function isStrongPassword(password) {
  return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/.test(password);
}

exports.register = (req, res) => {
  const { nom, email, mot_de_passe, role, hotel_id } = req.body;

  // ✅ Validation des champs
  if (!nom || !email || !mot_de_passe || !role) {
    return res.status(400).json({ message: 'Tous les champs obligatoires doivent être remplis.' });
  }

  if (!isStrongPassword(mot_de_passe)) {
    return res.status(400).json({
      message: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre.'
    });
  }

  // 🔐 Vérifier si l'email existe déjà
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length > 0) {
      return res.status(409).json({ message: 'Cet email est déjà utilisé.' });
    }

    // 🔐 Hash du mot de passe
    bcrypt.hash(mot_de_passe, 10, (err, hash) => {
      if (err) return res.status(500).json({ error: err });

      db.query(
        'INSERT INTO users (nom, email, mot_de_passe, role, hotel_id) VALUES (?, ?, ?, ?, ?)',
        [nom, email, hash, role, hotel_id || null],
        (err, result) => {
          if (err) return res.status(500).json({ error: err });

          // 📦 Générer un token JWT
          const token = jwt.sign(
            { id: result.insertId, role, hotel_id, nom },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
          );

          res.status(201).json({
            message: 'Inscription réussie',
            token
          });
        }
      );
    });
  });
};
// 🔄 Récupérer les infos du client
exports.getUserById = (req, res) => {
  const userId = parseInt(req.params.id);
  const requesterId = req.user.id;

  if (userId !== requesterId) {
    return res.status(403).json({ message: 'Accès interdit à ce profil.' });
  }

  db.query('SELECT id, nom, email, role, hotel_id FROM users WHERE id = ?', [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    res.json(results[0]);
  });
};

// 📝 Mettre à jour le profil
exports.updateUser = (req, res) => {
  const userId = parseInt(req.params.id);
  const requesterId = req.user.id;

  if (userId !== requesterId) {
    return res.status(403).json({ message: 'Modification non autorisée.' });
  }

  const { nom, email, telephone, mot_de_passe } = req.body;

  if (!nom || !email || !telephone) {
    return res.status(400).json({ message: 'Tous les champs obligatoires doivent être remplis.' });
  }

  const updateUser = () => {
    db.query(
      'UPDATE users SET nom = ?, email = ?, telephone = ? WHERE id = ?',
      [nom, email, telephone, userId],
      (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Profil mis à jour avec succès.' });
      }
    );
  };

  if (mot_de_passe) {
    bcrypt.hash(mot_de_passe, 10, (err, hash) => {
      if (err) return res.status(500).json({ error: err });
      db.query(
        'UPDATE users SET nom = ?, email = ?, telephone = ?, mot_de_passe = ? WHERE id = ?',
        [nom, email, telephone, hash, userId],
        (err) => {
          if (err) return res.status(500).json({ error: err });
          res.json({ message: 'Profil mis à jour avec nouveau mot de passe.' });
        }
      );
    });
  } else {
    updateUser();
  }
};
