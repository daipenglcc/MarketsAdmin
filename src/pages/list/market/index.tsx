import React, { useState, useEffect, useMemo } from 'react';
import {
  Table,
  Card,
  PaginationProps,
  Button,
  Space,
  Typography,
} from '@arco-design/web-react';
import PermissionWrapper from '@/components/PermissionWrapper';
import { IconDownload, IconPlus } from '@arco-design/web-react/icon';
import axios from 'axios';
import SearchForm from './form';
import { getAllMerchants } from '../../../api/market';
import styles from './style/index.module.less';
import './mock';
import { getColumns } from './constants';

const { Title } = Typography;
export const ContentType = ['图文', '横版短视频', '竖版短视频'];
export const FilterType = ['规则筛选', '人工'];
export const Status = ['已上线', '未上线'];

// 在文件顶部定义 formParams 的类型
interface FormParams {
  name?: string;
  areaId?: number[];
}

function SearchTable() {
  const tableCallback = async (record, type) => {
    console.log(record, type);
  };

  const columns = getColumns(tableCallback);

  const [data, setData] = useState([]);
  const [pagination, setPatination] = useState<PaginationProps>({
    sizeCanChange: true,
    showTotal: true,
    pageSize: 10,
    current: 1,
    pageSizeChangeResetCurrent: true,
  });
  const [loading, setLoading] = useState(true);
  const [formParams, setFormParams] = useState<FormParams>({});

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.pageSize, JSON.stringify(formParams)]);

  const fetchData = async () => {
    try {
      const { current, pageSize } = pagination;
      const { name, areaId } = formParams; // 现在 TypeScript 知道 formParams 的结构
      setLoading(true);
      const ret: any = await getAllMerchants({
        pageIndex: current,
        pageSize,
        name,
        areaId: areaId ? areaId.join(',') : '', // 确保 areaId 存在时才调用 join
      });
      setData(ret.merchants);
      setPatination({
        ...pagination,
        current,
        pageSize,
        total: ret.count,
      });
    } catch (error) {
      console.error('获取数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  function onChangeTable({ current, pageSize }) {
    setPatination({
      ...pagination,
      current,
      pageSize,
    });
  }

  function handleSearch(params) {
    setPatination({ ...pagination, current: 1 });
    setFormParams(params);
  }

  return (
    <Card>
      <Title heading={6}>搜索</Title>
      <SearchForm onSearch={handleSearch} />
      <div className={styles['button-group']}>
        <Space>
          <Button type="primary" icon={<IconPlus />}>
            新增
          </Button>
        </Space>
      </div>
      <Table
        rowKey="id"
        loading={loading}
        onChange={onChangeTable}
        pagination={pagination}
        columns={columns}
        data={data}
      />
    </Card>
  );
}

export default SearchTable;
