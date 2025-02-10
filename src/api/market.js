import axiosInstance from '../utils/axiosInstance';

// 获取所有区域
export const getAreas = (params) => {
  return axiosInstance.get('/api/market/getArea', { params });
};

// 新增区域
export const addArea = (data) => {
  return axiosInstance.post('/api/market/addArea', data);
};

// 获取所有大集
export const getAllMerchants = (params) => {
  return axiosInstance.get('/api/market/getMerchants', { params });
};
