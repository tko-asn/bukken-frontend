import apiClient from '@/axios';

const actions = {
  // 個別のユーザー情報取得
  retrieve(context, userId) {
    return apiClient.get('/users/' + userId + '/')
    .then(response => Promise.resolve(response))
    .catch(err => Promise.reject(err));
  }
};

export default {
  strict: process.env.NODE_ENV !== 'production',
  namespaced: true,
  actions,
};