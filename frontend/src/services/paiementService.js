import { api } from './api';

export const paiementService = {
  processOnlinePayment: (reservationId) => 
    api.post('/paiements/paiement-en-ligne', { reservation_id: reservationId }),
    
  processOnSitePayment: (reservationId) => 
    api.post('/paiements/paiement-sur-place', { reservation_id: reservationId }),
    
  generateInvoice: (reservationId) => 
    api.post(`/paiements/facture/${reservationId}`)
};