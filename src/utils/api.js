import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://austria-zs72.onrender.com/api",
  withCredentials: true,
});

// Auto-attach JWT token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ─── Auth ───────────────────────────────────────────
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const logoutUser = () => API.post('/auth/logout');
export const getMe = () => API.get('/auth/me');
export const updateProfile = (data) => API.put('/auth/profile', data);

// ─── Announcements ──────────────────────────────────
export const getAnnouncements = (params) => API.get('/announcements', { params });
export const createAnnouncement = (data) => API.post('/announcements', data, {
  headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {}
});
export const deleteAnnouncement = (id) => API.delete(`/announcements/${id}`);

// ─── Enquiries ──────────────────────────────────────
export const submitEnquiry = (data) => API.post('/enquiries', data);
export const getMyEnquiries = () => API.get('/enquiries/mine');
export const getAllEnquiries = (params) => API.get('/enquiries', { params });
export const respondToEnquiry = (id, data) => API.put(`/enquiries/${id}/respond`, data);

// ─── Gallery ────────────────────────────────────────
export const getPhotos = (params) => API.get('/gallery', { params });
export const uploadPhoto = (data) => API.post('/gallery', data, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const likePhoto = (id) => API.post(`/gallery/${id}/like`);
export const addComment = (id, data) => API.post(`/gallery/${id}/comments`, data);
export const deletePhoto = (id) => API.delete(`/gallery/${id}`);

// ─── Admin ──────────────────────────────────────────
export const getAdminStats = () => API.get('/admin/stats');
export const getAllUsers = () => API.get('/admin/users');
export const deleteUser = (id) => API.delete(`/admin/users/${id}`);

// ─── Chat ────────────────────────────────────────────
export const getChatHistory = () => API.get('/chat/history');

export default API;
