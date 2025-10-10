const Reservation = require('../models/Reservation');
const Client = require('../models/Client');
const Chambre = require('../models/Chambre');
const Hotel = require('../models/Hotel');

// Simulation d'envoi d'email (à remplacer par un vrai service comme SendGrid)
const emailController = {
    envoyerEmailConfirmation: async (reservation_id, typePaiement) => {
        try {
            const reservation = await Reservation.findByPk(reservation_id, {
                include: [
                    { model: Client },
                    { model: Chambre, include: [Hotel] }
                ]
            });

            if (!reservation) {
                throw new Error('Réservation non trouvée');
            }

            const { Client: client, Chambre: chambre, Hotel: hotel } = reservation;

            let emailTemplate = '';
            
            if (typePaiement === 'en_ligne') {
                emailTemplate = emailController.templatePaiementEnLigne(reservation, client, chambre, hotel);
            } else {
                emailTemplate = emailController.templatePaiementSurPlace(reservation, client, chambre, hotel);
            }

            // Simulation d'envoi d'email
            console.log('=== EMAIL ENVOYÉ ===');
            console.log(`À: ${client.email}`);
            console.log(`Sujet: Confirmation de réservation ${reservation.numero_reservation}`);
            console.log('Corps:', emailTemplate);
            console.log('====================');

            return true;

        } catch (error) {
            console.error('Erreur envoi email:', error);
            return false;
        }
    },

    templatePaiementEnLigne: (reservation, client, chambre, hotel) => {
        return `
🌴 CONFIRMATION DE RÉSERVATION 🌴

Bonjour ${client.prenom} ${client.nom},

Votre réservation a été confirmée !

📋 DÉTAILS DE LA RÉSERVATION
• Numéro: ${reservation.numero_reservation}
• Hôtel: ${hotel.nom}
• Chambre: ${chambre.numero} (${chambre.type_chambre})
• Dates: ${reservation.date_arrivee ? reservation.date_arrivee.toLocaleDateString() : reservation.heure_debut.toLocaleString()}

💶 DÉTAILS FINANCIERS
• Prix total: ${reservation.montant_total.toLocaleString()} FCFA
• Statut: ✅ PAYÉ INTÉGRALEMENT EN LIGNE
• Montant à régler: 0 FCFA

📍 INFORMATIONS PRATIQUES
Adresse: ${hotel.adresse}
Téléphone: ${hotel.telephone}

Merci pour votre confiance !

L'équipe ${hotel.nom}
        `.trim();
    },

    templatePaiementSurPlace: (reservation, client, chambre, hotel) => {
        const acompte = reservation.montant_total * 0.3;
        
        return `
🌴 CONFIRMATION DE RÉSERVATION 🌴

Bonjour ${client.prenom} ${client.nom},

Votre réservation a été confirmée !

📋 DÉTAILS DE LA RÉSERVATION
• Numéro: ${reservation.numero_reservation}
• Hôtel: ${hotel.nom}
• Chambre: ${chambre.numero} (${chambre.type_chambre})
• Dates: ${reservation.date_arrivee ? reservation.date_arrivee.toLocaleDateString() : reservation.heure_debut.toLocaleString()}

💶 DÉTAILS FINANCIERS
• Prix total: ${reservation.montant_total.toLocaleString()} FCFA
• Statut: 📍 À RÉGLER SUR PLACE
• Acompte requis: ${acompte.toLocaleString()} FCFA (30%)
• Montant à régler: ${reservation.montant_total.toLocaleString()} FCFA

📍 INSTRUCTIONS PAIEMENT:
À votre arrivée, veuillez vous présenter à la réception
avec cet email et une pièce d'identité pour finaliser
le paiement.

📞 CONTACT
Adresse: ${hotel.adresse}
Téléphone: ${hotel.telephone}

Merci pour votre confiance !

L'équipe ${hotel.nom}
        `.trim();
    },

    envoyerRappel: async (reservation_id) => {
        try {
            const reservation = await Reservation.findByPk(reservation_id, {
                include: [
                    { model: Client },
                    { model: Chambre, include: [Hotel] }
                ]
            });

            if (!reservation) return false;

            const template = `
🔔 RAPPEL DE RÉSERVATION

Bonjour ${reservation.Client.prenom},

Petit rappel pour votre séjour à l'hôtel ${reservation.Chambre.Hotel.nom} 
prévu le ${reservation.date_arrivee ? reservation.date_arrivee.toLocaleDateString() : reservation.heure_debut.toLocaleString()}.

Nous avons hâte de vous accueillir !

L'équipe ${reservation.Chambre.Hotel.nom}
            `.trim();

            console.log('=== RAPPEL EMAIL ===');
            console.log(`À: ${reservation.Client.email}`);
            console.log('Corps:', template);
            console.log('====================');

            return true;

        } catch (error) {
            console.error('Erreur rappel email:', error);
            return false;
        }
    }
};

module.exports = emailController;