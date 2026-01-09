import axios from 'axios';

const api = axios.create({
  // baseURL: "http://127.0.0.1:8000/api",
  baseURL: "https://digiplus-grh-production.up.railway.app/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Ajout automatique du token dans les requêtes
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur pour gérer les erreurs d'authentification
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token invalide ou expiré
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

export default api;