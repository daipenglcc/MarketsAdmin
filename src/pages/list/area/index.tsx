import React, { useState, useEffect, useMemo } from 'react';
import {
  Table,
  Card,
  PaginationProps,
  Typography,
} from '@arco-design/web-react';
import { getColumns } from './constants';
import AddAreaModal from './AddAreaModal'; // 导入新组件

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

  return (
    <Card>
      <Title heading={6}>搜索</Title>

      <AddAreaModal />
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
