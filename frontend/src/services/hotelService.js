import { api } from './api';

export const hotelService = {
  getAllHotels: () => api.get('/hotels'),
  
  getHotelById: (id) => api.get(`/hotels/${id}`),
  
  getAvailableRooms: (hotelId, filters = {}) => 
    api.get(`/hotels/${hotelId}/chambres-disponibles`, { params: filters }),
    
  getHotelStats: (hotelId) => 
    api.get(`/tableau-de-bord/statistiques/${hotelId}`)
};