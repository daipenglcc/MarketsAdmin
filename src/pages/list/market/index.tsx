import React, { useState, useEffect, useMemo } from 'react';
import {
  Message,
  Table,
  Card,
  PaginationProps,
  Button,
  Space,
  Typography,
} from '@arco-design/web-react';
import { IconPlus } from '@arco-design/web-react/icon';
import axios from 'axios';
import SearchForm from './form';
import { getAllMerchants } from '../../../api/market';
import styles from './style/index.module.less';
import './mock';
import { getColumns } from './constants';
import AddAreaModal from './AddAreaModal';
import { getAreas, addArea, updataArea } from '../../../api/market';

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
  const [selectedRecord, setSelectedRecord] = useState(null); // 新增状态来存储选中的记录

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

  const [modalVisible, setModalVisible] = useState(true); // 控制弹窗显示
  const handleAdd = () => {
    setModalVisible(true); // 显示弹窗
  };

  function handleSearch(params) {
    setPatination({ ...pagination, current: 1 });
    setFormParams(params);
  }

  const handleOk = async (values) => {
    return;
    try {
      if (!values.id) {
        // 新增
        await addArea({
          title: values.title,
        });
      } else {
        // 修改
        await updataArea({
          id: values.id,
          title: values.title,
        });
      }

      Message.success(`${values.id ? '修改' : '添加'}成功`);
      setModalVisible(false);
      setSelectedRecord(null);
      fetchData();
      return true;
    } catch (error) {
      console.log('error', error);
      return false;
    }
  };
  const onClose = () => {
    setModalVisible(false); // 关闭弹窗
    setSelectedRecord(null); // 设置选中的记录
  };

  return (
    <Card>
      <Title heading={6}>搜索</Title>
      <SearchForm onSearch={handleSearch} />
      <div className={styles['button-group']}>
        <Space>
          <Button type="primary" icon={<IconPlus />} onClick={handleAdd}>
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
      <AddAreaModal
        visible={modalVisible}
        onOk={handleOk}
        onClose={onClose}
        record={selectedRecord} // 传递选中的记录
      />
    </Card>
  );
}

export default SearchTable;
