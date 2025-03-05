import axios from "axios";

// Création d'une instance axios avec une configuration de base
const api = axios.create({
  baseURL: "http://localhost:5000/api", // URL de votre API backend
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur pour ajouter le token à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs d'authentification
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_info");
      window.dispatchEvent(new Event("auth-change"));

      // Rediriger vers la page de connexion si nécessaire
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
