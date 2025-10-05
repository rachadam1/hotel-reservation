const jwt = require('jsonwebtoken');

// 🔐 Vérifie que le jeton est présent et valide
exports.verifierToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // format "Bearer TOKEN"

  if (!token) return res.status(401).json({ message: 'Token manquant' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "SECRET_KEY");
    req.utilisateur = decoded; // contient { id, role, hotel_id }
    next();
  } catch (err) {
    res.status(403).json({ message: 'Token invalide ou expiré' });
  }
};

// 🔐 Vérifie que le rôle est autorisé
exports.verifierRole = (rolesAutorises) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Accès refusé." });

    jwt.verify(token, process.env.JWT_SECRET || "SECRET_KEY", (err, decoded) => {
      if (err || !rolesAutorises.includes(decoded.role)) {
        return res.status(403).json({ message: "Accès interdit." });
      }
      req.utilisateur = decoded;
      next();
    });
  };
};
