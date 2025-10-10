import { api } from './api';

export const reservationService = {
  createReservation: (reservationData) => 
    api.post('/reservations', reservationData),
    
  getMyReservations: () => 
    api.get('/reservations/mes-reservations'),
    
  cancelReservation: (id) => 
    api.patch(`/reservations/${id}/annuler`),
    
  checkAvailability: (availabilityData) => 
    api.post('/anti-surcharge/verifier-disponibilite', availabilityData),
    
  getSecurityStatus: (hotelId) => 
    api.get(`/anti-surcharge/statut-securite/${hotelId}`)
};