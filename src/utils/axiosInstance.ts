import axios from 'axios';
import { Message } from '@arco-design/web-react';

// 创建 Axios 实例
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 10000, // 请求超时时间
});

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    const token = JSON.parse(localStorage.getItem('loginParams') || '{}').token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // 处理请求错误
    return Promise.reject(error);
  }
);

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response) => {
    // 处理响应数据
    return response.data.data; // 直接返回数据
  },
  (error) => {
    // 处理响应错误
    if (error.response) {
      // 请求已发出，但服务器响应了状态码
      console.log('Error Response:', error.response);
      Message.error(error.response.data.message);
      const errorCode = error.response.data.code;
      // if (errorCode === 401) {
      //   // token过期
      //   localStorage.removeItem('userStatus');
      //   window.location.href = '/login';
      // }
    } else {
      // 其他错误
      console.log('Error Message:', error.message);
      Message.error(error.response.data.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
