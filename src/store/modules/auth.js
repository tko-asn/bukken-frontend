import apiClient from "@/axios";
import store from "@/store/index";

const state = {
  // 認証情報
  isLoggedIn: false,
  userId: "",
  email: "",
  // プロフィール情報
  username: "",
  selfIntroduction: "",
  iconURL: "",
};

const getters = {
  isLoggedIn: (state) => state.isLoggedIn,
  userId: (state) => state.userId,
  email: (state) => state.email,
  username: (state) => state.username,
  iconURL: (state) => state.iconURL,
  selfIntroduction: (state) => state.selfIntroduction,
};

const mutations = {
  // 認証情報・プロフィール情報のセット
  set(state, payload) {
    state.isLoggedIn = true;
    state.userId = payload.id;
    state.email = payload.email;
    state.username = payload.username;
    state.selfIntroduction = payload.self_introduction;
    state.iconURL = payload.icon_url;
  },
  // 認証情報・プロフィール情報の初期化
  clear(state) {
    state.isLoggedIn = false;
    state.userId = "";
    state.email = "";
    state.username = "";
    state.selfIntroduction = "";
    state.iconURL = "";
  },
  // 認証情報(email)のみセット
  setAuthInfo(state, payload) {
    state.email = payload.email;
  },
  // プロフィール情報のみセット
  setProfile(state, payload) {
    state.username = payload.username;
    state.selfIntroduction = payload.self_introduction;
    state.iconURL = payload.icon_url;
  },
  // プロフィール情報のみセット（アイコン画像なし）
  setProfileNoIcon(state, payload) {
    state.username = payload.username;
    state.selfIntroduction = payload.self_introduction;
  },
};

const actions = {
  // ログイン
  async login({ state, commit }, payload) {
    // APIを実行
    const { data } = await apiClient
      .post("/auth/login/", payload)
      .catch((err) => Promise.reject(err));

    // トークンを保存
    localStorage.setItem("token", data.token);

    // id, username, email, selfIntroduciton, iconURLを保存
    commit("set", data);

    await store.dispatch("followeeId/getFolloweeId", state.userId);
  },
  // サインアップ
  signUp({ dispatch }, payload) {
    return apiClient
      .post("/users/register/", payload)
      .then(() => dispatch("login", payload))
      .catch((err) => Promise.reject(err));
  },
  // トークンの検証
  async verify({ state, commit }) {
    // APIを実行
    const { data } = await apiClient
      .get("/auth/verify/")
      .catch((err) => Promise.reject(err));

    // ユーザー情報をセット(stateが初期化されている状態でトークンが残っている場合)
    commit("set", data);

    await store.dispatch("followeeId/getFolloweeId", state.userId);
  },
  // ログアウト
  logout({ commit }) {
    return apiClient
      .get("/auth/logout/")
      .then(() => {
        localStorage.removeItem("token");
        commit("clear");
      })
      .catch((err) => Promise.reject(err));
  },
  // 認証情報変更
  editAuthInfo({ commit, state }, authInfo) {
    // emailかpasswordの編集（どちらか）
    return apiClient
      .patch(`/users/change/${state.userId}/`, authInfo)
      .then(() => {
        // emailの変更の場合
        if (authInfo.email) {
          commit("setAuthInfo", authInfo);
        }
        // パスワードはvuexで管理していないので特になし
      })
      .catch((err) => Promise.reject(err));
  },
  // プロフィール編集
  editProfile({ commit, state }, params) {
    let url; // APIのURL
    let headers; // リクエストヘッダー
    let mutation; // mutationsの種類

    // paramsがFormDataの場合（アイコンに変更があった場合）
    if (!params.username) {
      url = `/users/profile/${state.userId}/edit/`;
      headers = { "Content-Type": "multipart/form-data" }; // multerを使用
      mutation = "setProfile";

      // paramsがFormDataではない場合（アイコンに変更がなかった場合）
    } else {
      url = `/users/profile/${state.userId}/edit/noicon/`;
      headers = { "Content-Type": "application/json" }; // 通常通り
      mutation = "setProfileNoIcon";
    }

    // APIを実行
    return apiClient
      .patch(url, params, { headers })
      .then(({ data }) => {
        // vuexの値を更新
        commit(mutation, data);
      })
      .catch((err) => Promise.reject(err));
  },
  // アカウント閉鎖
  delete({ dispatch, state }) {
    return apiClient
      .delete(`/users/delete/${state.userId}/`)
      .then(() => dispatch("logout")); // 成功したらログアウト
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
