import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Intercepteur pour ajouter le token d'authentification aux requêtes
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Client API pour l'authentification
export const authAPI = {
  register: async (email, password) => {
    const response = await apiClient.post('/auth/register', { email, password });
    return response.data;
  },
  
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },
  
  loginWithProvider: async (providerData) => {
    const response = await apiClient.post('/auth/provider', providerData);
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  }
};

// Client API pour les utilisateurs
export const userAPI = {
  getProfile: async (userId) => {
    const endpoint = userId ? `/users/profile/${userId}` : '/users/profile';
    const response = await apiClient.get(endpoint);
    return response.data;
  },
  
  updateProfile: async (profileData) => {
    const response = await apiClient.put('/users/profile', profileData);
    return response.data;
  },
  
  updateSubscription: async (subscriptionPlan) => {
    const response = await apiClient.put('/users/subscription', { subscriptionPlan });
    return response.data;
  },
  
  updateCredits: async (amount, operation = 'add') => {
    const response = await apiClient.put('/users/credits', { amount, operation });
    return response.data;
  }
};

// Client API pour les images
export const imageAPI = {
  saveImage: async (imageData) => {
    const response = await apiClient.post('/images', imageData);
    return response.data;
  },
  
  getUserImages: async (userId) => {
    const endpoint = userId ? `/images/user/${userId}` : '/images';
    const response = await apiClient.get(endpoint);
    return response.data;
  },
  
  getPublicImages: async (params = {}) => {
    const response = await apiClient.get('/images/public', { params });
    return response.data;
  },
  
  uploadBase64Image: async (imageData) => {
    const response = await apiClient.post('/images/upload', imageData);
    return response.data;
  },
  
  deleteImage: async (imageId) => {
    const response = await apiClient.delete(`/images/${imageId}`);
    return response.data;
  },
  
  updateImage: async (imageId, updateData) => {
    const response = await apiClient.put(`/images/${imageId}`, updateData);
    return response.data;
  }
};

export default apiClient; 