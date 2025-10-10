// server.js
console.log("=== DÉMARRAGE SERVEUR ===");

const express = require("express");
const app = express();
const PORT = 3000;

console.log("✅ Express chargé");

app.get("/", (req, res) => {
    console.log("📍 Requête reçue sur /");
    res.json({ 
        message: "✅ SERVEUR HOTEL FONCTIONNE!", 
        status: "online",
        time: new Date().toISOString()
    });
});

app.get("/api/health", (req, res) => {
    console.log("📍 Requête reçue sur /api/health");
    res.json({ 
        status: "OK", 
        message: "🏨 API Hotel en ligne",
        version: "1.0.0"
    });
});

app.listen(PORT, () => {
    console.log("🚀 =================================");
    console.log("🏨  SERVEUR HOTEL DÉMARRÉ");
    console.log("🚀 =================================");
    console.log("📍 Port: " + PORT);
    console.log("🌐 URL: http://localhost:" + PORT);
    console.log("📊 Health: http://localhost:" + PORT + "/api/health");
    console.log("🚀 =================================");
});