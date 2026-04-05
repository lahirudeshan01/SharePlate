import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const donationAPI = {
  getAvailable: () => api.get('/donations/available'),
  getById: (id) => api.get(`/donations/${id}`),
  create: (data) => api.post('/donations', data),
  getMyDonations: () => api.get('/donations/my-donations'),
};

export const requestAPI = {
  createRequest: (data) => api.post('/requests', data),
  getMyRequests: () => api.get('/requests/my-requests'),
  getDonationRequests: (donationId) => api.get(`/requests/donation/${donationId}`),
  getDonorRequests: () => api.get('/requests/my-donations'),
  approveRequest: (requestId) => api.put(`/requests/${requestId}/approve`),
  rejectRequest: (requestId) => api.put(`/requests/${requestId}/reject`),
  updateRequest: (requestId, data) => api.put(`/requests/${requestId}`, data),
  deleteRequest: (requestId) => api.delete(`/requests/${requestId}`),
};

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  signup: (data) => api.post('/auth/signup', data),
  getCurrentUser: () => api.get('/auth/profile'),
};

export default api;
