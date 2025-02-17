/*
 * @Descripttion:
 * @version: 1.0.1
 * @Author: daipeng
 * @Date: 2025-02-15 17:28:02
 * @LastEditors: daipeng
 * @LastEditTime: 2025-02-17 08:55:14
 */
import axiosInstance from '../utils/axiosInstance';

// 登录
export const loginApi = (params) => {
  return axiosInstance.get('/api/user/login', { params });
};
