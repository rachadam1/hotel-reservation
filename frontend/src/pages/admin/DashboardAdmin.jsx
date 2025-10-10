import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, DollarSign, Building } from 'lucide-react';
import { adminService } from '../../services/adminService';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const DashboardAdmin = () => {
  const [globalData, setGlobalData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGlobalData();
  }, []);

  const loadGlobalData = async () => {
    try {
      const response = await adminService.getGlobalDashboard();
      setGlobalData(response.data);
    } catch (error) {
      console.error('Erreur chargement données globales:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Chargement du tableau de bord admin..." />;
  }

  const globalStats = globalData?.statistiquesGlobales;
  const hotels = globalData?.hotels;

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Tableau de Bord Administration</h1>
        <p>Vue d'ensemble multi-hôtels</p>
      </div>

      {/* Statistiques globales */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Building size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{globalStats?.totalHotels || 0}</div>
            <div className="stat-label">Hôtels</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{globalStats?.totalChambres || 0}</div>
            <div className="stat-label">Chambres total</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">
              {Math.round((globalStats?.chambresOccupees / globalStats?.totalChambres) * 100) || 0}%
            </div>
            <div className="stat-label">Taux occupation</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <DollarSign size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">
              {(globalStats?.chiffreAffairesMois / 1000000).toFixed(1)}M
            </div>
            <div className="stat-label">CA du mois (FCFA)</div>
          </div>
        </div>
      </div>

      {/* Performance par hôtel */}
      <div className="card">
        <div className="card-header">
          <h2>Performance par Hôtel</h2>
        </div>
        <div className="hotels-performance">
          {hotels?.map((hotel) => (
            <div key={hotel.id} className="hotel-performance-card">
              <div className="hotel-header">
                <h3>{hotel.nom}</h3>
                <span className="hotel-city">{hotel.ville}</span>
              </div>
              
              <div className="performance-stats">
                <div className="performance-stat">
                  <span>Chambres:</span>
                  <span>{hotel.statistiques.totalChambres}</span>
                </div>
                <div className="performance-stat">
                  <span>Occupées:</span>
                  <span>{hotel.statistiques.chambresOccupees}</span>
                </div>
                <div className="performance-stat">
                  <span>Taux occupation:</span>
                  <span className={`status-${
                    hotel.statistiques.tauxOccupation > 80 ? 'success' : 
                    hotel.statistiques.tauxOccupation > 60 ? 'warning' : 'error'
                  }`}>
                    {hotel.statistiques.tauxOccupation}%
                  </span>
                </div>
                <div className="performance-stat">
                  <span>CA mois:</span>
                  <span className="revenue">
                    {hotel.statistiques.chiffreAffairesMois.toLocaleString()} FCFA
                  </span>
                </div>
              </div>

              <div className="hotel-actions">
                <button className="btn btn-secondary small">
                  Détails
                </button>
                <button className="btn btn-primary small">
                  Analyser
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vue analytique simplifiée */}
      <div className="grid grid-2">
        <div className="card">
          <div className="card-header">
            <h3>📈 Réservations par type</h3>
          </div>
          <div className="analytics-placeholder">
            <p>Graphique: Réservations classiques vs horaires</p>
            <div className="chart-placeholder">
              📊 Graphique de comparaison des revenus
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>🎯 Performance par type de chambre</h3>
          </div>
          <div className="analytics-placeholder">
            <p>Répartition des revenus par catégorie</p>
            <div className="chart-placeholder">
              📈 Graphique de performance
            </div>
          </div>
        </div>
      </div>

      {/* Alertes et actions */}
      <div className="card">
        <div className="card-header">
          <h3>🚨 Alertes et Actions</h3>
        </div>
        <div className="alerts-list">
          <div className="alert-item warning">
            <div className="alert-content">
              <strong>Hôtel Business Center</strong>
              <span>Taux d'occupation à 85% - Surveiller la capacité</span>
            </div>
            <button className="btn btn-warning small">
              Vérifier
            </button>
          </div>
          
          <div className="alert-item info">
            <div className="alert-content">
              <strong>Chambre joker</strong>
              <span>Chambre 999 disponible dans tous les hôtels</span>
            </div>
          </div>

          <div className="alert-item success">
            <div className="alert-content">
              <strong>Sécurité</strong>
              <span>Tous les systèmes anti-sur-réservation actifs</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;