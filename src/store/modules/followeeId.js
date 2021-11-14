import apiClient from "@/axios";

const state = {
  followeeId: [],
};

const getters = {
  followeeId: (state) => state.followeeId,
};

const mutations = {
  setFolloweeId(state, payload) {
    state.followeeId = payload;
  },
  addFolloweeId(state, payload) {
    state.followeeId.push(payload);
  },
  removeFolloweeId(state, payload) {
    state.followeeId = state.followeeId.filter((el) => el !== payload);
  },
};

const actions = {
  async getFolloweeId({ commit }, userId) {
    const { data } = await apiClient.get(
      "/users/follow/id/list/" + userId + "/"
    );
    commit(
      "setFolloweeId",
      data.map((item) => item.id)
    );
  },
  async createFolloweeId({ commit }, params) {
    await apiClient.post("/follows/create/", params);
    commit("addFolloweeId", params.followId);
  },
  async deleteFolloweeId({ commit }, { followId, userId }) {
    await apiClient.delete("/follows/delete/" + followId + "/" + userId + "/");
    commit("removeFolloweeId", followId);
  },
};

export default {
  strict: process.env.NODE_ENV !== "production",
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
