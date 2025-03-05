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
};

export default predictionService;
