import React, { useState, useEffect, useMemo } from 'react';
import {
  Message,
  Table,
  Card,
  PaginationProps,
  Button,
  Space,
  Typography,
  Modal,
} from '@arco-design/web-react';
import { IconPlus } from '@arco-design/web-react/icon';
import SearchForm from './SearchForm';
import { getAllMerchants } from '../../../api/market';
import styles from './style/index.module.less';
import { getColumns } from './constants';
import AddAreaModal from './AddAreaModal';
import { upsertMerchant, deleteMerchant } from '../../../api/market';

const { Title } = Typography;
// 在文件顶部定义 formParams 的类型
interface FormParams {
  name?: string;
  areaId?: number[];
}

function SearchTable() {
  const [selectedRecord, setSelectedRecord] = useState(null); // 新增状态来存储选中的记录
  const tableCallback = async (record, type) => {
    console.log(record, type);
    if (type === 'edit') {
      setSelectedRecord(record); // 设置选中的记录
      setModalVisible(true); // 显示弹窗
    }

    if (type === 'delete') {
      // 执行删除
      Modal.confirm({
        title: `确定删除【${record.name}】吗？`,
        okText: '确定',
        cancelText: '取消',
        okButtonProps: {
          status: 'danger',
        },
        onOk: async () => {
          await deleteMerchant({
            id: record.id,
          });
          Message.success(`【${record.name}】删除成功`);

          fetchData();
        },
      });
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
        areaId: areaId ? areaId.join(',') : '',
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

  // 搜索
  function handleSearch(params) {
    setPatination({ ...pagination, current: 1 });
    setFormParams(params);
  }

  // 控制弹窗显示
  const [modalVisible, setModalVisible] = useState(false);

  // 新增
  const handleAdd = () => {
    setModalVisible(true); // 显示弹窗
  };

  // 弹窗-提交
  const handleOk = async (objData) => {
    try {
      await upsertMerchant(objData);
      Message.success(`${objData.id ? '修改' : '添加'}成功`);
      setModalVisible(false);
      setSelectedRecord(null);
      fetchData();
      return true;
    } catch (error) {
      console.log('error', error);
      return false;
    }
  };

  // 弹窗-关闭
  const onClose = () => {
    setModalVisible(false);
    setSelectedRecord(null);
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
