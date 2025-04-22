import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Adjust the URL based on your server's address
});

export const getChemicals = () => api.get('/chemicals');
export const addChemical = (data) => api.post('/chemicals', data);
export const updateChemical = (id, data) => api.put(`/chemicals/${id}`, data);
export const deleteChemical = (id) => api.delete(`/chemicals/${id}`);

export const getSales = () => api.get('/sales');
export const addSale = (data) => api.post('/sales', data);

export const getPurchases = () => api.get('/purchases');
export const addPurchase = (data) => api.post('/purchases', data);

export const getSafetyInfo = () => api.get('/safety');
export const addSafetyInfo = (data) => api.post('/safety', data);

export const getSummaryReport = () => api.get('/reports/summary');
export const getDetailedReport = () => api.get('/reports/detailed');
