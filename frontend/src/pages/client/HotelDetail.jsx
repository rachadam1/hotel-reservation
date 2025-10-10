import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Wifi, Car, Coffee, Heart } from 'lucide-react';
import { hotelService } from '../../services/hotelService';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const HotelDetail = () => {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    loadHotel();
  }, [id]);

  const loadHotel = async () => {
    try {
      const response = await hotelService.getHotelById(id);
      setHotel(response.data.hotel);
    } catch (err) {
      setError('Hôtel non trouvé');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={20}
        fill={index < Math.floor(rating) ? '#fbbf24' : 'none'}
        color="#fbbf24"
      />
    ));
  };

  const getRoomTypeLabel = (type) => {
    const types = {
      standard: 'Appartement Standard',
      junior: 'Suite Junior',
      executive: 'Suite Exécutive',
      presidentielle: 'Suite Présidentielle'
    };
    return types[type] || type;
  };

  if (loading) {
    return <LoadingSpinner text="Chargement de l'hôtel..." />;
  }

  if (error || !hotel) {
    return (
      <div className="error-container">
        <div className="error-message">{error || 'Hôtel non trouvé'}</div>
        <Link to="/hotels" className="btn btn-primary">
          Retour à la liste
        </Link>
      </div>
    );
  }

  // Images simulées (en attendant les vraies photos)
  const hotelImages = [
    '🏨 Photo principale',
    '🛏️ Chambre luxueuse',
    '🍽️ Restaurant',
    '🏊 Piscine',
    '💆 Spa'
  ];

  return (
    <div className="hotel-detail-page">
      {/* Carrousel d'images */}
      <div className="hotel-gallery">
        <div className="main-image">
          <div className="image-placeholder large">
            {hotelImages[selectedImage]}
          </div>
        </div>
        <div className="image-thumbnails">
          {hotelImages.map((image, index) => (
            <button
              key={index}
              className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
              onClick={() => setSelectedImage(index)}
            >
              <div className="image-placeholder small">
                {image}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Informations principales */}
      <div className="hotel-header">
        <div className="hotel-info">
          <h1>{hotel.nom}</h1>
          <div className="hotel-meta">
            <div className="rating">
              {renderStars(hotel.note)}
              <span className="rating-text">({hotel.note}/5)</span>
            </div>
            <div className="location">
              <MapPin size={18} />
              <span>{hotel.ville} - {hotel.adresse}</span>
            </div>
          </div>
        </div>
        
        <div className="hotel-actions">
          <Link 
            to={`/hotels/${hotel.id}/reserver`}
            className="btn btn-primary large"
          >
            Réserver maintenant
          </Link>
          <button className="btn btn-secondary">
            <Heart size={20} />
            Favoris
          </button>
        </div>
      </div>

      <div className="hotel-content">
        {/* Section À propos */}
        <section className="about-section">
          <h2>À propos de cet hôtel</h2>
          <p>{hotel.description || "Un établissement d'exception offrant un service personnalisé et des équipements de qualité supérieure."}</p>
          
          <div className="hotel-features">
            <div className="feature">
              <Wifi size={24} />
              <span>Wi-Fi gratuit</span>
            </div>
            <div className="feature">
              <Car size={24} />
              <span>Parking</span>
            </div>
            <div className="feature">
              <Coffee size={24} />
              <span>Petit-déjeuner</span>
            </div>
          </div>
        </section>

        {/* Section Chambres */}
        <section className="rooms-section">
          <h2>Nos chambres</h2>
          <div className="rooms-grid">
            {hotel.Chambres && hotel.Chambres.map((chambre) => (
              <div key={chambre.id} className="room-card">
                <div className="room-image">
                  <div className="image-placeholder medium">
                    🛏️ {getRoomTypeLabel(chambre.type_chambre)}
                  </div>
                </div>
                
                <div className="room-info">
                  <h3>{getRoomTypeLabel(chambre.type_chambre)}</h3>
                  <p>Chambre {chambre.numero} • {chambre.superficie}m² • {chambre.capacite} pers.</p>
                  
                  <div className="room-features">
                    <span>Wi-Fi gratuit</span>
                    <span>Climatisation</span>
                    <span>TV écran plat</span>
                  </div>

                  <div className="room-price">
                    <div className="price">{chambre.prix_nuit.toLocaleString()} FCFA</div>
                    <div className="price-label">par nuit</div>
                  </div>

                  <div className="room-status">
                    <span className={`status-badge ${
                      chambre.statut === 'libre' ? 'status-success' : 'status-error'
                    }`}>
                      {chambre.statut === 'libre' ? '✅ Disponible' : '❌ Occupée'}
                    </span>
                  </div>

                  <Link 
                    to={`/hotels/${hotel.id}/reserver?chambre=${chambre.id}`}
                    className="btn btn-primary"
                    disabled={chambre.statut !== 'libre'}
                  >
                    {chambre.statut === 'libre' ? 'Réserver' : 'Indisponible'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Carte de localisation */}
        <section className="location-section">
          <h2>Localisation</h2>
          <div className="map-container">
            <div className="map-placeholder">
              🗺️ Carte interactive - {hotel.adresse}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HotelDetail;