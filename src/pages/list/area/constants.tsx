import React from 'react';
import { Button, Typography, Badge } from '@arco-design/web-react';
// import IconText from './icons/text.svg';
// import IconHorizontalVideo from './icons/horizontal.svg';
// import IconVerticalVideo from './icons/vertical.svg';
import dayjs from 'dayjs';
import styles from './style/index.module.less';

const { Text } = Typography;

export const ContentType = ['图文', '横版短视频', '竖版短视频'];
export const FilterType = ['规则筛选', '人工'];

export function getColumns(
  callback: (record: Record<string, any>, type: string) => Promise<void>
) {
  return [
    {
      title: '大集编号',
      dataIndex: 'id',
      render: (value) => <Text copyable>{value}</Text>,
    },
    {
      title: '大集名称',
      dataIndex: 'name',
    },
    {
      title: '所属区域',
      dataIndex: 'filterType',
      render: (value) => FilterType[value],
    },
    {
      title: '地址',
      dataIndex: 'filterType',
      render: (value) => FilterType[value],
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
      render: (x) => dayjs().subtract(x, 'days').format('YYYY-MM-DD HH:mm:ss'),
      sorter: (a, b) => b.createdTime - a.createdTime,
    },
    {
      title: '操作',
      dataIndex: 'operations',
      headerCellStyle: { paddingLeft: '15px' },
      render: (_, record) => (
        <Button
          type="text"
          size="small"
          onClick={() => callback(record, 'view')}
        >
          编辑
        </Button>
      ),
    },
  ];
}

// export default () => ContentIcon;
