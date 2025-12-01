import api from './api';

export const getParts = () => api.get('/parts');
export const createPart = (data) => api.post('/parts', data);
export const updatePart = (id, data) => api.put(`/parts/${id}`, data);
export const deletePart = (id) => api.delete(`/parts/${id}`);
