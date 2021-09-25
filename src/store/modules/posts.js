import apiClient from "@/axios";
import store from "@/store";
import qs from "qs";

const state = {
  latestPosts: [], // ホームページで表示される最新の投稿
  myPosts: [], // 自分の投稿
  myFavoritePosts: [], // お気に入りの投稿
  followeePosts: [], // フォロイーの投稿
  filteredPosts: [],
  searchedPosts: [],
  pageTotal: {
    // それぞれの投稿の総ページ数
    home: 0,
    myPosts: 0,
    followee: 0,
    favorites: 0,
    filter: 0,
    search: 0,
  },
  activeMenu: "home",
  filterType: "",
  categories: [], // 選択中のカテゴリー
  postalCode: "", // 指定中の郵便番号
  keyword: "", // 検索用キーワード
};

const getters = {
  latestPosts: (state) => state.latestPosts,
  myPosts: (state) => state.myPosts,
  myFavoritePosts: (state) => state.myFavoritePosts,
  followeePosts: (state) => state.followeePosts,
  filteredPosts: (state) => state.filteredPosts,
  searchedPosts: (state) => state.searchedPosts,
  pageTotal: (state) => state.pageTotal,
  activeMenu: (state) => state.activeMenu,
  filterType: (state) => state.filterType,
};

const mutations = {
  setLatestPosts(state, payload) {
    // 最新の投稿をセット
    state.latestPosts = payload.posts;
    state.pageTotal.home = payload.total;
  },
  setMyPosts(state, payload) {
    // 自分の投稿をセット
    state.myPosts = payload.posts;
    state.pageTotal.myPosts = payload.total; // 総ページ数
  },
  setMyFavoritePosts(state, payload) {
    // お気に入りの投稿をセット
    state.myFavoritePosts = payload.posts;
    state.pageTotal.favorites = payload.total;
  },
  setFolloweePosts(state, payload) {
    // フォローしているユーザーの投稿をセット
    state.followeePosts = payload.posts;
    state.pageTotal.followee = payload.total;
  },
  setFilteredPosts(state, payload) {
    // フィルタリングされた投稿をセット
    state.filteredPosts = payload.posts;
    state.pageTotal.filter = payload.total;
    state.filterType = "filter";
  },
  setSearchedPosts(state, payload) {
    // 検索された投稿をセット
    state.searchedPosts = payload.posts;
    state.pageTotal.search = payload.total;
    // watchで正規のsearchedPostsとtotalを取得するため最後にfilterTypeをセット
    state.filterType = "search";
  },
  // フィルタリングの条件をセット
  setFilterData(state, payload) {
    state.categories = payload.categories;
    state.postalCode = payload.postalCode;
  },
  // 検索キーワードをセット
  setSearchData(state, payload) {
    state.keyword = payload;
  },
  // filterTypeのみの初期化
  clearFilterType(state) {
    state.filterType = "";
  },
  // メニューの変更
  changeActiveMenu(state, payload) {
    state.activeMenu = payload;
  },
};

const actions = {
  // 最新の投稿を取得
  getLatestPosts({ commit }, page = 1) {
    return apiClient
      .get("/posts/page/" + page + "/")
      .then(({ data }) => {
        commit("setLatestPosts", data);
      })
      .catch((err) => Promise.reject(err));
  },
  // 自分の投稿を取得
  getMyPosts({ commit }, page = 1) {
    return apiClient
      .get("/posts/" + store.getters["auth/userId"] + "/page/" + page + "/")
      .then(({ data }) => {
        commit("setMyPosts", data);
      })
      .catch((err) => Promise.reject(err));
  },
  // ユーザーのお気に入りの投稿を取得
  getMyFavoritePosts({ commit }, page = 1) {
    return apiClient
      .get(
        "/posts/favorite/user/" +
          store.getters["auth/userId"] +
          "/page/" +
          page +
          "/"
      )
      .then(({ data }) => {
        commit("setMyFavoritePosts", data);
      })
      .catch((err) => Promise.reject(err));
  },
  // フォローしているユーザーの投稿を取得
  async getFolloweePosts({ commit }, page = 1) {
    const followsId = [];
    for (const obj of store.getters["follows/follow"]) {
      followsId.push(obj.follow.id); // followカラムのユーザーのIDをセット
    }
    // フォロワーを取得
    const { data } = await apiClient
      .post("/posts/followee/page/" + page + "/", { followsId })
      .catch((err) => Promise.reject(err));

    // Vuexにセット
    commit("setFolloweePosts", data);
  },
  // フィルタリングの条件を設定
  registerFilterData({ commit }, filterData) {
    commit("setFilterData", filterData);
  },
  // 検索キーワードの指定
  registerSearchData({ commit }, searchKeyword) {
    commit("setSearchData", searchKeyword);
  },
  // filterTypeの初期化
  resetFilterType({ commit }) {
    commit("clearFilterType");
  },
  // フィルタリングされた投稿を登録
  async registerFilteredPosts({ state, commit }, { page, userId }) {
    const params = {
      categories: state.categories, // カテゴリー
      address: state.postalCode, // 郵便番号
    };

    // 自分の投稿表示中の絞り込み
    if (state.activeMenu === "myPosts") {
      params.authorId = userId;

      // フォローしているユーザーの投稿表示中の絞り込み
    } else if (state.activeMenu === "followee") {
      const followsId = []; // フォローしているユーザーのIDの配列
      for (const obj of store.getters["follows/follow"]) {
        followsId.push(obj.follow.id);
      }
      params.authorId = followsId;

      // お気に入りの投稿表示中の絞り込み
    } else if (state.activeMenu === "favorites") {
      params.userId = userId;
    }

    const { data } = await apiClient.get(
      "/posts/filter/query/page/" + page + "/",
      {
        params, // クエリパラメータ
        paramsSerializer: (params) => qs.stringify(params),
      }
    );
    commit("setFilteredPosts", data);
  },
  // 検索された投稿を登録
  async registerSearchedPosts({ state, commit }, { page, userId }) {
    const params = {
      keyword: state.keyword,
    };
    
    // 自分の投稿表示中の絞り込み
    if (state.activeMenu === "myPosts") {
      params.authorId = userId;

      // フォローしているユーザーの投稿表示中の絞り込み
    } else if (state.activeMenu === "followee") {
      const followsId = []; // フォローしているユーザーのIDの配列
      for (const obj of store.getters["follows/follow"]) {
        followsId.push(obj.follow.id);
      }
      params.authorId = followsId;

      // お気に入りの投稿表示中の絞り込み
    } else if (state.activeMenu === "favorites") {
      params.userId = userId;
    }
    
    const { data } = await apiClient.get(
      "/posts/search/query/page/" + page + "/",
      {
        params, // クエリパラメータ
        paramsSerializer: (params) => qs.stringify(params),
      }
    );
    commit("setSearchedPosts", data);
  },
  // お気に入りの投稿追加
  async addFavoritePost({ dispatch }, { userId, postId }) {
    const params = {
      userId, // お気に入りに追加するユーザーのID
      postId, // お気に入りの投稿のID
    };

    // お気に入りの投稿を追加
    await apiClient
      .post("/posts/create/favorite/", params)
      .catch((err) => Promise.reject(err));

    // お気に入りの投稿リストを更新
    await dispatch("getMyFavoritePosts").catch((err) => Promise.reject(err));
  },
  // お気に入りの投稿削除
  async removeFavoritePost({ dispatch }, { userId, postId }) {
    // お気に入りの投稿を削除
    await apiClient
      .delete("/posts/" + postId + "/remove/favorite/" + userId + "/")
      .catch((err) => Promise.reject(err));

    // お気に入りの投稿リストを更新
    await dispatch("getMyFavoritePosts").catch((err) => Promise.reject(err));
  },
  resetActiveMenu({ commit }, menuType) {
    commit("changeActiveMenu", menuType);
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
