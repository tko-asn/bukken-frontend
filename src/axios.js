import axios from 'axios';

const apiClient = axios.create({
  // baseURL: process.env.VUE_APP_YOBO_API_URL,
  baseURL: 'http://localhost:3000/',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  }
});


apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');

    // tokenがある場合
    if (token) {
      config.headers.Authorization = 'Bearer ' + token;
      return config;
      // tokenがない場合
    } else {
      return config;
    }
  },
  err => Promise.reject(err),
);

// apiClient.interceptors.response.use(
//   response => response,
//   err => {
//     const statusCode = err.response ? err.response.status : 500;
//     let messages;
//     if (statusCode === 400) { // バリデーションエラー
//       // Object.values(err.response.data)はリストを要素としてもつ配列
//       // 二重concat
//       messages = [].concat.apply([], Object.values(err.response.data));
//       // messages送信処理
      
      
      
//     } else if (statusCode === 401) { // 認証エラー
//       const token = localStorage.getItem('token');
//       // tokenがないとき
//       if (!token) {
//         messages = '再度ログインしてください。';
//         // tokenがあるが認証エラーのとき
//       } else {
//         messages = '認証に失敗しました。';
//       }
//       // messages送信処理
      
      
//     } else if (statusCode === 403) { // パーミッションエラー
//       messages = 'この行為は許可されていません。';
//       // messages送信処理
      
      
//     } else { // 500
//       messages = '問題が発生しました。';
//       // messages送信処理

//     }
//     return Promise.reject(err);
//   }
// );

export default apiClient;