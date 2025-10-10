import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/common/Header';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoadingSpinner from './components/common/LoadingSpinner';
import DashboardReception from './pages/reception/DashboardReception';
import DashboardAdmin from './pages/admin/DashboardAdmin'

// Pages d'authentification
import Login from './pages/Login';
import Register from './pages/Register';

// Pages client
import Home from './pages/client/Home';
import HotelsList from './pages/client/HotelsList';
import HotelDetail from './pages/client/HotelDetail';

// Styles
import './styles/globals.css';
import './styles/auth.css';
import './styles/client.css';

const AppContent = () => {
  const { loading, isAuthenticated, user } = useAuth();

  if (loading) {
    return <LoadingSpinner text="Initialisation du système..." />;
  }

  return (
    <div className="app">
      <Header />
      
      <main className="main-content">
        <Routes>
          {/* Routes publiques */}
          <Route 
            path="/login" 
            element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/register" 
            element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} 
          />

          {/* Routes client */}
          <Route path="/" element={<Home />} />
          <Route path="/hotels" element={<HotelsList />} />
          <Route path="/hotels/:id" element={<HotelDetail />} />
          <Route 
  path="/reception/dashboard" 
  element={
    <ProtectedRoute requiredRole="reception">
      <DashboardReception />
    </ProtectedRoute>
  } 
/>

<Route 
  path="/admin/dashboard" 
  element={
    <ProtectedRoute requiredRole="admin">
      <DashboardAdmin />
    </ProtectedRoute>
  } 
/>

          {/* Route de démonstration dashboard */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <div className="dashboard-placeholder">
                  <h2>Tableau de Bord</h2>
                  <p>Bienvenue {user?.prenom} !</p>
                  <p>Rôle: {user?.role}</p>
                  <p>Cette partie sera développée selon votre rôle</p>
                </div>
              </ProtectedRoute>
            } 
          />

          {/* Route par défaut */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};


export default App;