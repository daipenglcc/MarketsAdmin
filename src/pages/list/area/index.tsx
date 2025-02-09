import React, { useState, useEffect, useMemo } from 'react';
import {
  Table,
  Card,
  PaginationProps,
  Button,
  Space,
  Typography,
  Modal,
  Form,
  Input,
} from '@arco-design/web-react';
import { IconDownload, IconPlus } from '@arco-design/web-react/icon';
import styles from './style/index.module.less';
import { getColumns } from './constants';

const { Title } = Typography;
export const ContentType = ['图文', '横版短视频', '竖版短视频'];
export const FilterType = ['规则筛选', '人工'];
export const Status = ['已上线', '未上线'];

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
  const [formParams, setFormParams] = useState({});

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.pageSize, JSON.stringify(formParams)]);

  function fetchData() {
    const { current, pageSize } = pagination;
    setLoading(true);
    // axios
    //   .get('http://localhost:7676/api/market/getMerchants', {
    //     params: {
    //       page: current,
    //       pageSize,
    //       ...formParams,
    //     },
    //   })
    //   .then((res) => {
    setData([]);
    // setPatination({
    //   ...pagination,
    //   current,
    //   pageSize,
    //   total: res.data.total,
    // });
    setLoading(false);
    // });
  }

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

  const [visible, setVisible] = useState(false); // 新增状态管理

  const handleAdd = () => {
    setVisible(true); // 点击新增按钮时显示模态框
  };

  const handleOk = () => {
    // 提交后关闭模态框
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false); // 取消时关闭模态框
  };

  return (
    <Card>
      <Title heading={6}>搜索</Title>
      <div className={styles['button-group']}>
        <div></div>
        <Space>
          <Button type="primary" icon={<IconPlus />} onClick={handleAdd}>
            新增
          </Button>
        </Space>
      </div>
      {/* 新增模态框 */}
      <Modal
        title="新增项目"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="确定"
        cancelText="取消"
      >
        <Form>
          <Form.Item label="地区名称" field="name" rules={[{ required: true }]}>
            <Input placeholder="请输入地区名称" />
          </Form.Item>
          {/* 可以根据需要添加更多表单项 */}
        </Form>
      </Modal>
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
