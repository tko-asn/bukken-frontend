import Vue from 'vue';
import Vuex from 'vuex';
import auth from './modules/auth';
import posts from './modules/posts';
import follows from './modules/follows';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    posts,
    follows
  },
});