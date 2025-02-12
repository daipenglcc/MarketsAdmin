import React, { useState, useEffect, useMemo } from 'react';
import {
  Message,
  Table,
  Card,
  PaginationProps,
  Typography,
  Button,
  Space,
  Empty,
} from '@arco-design/web-react';
import { getColumns } from './constants';
import AddAreaModal from './AddAreaModal';
import { getAreas, addArea, updataArea } from '../../../api/market';
import styles from './style/index.module.less';
import { IconPlus } from '@arco-design/web-react/icon';

function SearchTable() {
  const [selectedRecord, setSelectedRecord] = useState(null); // 新增状态来存储选中的记录

  const tableCallback = async (record, type) => {
    console.log(record);
    console.log(type);

    if (type === 'edit') {
      setSelectedRecord(record); // 设置选中的记录
      setModalVisible(true); // 显示弹窗
    }
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

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.pageSize]);

  const fetchData = async () => {
    try {
      const { current, pageSize } = pagination;
      setLoading(true);
      const ret: any = await getAreas({ pageIndex: current, pageSize });
      setData(ret.areas);
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

  const [modalVisible, setModalVisible] = useState(false); // 控制弹窗显示
  const handleAdd = () => {
    setModalVisible(true); // 显示弹窗
  };
  const handleOk = async (values) => {
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
      <Typography.Title heading={6}>区域列表</Typography.Title>
      <div className={styles['button-group']}>
        <div></div>
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
        noDataElement={
          <Empty description="没有更多数据了" className={styles['is-empty']} />
        }
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
