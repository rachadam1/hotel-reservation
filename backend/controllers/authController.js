const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.connexion = (req, res) => {
  const { email, mot_de_passe } = req.body;

  db.query("SELECT * FROM utilisateurs WHERE email = ?", [email], async (err, results) => {
    if (err || results.length === 0) return res.status(401).json({ message: "Utilisateur introuvable." });

    const utilisateur = results[0];
    const match = await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe);

    if (!match) return res.status(403).json({ message: "Mot de passe incorrect." });

    const token = jwt.sign({ id: utilisateur.id, role: utilisateur.role }, "SECRET_KEY", { expiresIn: "2h" });

    res.json({ token, role: utilisateur.role, nom: utilisateur.nom });
  });
};
