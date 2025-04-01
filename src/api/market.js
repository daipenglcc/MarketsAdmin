import axiosInstance from '../utils/axiosInstance';

// 获取所有区域
export const getAreas = (params) => {
  return axiosInstance.get('/api/market/getArea', { params });
};

// 新增区域
export const addArea = (data) => {
  return axiosInstance.post('/api/market/addArea', data);
};

// 修改区域
export const updataArea = (data) => {
  return axiosInstance.post('/api/market/updataArea', data);
};

// 获取所有大集
export const getAllMerchants = (params) => {
  return axiosInstance.get('/api/market/getMerchants', { params });
};

// 新增/编辑大集
export const upsertMerchant = (data) => {
  return axiosInstance.post('/api/market/upsertMerchant', data);
};

// 删除大集
export const deleteMerchant = (data) => {
  return axiosInstance.post('/api/market/deleteMerchant', data);
};

// 解锁/锁定大集
export const lockMerchant = (data) => {
  return axiosInstance.post('/api/market/lockMerchant', data);
};

// 获取大集详情
export const getMerchantDetail = (params) => {
  return axiosInstance.get('/api/market/getMerchantDetail', { params });
};
