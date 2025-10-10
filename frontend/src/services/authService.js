import { api } from './api';

export const authService = {
  login: (email, password) => 
    api.post('/auth/login', { email, password }),

  register: (userData) => 
    api.post('/auth/register', userData),

  getProfile: (token) => 
    api.get('/auth/profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
};