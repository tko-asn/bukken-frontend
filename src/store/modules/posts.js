import apiClient from '@/axios';
import store from '@/store';

const state = {
  myPosts: [], // 自分の投稿
  myFavoritePosts: [], // お気に入りの投稿
  followeePosts: [], // フォロイーの投稿
};

const getters = {
  myPosts: state => state.myPosts,
  myFavoritePosts: state => state.myFavoritePosts,
  followeePosts: state => state.followeePosts,
};

const mutations = {
  setMyPosts(state, payload) { // 自分の投稿をセット
    state.myPosts = payload;
  },
  setMyFavoritePosts(state, payload) { // お気に入りの投稿をセット
    state.myFavoritePosts = payload;
  },
  setFolloweePosts(state, payload) { // フォローしているユーザーの投稿をセット
    state.followeePosts = payload;
  },
};

const actions = {
  // 自分の投稿を取得
  getMyPosts({ commit }) {
    return apiClient.get('/posts/' + store.getters['auth/userId'] + '/')
      .then(response => {
        commit('setMyPosts', response.data);
      })
      .catch(err => Promise.reject(err));
  },
  // ユーザーのお気に入りの投稿を取得
  getMyFavoritePosts({ commit }) {
    return apiClient.get('/users/' + store.getters['auth/userId'] + '/with/favorite/posts/')
      .then(response => {
        commit('setMyFavoritePosts', response.data.favoritePosts);
      })
      .catch(err => Promise.reject(err));
  },
  // フォローしているユーザーの投稿を取得
  async getFolloweePosts({ commit }) {
    const followsId = [];
    for (const obj of store.getters['follows/follow']) {
      followsId.push(obj.follow.id); // followカラムのユーザーのIDをセット
    }
    // フォロワーを取得
    const res = await apiClient.post('/posts/followee/', { followsId })
      .catch(err => Promise.reject(err))

    // Vuexにセット
    commit('setFolloweePosts', res.data);
  }
};

export default {
  strict: process.env.NODE_ENV !== 'production',
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};