import api from "./api";

const userService = {
  getUserProfile: async () => {
    const response = await api.get("/auth/profile");
    return response.data;
  },

  updateUserProfile: async (userData) => {
    const response = await api.put("/auth/profile", userData);
    return response.data;
  },

  getLeaderboard: async () => {
    const response = await api.get("/users/leaderboard");
    return response.data;
  },
};

export default userService;
