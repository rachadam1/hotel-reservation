import { api } from './api';

export const adminService = {
  createHotel: (hotelData) => 
    api.post('/admin/hotels', hotelData),
    
  getGlobalDashboard: () => 
    api.get('/admin/tableau-bord-global'),
    
  getDetailedAnalytics: (hotelId) => 
    api.get(`/admin/analyses/${hotelId}`),
    
  getDailyDashboard: () => 
    api.get('/tableau-de-bord/jour')
};

