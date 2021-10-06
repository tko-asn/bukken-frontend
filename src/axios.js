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

export default apiClient;