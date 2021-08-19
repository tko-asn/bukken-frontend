import apiClient from "@/axios";
import store from "@/store";

const state = { // ログインユーザーのフォロー・フォロワーを保存
  follow: [], // フォローしているユーザーのリスト  [{id, follow: {id, username, iconURL}}, ...]
  follower: [], // フォロワーのリスト [{id, user: {id, username, iconURL}}, ...]
};

const getters = {
  follow: state => state.follow,
  follower: state => state.follower,
};

const mutations = {
  // followの置き換え
  setFollow(state, payload) {
    state.follow = payload;
  },
  // followに要素を追加
  addFollow(state, payload) {
    state.follow.push(payload);
  },
  // followerの置き換え
  setFollower(state, payload) {
    state.follower = payload;
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
  // フォローしているユーザーのリストを取得
  async getFollow({ commit, dispatch }, { userId, isMe }) { // フォローしている側のユーザーのidがuserId
    // フォローデータのリストを取得
    const res = await apiClient.get('/follows/follow/' + userId);

    // フォローリストの要素のfollowの値をparse(破壊的処理)
    dispatch(
      'loopAndParseFollowJSONData', 
      { objList: res.data, type: 'follow' }
    );

    if (isMe) { // ログインユーザーのフォローデータのリストの場合
      commit('setFollow', res.data);
    }

    // 他のユーザーのフォローデータの場合
    return Promise.resolve(res.data);
  },
  // フォロワーのリストを取得
  async getFollower({ commit, dispatch }, { followId, isMe }) { // フォローされている側のユーザーのidがfollowId
    // フォロワーデータのリストを取得
    const res = await apiClient.get('/follows/follower/' + followId);

    // フォロワーリストの要素のuserの値をparse(破壊的処理)
    dispatch(
      'loopAndParseFollowJSONData', 
      { objList: res.data, type: 'follower' }
    );

    if (isMe) { // ログインユーザーのフォロワーデータのリストの場合
      commit('setFollower', res.data);
    }

    // 他のユーザーのフォロワーデータの場合
    return Promise.resolve(res.data);
  },
  loopAndParseFollowJSONData(context, { objList, type }) {
    // フォローデータを扱う場合
    if (type === 'follow') {
      for (const i in objList) {
        objList[i].follow = JSON.parse(objList[i].follow);
      }

    // フォロワーデータを扱う場合
    } else if (type === 'follower') {
      for (const i in objList) {
        objList[i].user = JSON.parse(objList[i].user);
      }
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