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
};

export default matchService;
