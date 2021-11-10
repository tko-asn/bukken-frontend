import Vue from "vue";
import Vuex from "vuex";
import auth from "./modules/auth";
import followeeId from "./modules/followeeId";
import home from "./modules/home";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    followeeId,
    home,
  },
});
