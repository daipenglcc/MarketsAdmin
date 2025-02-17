import React, { useEffect, useState } from 'react';
import { Select } from '@arco-design/web-react';

const AreaSelect = ({ onChange }) => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await fetch('/api/areas'); // 替换为实际接口
        const data = await response.json();
        setOptions(data.map((area) => ({ label: area.name, value: area.id }))); // 假设接口返回的字段
      } catch (error) {
        console.error('获取地区数据失败:', error);
      }
    };

    fetchOptions();
  }, []);

  return (
    <Select
      style={{ width: 200 }}
      placeholder="请选择所属地区"
      options={options}
      allowClear
      onChange={onChange}
    />
  );
};

export default AreaSelect;
