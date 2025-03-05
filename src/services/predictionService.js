import api from "./api";

const predictionService = {
  createPrediction: async (predictionData) => {
    const response = await api.post("/pronostics", predictionData);
    return response.data;
  },

  getUserPredictions: async () => {
    const response = await api.get("/pronostics");
    return response.data;
  },

  getMatchPredictions: async (matchId) => {
    const response = await api.get(`/pronostics/match/${matchId}`);
    return response.data;
  },

  processMatchPredictions: async (matchId) => {
    const response = await api.post("/pronostics/process", { matchId });
    return response.data;
  },

  getAIPrediction: async (matchId) => {
    try {
      console.log(`Récupération de la prédiction IA pour le match ${matchId}`);
      const response = await api.get(`/predictions/${matchId}`);

      // Vérifier que la réponse contient les données attendues
      if (!response.data || !response.data.prediction) {
        console.error("Réponse de l'API incomplète:", response.data);
        return {
          success: false,
          message: "Données de prédiction incomplètes",
        };
      }

      console.log("Prédiction IA récupérée avec succès");
      return response.data;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération de la prédiction IA:",
        error
      );

      // Gérer les différents types d'erreurs
      if (error.response) {
        // Le serveur a répondu avec un code d'erreur
        console.error("Réponse d'erreur du serveur:", error.response.data);
        return {
          success: false,
          message:
            error.response.data.message ||
            `Erreur ${error.response.status}: Impossible de récupérer la prédiction`,
        };
      } else if (error.request) {
        // La requête a été faite mais pas de réponse
        console.error("Pas de réponse du serveur");
        return {
          success: false,
          message: "Le serveur ne répond pas",
        };
      } else {
        // Erreur lors de la configuration de la requête
        return {
          success: false,
          message: "Erreur de connexion au serveur",
        };
      }
    }
  },
};

export default predictionService;
