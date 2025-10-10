import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Phone, Mail } from 'lucide-react';
import { hotelService } from '../../services/hotelService';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const HotelsList = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadHotels();
  }, []);

  const loadHotels = async () => {
    try {
      const response = await hotelService.getAllHotels();
      setHotels(response.data.hotels);
    } catch (err) {
      setError('Erreur lors du chargement des hôtels');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        fill={index < Math.floor(rating) ? '#fbbf24' : 'none'}
        color="#fbbf24"
      />
    ));
  };

  if (loading) {
    return <LoadingSpinner text="Chargement des hôtels..." />;
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
        <button onClick={loadHotels} className="btn btn-primary">
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="hotels-list-page">
      <div className="page-header">
        <h1>Nos Hôtels</h1>
        <p>Découvrez nos établissements soigneusement sélectionnés</p>
      </div>

      <div className="hotels-grid">
        {hotels.map((hotel) => (
          <div key={hotel.id} className="hotel-card">
            <div className="hotel-image">
              <div className="placeholder-image">
                🏨 Photo de {hotel.nom}
              </div>
              <div className="hotel-rating">
                {renderStars(hotel.note)}
                <span>({hotel.note})</span>
              </div>
            </div>

            <div className="hotel-content">
              <h3 className="hotel-name">{hotel.nom}</h3>
              
              <div className="hotel-location">
                <MapPin size={16} />
                <span>{hotel.ville} • {hotel.adresse}</span>
              </div>

              {hotel.telephone && (
                <div className="hotel-contact">
                  <Phone size={16} />
                  <span>{hotel.telephone}</span>
                </div>
              )}

              {hotel.email && (
                <div className="hotel-contact">
                  <Mail size={16} />
                  <span>{hotel.email}</span>
                </div>
              )}

              {hotel.description && (
                <p className="hotel-description">
                  {hotel.description.length > 120 
                    ? `${hotel.description.substring(0, 120)}...` 
                    : hotel.description
                  }
                </p>
              )}

              <div className="hotel-stats">
                <div className="stat">
                  <strong>{hotel.Chambres?.length || 0}</strong>
                  <span>Chambres</span>
                </div>
                <div className="stat">
                  <strong>
                    {hotel.Chambres?.filter(c => c.statut === 'libre').length || 0}
                  </strong>
                  <span>Disponibles</span>
                </div>
              </div>

              <div className="hotel-actions">
                <Link 
                  to={`/hotels/${hotel.id}`} 
                  className="btn btn-primary"
                >
                  Voir les chambres
                </Link>
                <Link 
                  to={`/hotels/${hotel.id}/reserver`} 
                  className="btn btn-secondary"
                >
                  Réserver
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {hotels.length === 0 && (
        <div className="empty-state">
          <h3>Aucun hôtel disponible</h3>
          <p>Les hôtels apparaîtront bientôt dans notre catalogue</p>
        </div>
      )}
    </div>
  );
};

export default HotelsList;