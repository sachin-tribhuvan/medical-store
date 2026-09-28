import axios from 'axios';

// Resolution order: runtime config.js (containers) -> VITE_API_URL (dev/build) -> same-origin /api
const baseURL =
  (window.__APP_CONFIG__ && window.__APP_CONFIG__.API_URL) || import.meta.env.VITE_API_URL || '/api';

const http = axios.create({ baseURL, timeout: 10000 });

http.interceptors.response.use(
  (r) => r,
  (err) => {
    err.friendlyMessage = err.response
      ? err.response.data?.message || 'Request failed'
      : 'Cannot reach the server. Check your connection and the API URL configuration.';
    err.fieldErrors = err.response?.data?.errors || [];
    return Promise.reject(err);
  }
);

const unwrap = (p) => p.then((r) => r.data.data);

export const api = {
  baseURL,
  getStats: () => unwrap(http.get('/medicines/stats')),
  listMedicines: (params) => unwrap(http.get('/medicines', { params })),
  getMedicine: (id) => unwrap(http.get(`/medicines/${id}`)),
  createMedicine: (body) => unwrap(http.post('/medicines', body)),
  updateMedicine: (id, body) => unwrap(http.put(`/medicines/${id}`, body)),
  deleteMedicine: (id) => http.delete(`/medicines/${id}`).then((r) => r.data),
};
