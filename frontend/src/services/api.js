import axios from 'axios';
const api = axios.create({
  baseURL: 'https://rectify-tapeless-setup.ngrok-free.dev/api',
  maxRedirects: 0
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (config.method === 'post' && !config.url.endsWith('/')) {
    config.url = config.url + '/';
  }
  return config;
});
export const authService = {
  login: (data) => api.post('/auth/login', data),
  registro: (data) => api.post('/auth/registro', data),
};
export const solicitudService = {
  crear: (data) => api.post('/solicitudes/', data),
  misSolicitudes: () => api.get('/solicitudes/mis-solicitudes'),
  todas: (estado) => api.get('/solicitudes/', { params: estado ? { estado } : {} }),
  obtener: (id) => api.get(`/solicitudes/${id}`),
  aprobar: (id) => api.patch(`/solicitudes/${id}/aprobar`),
  rechazar: (id) => api.patch(`/solicitudes/${id}/rechazar`),
  revision: (id) => api.patch(`/solicitudes/${id}/revision`),
};
export default api;
