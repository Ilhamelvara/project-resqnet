import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api', // Assumes backend runs on port 3000
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    // We only access localStorage on the client side
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
