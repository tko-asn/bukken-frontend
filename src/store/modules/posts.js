import apiClient from '@/axios';
import store from '@/store';

const state = {
  latestPosts: [], // ホームページで表示される最新の投稿
  myPosts: [], // 自分の投稿
  myFavoritePosts: [], // お気に入りの投稿
  followeePosts: [], // フォロイーの投稿
  pageTotal: { // それぞれの投稿の総ページ数
    home: 0,
    myPosts: 0,
    followee: 0,
    favorites: 0,
  }
};

const getters = {
  latestPosts: state => state.latestPosts,
  myPosts: state => state.myPosts,
  myFavoritePosts: state => state.myFavoritePosts,
  followeePosts: state => state.followeePosts,
  pageTotal: state => state.pageTotal
};

const mutations = {
  setLatestPosts(state, payload) { // 最新の投稿をセット
    state.latestPosts = payload.posts;
    state.pageTotal.home = payload.total;
  },
  setMyPosts(state, payload) { // 自分の投稿をセット
    state.myPosts = payload.posts;
    state.pageTotal.myPosts = payload.total; // 総ページ数
  },
  setMyFavoritePosts(state, payload) { // お気に入りの投稿をセット
    state.myFavoritePosts = payload.posts;
    state.pageTotal.favorites = payload.total;
  },
  setFolloweePosts(state, payload) { // フォローしているユーザーの投稿をセット
    state.followeePosts = payload.posts;
    state.pageTotal.followee = payload.total;
  },
};

const actions = {
  // 最新の投稿を取得
  getLatestPosts({ commit }, page = 1) {
    return apiClient.get('/posts/page/' + page + '/')
      .then(response => {
        commit('setLatestPosts', response.data);
      })
      .catch(err => Promise.reject(err));
  },
  // 自分の投稿を取得
  getMyPosts({ commit }, page = 1) {
    return apiClient.get('/posts/' + store.getters['auth/userId'] + '/page/' + page + '/')
      .then(response => {
        commit('setMyPosts', response.data);
      })
      .catch(err => Promise.reject(err));
  },
  // ユーザーのお気に入りの投稿を取得
  getMyFavoritePosts({ commit }, page = 1) {
    return apiClient.get('/posts/favorite/user/' + store.getters['auth/userId'] + '/page/' + page + '/')
      .then(response => {
        commit('setMyFavoritePosts', response.data);
      })
      .catch(err => Promise.reject(err));
  },
  // フォローしているユーザーの投稿を取得
  async getFolloweePosts({ commit }, page = 1) {
    const followsId = [];
    for (const obj of store.getters['follows/follow']) {
      followsId.push(obj.follow.id); // followカラムのユーザーのIDをセット
    }
    // フォロワーを取得
    const res = await apiClient.post('/posts/followee/page/' + page + '/', { followsId })
      .catch(err => Promise.reject(err))

    // Vuexにセット
    commit('setFolloweePosts', res.data);
  },
  // お気に入りの投稿追加
  async addFavoritePost({ dispatch }, { userId, postId }) {
    const params = {
      userId, // お気に入りに追加するユーザーのID
      postId, // お気に入りの投稿のID
    };

    // お気に入りの投稿を追加
    await apiClient.post('/posts/create/favorite/', params).catch(err => Promise.reject(err));

    // お気に入りの投稿リストを更新
    await dispatch('getMyFavoritePosts').catch(err => Promise.reject(err));
  },
  // お気に入りの投稿削除
  async removeFavoritePost({ dispatch }, { userId, postId }) {
    // お気に入りの投稿を削除
    await apiClient.delete('/posts/' + postId + '/remove/favorite/' + userId + '/')
      .catch(err => Promise.reject(err))

    // お気に入りの投稿リストを更新
    await dispatch('getMyFavoritePosts').catch(err => Promise.reject(err));
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