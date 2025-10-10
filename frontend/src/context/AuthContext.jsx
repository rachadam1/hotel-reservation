import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulation de chargement
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const login = async (email, password) => {
    try {
      // Simulation de connexion
      const userData = {
        id: 1,
        nom: 'Dupont',
        prenom: 'Jean',
        email: email,
        telephone: '+33 6 12 34 56 78',
        role: email.includes('reception') ? 'reception' : 'client'
      };
      
      setUser(userData);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: 'Erreur de connexion' 
      };
    }
  };

  const register = async (userData) => {
    try {
      // Simulation d'inscription
      const newUser = {
        ...userData,
        id: Date.now(),
        role: 'client'
      };
      setUser(newUser);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: 'Erreur d\'inscription' 
      };
    }
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
    isReception: user?.role === 'reception',
    isAdmin: user?.role === 'admin',
    isMenage: user?.role === 'menage'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};