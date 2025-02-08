import React, { useContext } from 'react';
import { Form, Input, Select, Button, Grid } from '@arco-design/web-react';
import { IconRefresh, IconSearch } from '@arco-design/web-react/icon';
import { ContentType } from './constants';
import styles from './style/index.module.less';

const { Row, Col } = Grid;
const { useForm } = Form;

function SearchForm(props: {
  onSearch: (values: Record<string, any>) => void;
}) {
  const [form] = useForm();

  const handleSubmit = () => {
    const values = form.getFieldsValue();
    props.onSearch(values);
  };

  const handleReset = () => {
    form.resetFields();
    props.onSearch({});
  };

  return (
    <div className={styles['search-form-wrapper']}>
      <Form
        form={form}
        className={styles['search-form']}
        labelAlign="left"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
      >
        <Row gutter={24}>
          <Col span={6}>
            <Form.Item label="名称" field="id">
              <Input placeholder="请输入大集名称" allowClear />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item label="地区" field="contentType">
              <Select
                placeholder={'请选择地区'}
                options={ContentType.map((item, index) => ({
                  label: item,
                  value: index,
                }))}
                mode="multiple"
                allowClear
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <div className={styles['right-button']}>
        <Button
          className={styles['search']}
          type="primary"
          icon={<IconSearch />}
          onClick={handleSubmit}
        >
          搜索
        </Button>
        <Button icon={<IconRefresh />} onClick={handleReset}>
          重置
        </Button>
      </div>
    </div>
  );
}

export default SearchForm;
