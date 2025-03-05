import api from "./api";

const TOKEN_KEY = "auth_token";
const USER_KEY = "user_info";

const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, ...user } = response.data;

      // Enregistrer le token et les informations utilisateur
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));

      // Configurer le token pour les futures requêtes API
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Déclencher l'événement de changement d'authentification
      window.dispatchEvent(new Event("auth-change"));

      return user;
    } catch (error) {
      console.error("Erreur de connexion:", error);
      throw error;
    }
  },

  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    // Supprimer le token des en-têtes API
    delete api.defaults.headers.common["Authorization"];

    // Déclencher l'événement de changement d'authentification
    window.dispatchEvent(new Event("auth-change"));
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem(USER_KEY);
    // Vérifier si userStr existe avant de le parser
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error("Erreur lors du parsing des données utilisateur:", error);
      // En cas d'erreur de parsing, supprimer les données corrompues
      localStorage.removeItem(USER_KEY);
      return null;
    }
  },

  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  isAuthenticated: () => {
    return !!localStorage.getItem(TOKEN_KEY);
  },

  // Méthode pour configurer le token lors du chargement initial de l'application
  setupTokenInterceptor: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  },

  updateUserInfo: async () => {
    try {
      // Récupérer les informations utilisateur à jour depuis le serveur
      const response = await api.get("/auth/profile");
      const updatedUser = response.data;

      // Mettre à jour les informations dans le localStorage
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));

      // Déclencher l'événement de changement d'authentification
      window.dispatchEvent(new Event("auth-change"));

      return updatedUser;
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour des informations utilisateur:",
        error
      );
      throw error;
    }
  },
};

export default authService;
