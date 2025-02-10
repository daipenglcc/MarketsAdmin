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
      title: '区域编号',
      dataIndex: 'id',
      render: (value) => <Text copyable>{value}</Text>,
    },
    {
      title: '区域名称',
      dataIndex: 'title',
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
