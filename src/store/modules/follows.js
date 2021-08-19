import apiClient from "@/axios";
import store from "@/store";

const state = { // ログインユーザーのフォロー・フォロワーを保存
  follow: [], // フォローしているユーザーのリスト  [{id, follow: {id, username, iconURL}}, ...]
  follower: [], // フォロワーのリスト [{id, user: {id, username, iconURL}}, ...]
};

const getters = {
  follow: state => state.follow,
  follower: state => state.follower,
}

const mutations = {
  // followの置き換え
  setFollow(state, payload) {
    state.follow = payload;
  },
  // followに要素を追加
  addFollow(state, payload) {
    state.follow.push(payload);
  },
  addFollower(state, payload) {
    state.follower.push(payload);
  }
};

const actions = {
  // ユーザーをフォロー
  followUser({ commit }, userInfo) {
    const loginUserInfo = { // ログインユーザーの情報
      id: store.getters['auth/userId'],
      username: store.getters['auth/username'],
      iconURL: store.getters['auth/iconURL'],
    };

    const params = {
      user: loginUserInfo, // ログインユーザーのオブジェクト(id, username, iconURL)
      follow: userInfo, // フォロー対象のオブジェクト(id, username, iconURL)
    };

    return apiClient.post('/follows/create/', params)
      .then(response => {
        const followObj = {
          id: response.data.followId, // フォローデータのid
          follow: userInfo, // フォローしているユーザーの情報（オブジェクト）
        };

        // フォローデータをstateに保存
        commit('addFollow', followObj);
      })
      .catch(err => Promise.reject(err));
  },
  // フォローを解除
  unfollowUser(context, followId) {
    return apiClient.delete('/follows/delete/' + followId + '/')
      .then(() => {
        // 新しいfollowリストを作成
        const newFollow = context.state.follow.filter(el => el.id !== followId);
        // followリストの置き換え
        context.commit('setFollow', newFollow);
      });
  },
  async getFollow({ commit, dispatch }, { userId, isMe }) { // フォローしている側のユーザーのid
    // フォローデータのリストを取得
    const res = await apiClient.get('/follows/follow/' + userId);

    // フォローリストの要素のfollowの値をparse(破壊的処理)
    dispatch('loopAndParseFollowJSONData', res.data);

    if (isMe) { // ログインユーザーのフォローデータのリストの場合
      commit('setFollow', res.data);
    }

    // 他のユーザーのフォローデータの場合
    return Promise.resolve(res.data);
  },
  getFollower(context, followerId) { // フォローされている側のユーザーのid
    return apiClient.get('/follows/follower/' + followerId)
  },
  loopAndParseFollowJSONData(context, followObjList) {
    for (const i in followObjList) {
      followObjList[i].follow = JSON.parse(followObjList[i].follow);
    }
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