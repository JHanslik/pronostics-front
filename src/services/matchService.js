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

  updateMatchResult: async (matchId, resultData) => {
    const response = await api.put(`/matches/${matchId}/result`, resultData);
    return response.data;
  },
};

export default matchService;
