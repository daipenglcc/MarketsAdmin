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
import { getAreas, addArea } from '../../../api/market';
import styles from './style/index.module.less';
import { IconPlus } from '@arco-design/web-react/icon';

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
      await addArea({
        title: values.title,
      });
      Message.success('添加成功');
      setModalVisible(false); // 提交成功后关闭弹窗
      fetchData(); // 重新获取数据
    } catch (error) {
      console.log('error', error);
    }
  };
  const onClose = () => {
    setModalVisible(false); // 关闭弹窗
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
      <AddAreaModal visible={modalVisible} onOk={handleOk} onClose={onClose} />
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
    </Card>
  );
}

export default SearchTable;
