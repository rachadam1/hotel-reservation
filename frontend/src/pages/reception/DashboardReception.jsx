import React, { useState, useEffect } from 'react';
import { Bell, Users, Calendar, Clock, AlertTriangle } from 'lucide-react';
import { adminService } from '../../services/adminService';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const DashboardReception = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await adminService.getDailyDashboard();
      setDashboardData(response.data.tableauDeBord);
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Chargement du tableau de bord..." />;
  }

  const stats = dashboardData?.statistiquesChambres;

  return (
    <div className="reception-dashboard">
      <div className="dashboard-header">
        <h1>Tableau de Bord Réception</h1>
        <div className="header-actions">
          <button className="btn btn-secondary">
            <Bell size={20} />
            Alertes
          </button>
        </div>
      </div>

      {/* Statistiques globales */}
      <div className="stats-grid">
        <div className="stat-card success">
          <div className="stat-icon">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats?.libres || 0}</div>
            <div className="stat-label">Chambres libres</div>
          </div>
        </div>

        <div className="stat-card error">
          <div className="stat-icon">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats?.occupees || 0}</div>
            <div className="stat-label">Chambres occupées</div>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats?.nettoyage || 0}</div>
            <div className="stat-label">En nettoyage</div>
          </div>
        </div>

        <div className="stat-card info">
          <div className="stat-icon">
            <Calendar size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats?.total || 0}</div>
            <div className="stat-label">Total chambres</div>
          </div>
        </div>
      </div>

      {/* Alertes de sécurité */}
      <div className="security-alert">
        <div className="alert-header">
          <AlertTriangle size={20} />
          <span>Vue Sécurité Simplifiée</span>
        </div>
        <div className="alert-content">
          <div className="security-stats">
            <div className="security-stat">
              <span>Occupation actuelle:</span>
              <span className="status-success">
                {dashboardData?.occupationPourcentage || 0}% 🟢
              </span>
            </div>
            <div className="security-stat">
              <span>Chambre joker:</span>
              <span className="status-success">🟢 LIBRE</span>
            </div>
            <div className="security-stat">
              <span>Prochaine alerte:</span>
              <span>90%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Arrivées et départs */}
      <div className="grid grid-2">
        <div className="card">
          <div className="card-header">
            <h3>🔵 Arrivées aujourd'hui ({dashboardData?.arriveesAujourdhui?.length || 0})</h3>
          </div>
          <div className="arrivals-list">
            {dashboardData?.arriveesAujourdhui?.map((arrival) => (
              <div key={arrival.id} className="arrival-item">
                <div className="arrival-info">
                  <strong>#{arrival.numero_reservation}</strong>
                  <span>{arrival.Client.prenom} {arrival.Client.nom}</span>
                  <span className="room-number">
                    {arrival.Chambre?.numero ? `Ch ${arrival.Chambre.numero}` : '[ASSIGNER]'}
                  </span>
                </div>
                <div className="arrival-status">
                  {arrival.Chambre ? '✅💰' : '❌'}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>🔴 Départs aujourd'hui ({dashboardData?.departsAujourdhui?.length || 0})</h3>
          </div>
          <div className="departures-list">
            {dashboardData?.departsAujourdhui?.map((departure) => (
              <div key={departure.id} className="departure-item">
                <div className="departure-info">
                  <strong>#{departure.numero_reservation}</strong>
                  <span>{departure.Client.prenom} {departure.Client.nom}</span>
                  <span className="room-number">Ch {departure.Chambre?.numero}</span>
                </div>
                <div className="departure-actions">
                  <button className="btn btn-success small">💰 Facture</button>
                  <button className="btn btn-warning small">➡️ Départ</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tâches de nettoyage */}
      <div className="card">
        <div className="card-header">
          <h3>🧹 État du nettoyage</h3>
        </div>
        <div className="cleaning-states">
          <div className="cleaning-state">
            <h4>🟢 Chambres prêtes ({dashboardData?.tachesNettoyage?.filter(t => t.statut === 'validee').length || 0})</h4>
            <div className="room-list">
              {dashboardData?.tachesNettoyage
                ?.filter(t => t.statut === 'validee')
                .map(task => (
                  <span key={task.id} className="room-badge">
                    Ch {task.Chambre?.numero}
                  </span>
                ))}
            </div>
          </div>

          <div className="cleaning-state">
            <h4>🟡 En attente de contrôle ({dashboardData?.tachesNettoyage?.filter(t => t.statut === 'termine').length || 0})</h4>
            <div className="room-list">
              {dashboardData?.tachesNettoyage
                ?.filter(t => t.statut === 'termine')
                .map(task => (
                  <span key={task.id} className="room-badge warning">
                    Ch {task.Chambre?.numero} 👁️
                  </span>
                ))}
            </div>
          </div>

          <div className="cleaning-state">
            <h4>🔴 À nettoyer ({dashboardData?.tachesNettoyage?.filter(t => t.statut === 'a_faire').length || 0})</h4>
            <div className="room-list">
              {dashboardData?.tachesNettoyage
                ?.filter(t => t.statut === 'a_faire')
                .map(task => (
                  <span key={task.id} className="room-badge error">
                    Ch {task.Chambre?.numero}
                  </span>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardReception;