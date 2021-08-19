import Vue from 'vue';
import Vuex from 'vuex';
import auth from './modules/auth';
import post from './modules/post';
import users from './modules/users';
import follows from './modules/follows';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    post,
    users,
    follows
  },
});