import axios from "axios";
import { API_URL } from "../config";

const statsService = {
  // Récupérer les statistiques globales
  getGlobalStats: async () => {
    try {
      const response = await axios.get(`${API_URL}/stats`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques:", error);
      throw error;
    }
  },

  // Récupérer les statistiques des pronostics pour un match
  getMatchPronosticsStats: async (matchId) => {
    try {
      const response = await axios.get(
        `${API_URL}/pronostics/stats/${matchId}`
      );
      return response.data;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des statistiques du match:",
        error
      );
      throw error;
    }
  },
};

export default statsService;
