import api from "./api";

const aiService = {
  // Récupérer les prédictions IA pour un match
  getMatchPredictions: async (matchId) => {
    const response = await api.get(`/ai/predictions/${matchId}`);
    return response.data;
  },

  // Générer une nouvelle prédiction IA pour un match
  generatePrediction: async (matchId) => {
    const response = await api.post(`/ai/predict/${matchId}`);
    return response.data;
  },

  // Récupérer tous les modèles d'IA (admin uniquement)
  getModels: async () => {
    const response = await api.get("/ai/models");
    return response.data;
  },

  // Activer/désactiver un modèle (admin uniquement)
  toggleModelStatus: async (modelId, active) => {
    const response = await api.patch(`/ai/models/${modelId}`, { active });
    return response.data;
  },

  // Entraîner un nouveau modèle (admin uniquement)
  trainModel: async (modelType) => {
    const response = await api.post("/ai/train", { modelType });
    return response.data;
  },

  // Récupérer des données historiques (admin uniquement)
  fetchHistoricalData: async () => {
    const response = await api.post("/ai/historical-data");
    return response.data;
  },
};

export default aiService;
