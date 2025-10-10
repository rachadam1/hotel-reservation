import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, MapPin, Wifi } from 'lucide-react';

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Bienvenue dans nos hôtels d'exception</h1>
          <p>
            Découvrez un confort unique et un service personnalisé 
            dans nos établissements soigneusement sélectionnés
          </p>
          <Link to="/hotels" className="btn btn-primary hero-btn">
            Voir nos services
            <ArrowRight size={20} />
          </Link>
        </div>
        <div className="hero-image">
          <div className="placeholder-image">
            🏨 Image d'arrière-plan hôtel de luxe
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2>Pourquoi choisir nos hôtels ?</h2>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <Star size={32} />
            </div>
            <h3>Qualité Exceptionnelle</h3>
            <p>
              Des établissements notés 4★ et plus, 
              pour un séjour mémorable
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <MapPin size={32} />
            </div>
            <h3>Emplacements Privilégiés</h3>
            <p>
              Situés au cœur des plus belles villes, 
              proches des attractions principales
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Wifi size={32} />
            </div>
            <h3>Confort Moderne</h3>
            <p>
              Wi-Fi gratuit, équipements haut de gamme 
              et services sur mesure
            </p>
          </div>
        </div>
      </section>

      {/* Room Types Preview */}
      <section className="rooms-preview">
        <div className="section-header">
          <h2>Nos types de chambres</h2>
          <p>Un hébergement adapté à chaque besoin</p>
        </div>

        <div className="rooms-grid">
          <div className="room-preview-card">
            <h4>Appartement Standard</h4>
            <p>57m² • 3 personnes • Très grand lit</p>
            <div className="room-price">À partir de 78 700 FCFA/nuit</div>
          </div>

          <div className="room-preview-card">
            <h4>Suite Junior</h4>
            <p>60m² • 3 personnes • Très grand lit</p>
            <div className="room-price">À partir de 118 100 FCFA/nuit</div>
          </div>

          <div className="room-preview-card">
            <h4>Suite Exécutive</h4>
            <p>80m² • 3 personnes • Très grand lit</p>
            <div className="room-price">À partir de 150 000 FCFA/nuit</div>
          </div>

          <div className="room-preview-card">
            <h4>Suite Présidentielle</h4>
            <p>160m² • 4 personnes • 2 chambres</p>
            <div className="room-price">À partir de 250 000 FCFA/nuit</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Prêt pour un séjour inoubliable ?</h2>
          <p>Réservez dès maintenant votre chambre</p>
          <Link to="/hotels" className="btn btn-primary cta-btn">
            Découvrir nos hôtels
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;