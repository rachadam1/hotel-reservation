import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User, Hotel } from 'lucide-react';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();

  const getUserInitial = () => {
    return user?.prenom?.[0]?.toUpperCase() || 'U';
  };

  const getRoleBadge = () => {
    const roles = {
      client: '👤 Client',
      reception: '🏪 Réception',
      menage: '🧹 Ménage',
      admin: '⚙️ Admin'
    };
    return roles[user?.role] || 'Utilisateur';
  };

  return (
    <header className="header">
      <div className="header-brand">
        <Hotel size={32} />
        <h1>Système Hôtelier Multi-Hôtels</h1>
      </div>
      
      {isAuthenticated && (
        <div className="header-user">
          <div className="user-info">
            <span className="user-role">{getRoleBadge()}</span>
            <span className="user-name">
              {user.prenom} {user.nom}
            </span>
          </div>
          
          <div className="user-avatar">
            <div className="avatar-circle">
              {getUserInitial()}
            </div>
          </div>
          
          <button 
            className="logout-btn"
            onClick={logout}
            title="Déconnexion"
          >
            <LogOut size={20} />
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;