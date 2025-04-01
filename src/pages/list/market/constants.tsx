import React from 'react';
import { Button, Typography, Badge } from '@arco-design/web-react';
import dayjs from 'dayjs';
import { IconLock } from '@arco-design/web-react/icon';

const { Text } = Typography;

export const datesList = [
  {
    label: '逢一',
    value: '一',
  },
  {
    label: '逢二',
    value: '二',
  },
  {
    label: '逢三',
    value: '三',
  },
  {
    label: '逢四',
    value: '四',
  },
  {
    label: '逢五',
    value: '五',
  },
  {
    label: '逢六',
    value: '六',
  },
  {
    label: '逢七',
    value: '七',
  },
  {
    label: '逢八',
    value: '八',
  },
  {
    label: '逢九',
    value: '九',
  },
  {
    label: '逢十',
    value: '十',
  },
];

export function getColumns(
  callback: (record: Record<string, any>, type: string) => Promise<void>
) {
  return [
    {
      title: '大集编号',
      dataIndex: 'id',
    },
    {
      title: '大集名称',
      dataIndex: 'name',
      render: (value, item) => (
        <>
          {/* copyable */}
          <Text>{value}</Text>
          {item.locked == 1 && <IconLock style={{ marginLeft: 5 }} />}
        </>
      ),
    },
    {
      title: '阴历日期',
      dataIndex: 'dates',
    },
    {
      title: '所属区域',
      dataIndex: 'region',
    },
    {
      title: '地址',
      dataIndex: 'address',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      render: (x) => dayjs(x).format('YYYY-MM-DD HH:mm:ss'),
      sorter: (a, b) => b.createdAt - a.createdAt,
    },
    {
      title: '操作',
      dataIndex: 'operations',
      headerCellStyle: { paddingLeft: '15px' },
      render: (_, record) => (
        <>
          <Button
            type="text"
            size="small"
            onClick={() => callback(record, 'lock')}
          >
            {record.locked == 1 ? '解锁' : '锁定'}
          </Button>

          <Button
            type="text"
            size="small"
            onClick={() => callback(record, 'edit')}
          >
            编辑
          </Button>
          <Button
            type="text"
            size="small"
            onClick={() => callback(record, 'delete')}
          >
            删除
          </Button>
        </>
      ),
    },
  ];
}
