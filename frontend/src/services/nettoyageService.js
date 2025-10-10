import { api } from './api';

export const nettoyageService = {
  createCleaningTask: (taskData) => 
    api.post('/nettoyage/taches', taskData),
    
  getCleaningTasks: (filters = {}) => 
    api.get('/nettoyage/taches', { params: filters }),
    
  updateTaskStatus: (taskId, statusData) => 
    api.patch(`/nettoyage/taches/${taskId}/statut`, statusData),
    
  validateTask: (taskId) => 
    api.patch(`/nettoyage/taches/${taskId}/valider`)
};