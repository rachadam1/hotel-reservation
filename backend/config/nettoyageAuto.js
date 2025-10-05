const db = require('./config/db'); // ✅ chemin corrigé

function verifierChambresNettoyage() {
  const maintenant = new Date();

  db.query("SELECT id, heure_check_out FROM chambres WHERE statut = 'à nettoyer'", (err, chambres) => {
    if (err) return console.error("❌ Erreur lors de la vérification :", err);

    chambres.forEach(chambre => {
      const heureDepart = new Date(chambre.heure_check_out);
      const ecart = maintenant - heureDepart;

      if (ecart >= 30 * 60 * 1000) { // ✅ 30 minutes
        db.query(
          "UPDATE chambres SET statut = 'disponible', heure_check_out = NULL WHERE id = ?",
          [chambre.id],
          (err2) => {
            if (err2) console.error("❌ Erreur mise à jour :", err2);
            else console.log(`✅ Chambre ${chambre.id} passée en disponible automatiquement`);
          }
        );
      }
    });
  });
}

// 🔁 Exécuter toutes les minutes
setInterval(verifierChambresNettoyage, 60 * 1000);
