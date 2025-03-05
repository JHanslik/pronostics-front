import api from "./api";

const matchService = {
  getMatches: async () => {
    const response = await api.get("/matches");
    return response.data;
  },

  getMatchById: async (id) => {
    const response = await api.get(`/matches/${id}`);
    return response.data;
  },

  getFinishedMatches: async () => {
    const response = await api.get("/matches/finished");
    return response.data;
  },

  getFinishedMatchesToProcess: async () => {
    const response = await api.get("/matches/finished/to-process");
    return response.data;
  },

  getProcessedMatches: async () => {
    const response = await api.get("/matches/processed");
    return response.data;
  },

  updateMatchResult: async (matchId, resultData) => {
    const response = await api.put(`/matches/${matchId}/result`, resultData);
    return response.data;
  },

  markMatchAsProcessed: async (matchId) => {
    const response = await api.put(`/matches/${matchId}/mark-processed`, {});
    return response.data;
  },

  syncMatches: async () => {
    const response = await api.get("/matches/sync");
    return response.data;
  },
};

export default matchService;
