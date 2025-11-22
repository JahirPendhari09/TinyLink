import axios from 'axios';

// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const API_BASE_URL = "https://tinylink-backend-tuoe.onrender.com";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const apiService = {
  baseURL: API_BASE_URL,

  // Get all links
  getLinks: async () => {
    const response = await api.get('/api/links');
    return response.data;
  },

  // Get single link stats
  getLink: async (code) => {
    const response = await api.get(`/api/links/${code}`);
    return response.data;
  },

  // Create new link
  createLink: async (data) => {
    const response = await api.post('/api/links', data);
    return response.data;
  },

  // Delete link
  deleteLink: async (code) => {
    const response = await api.delete(`/api/links/${code}`);
    return response.data;
  },

  // Health check
  getHealth: async () => {
    const response = await api.get('/healthz');
    return response.data;
  },
};

export default apiService;