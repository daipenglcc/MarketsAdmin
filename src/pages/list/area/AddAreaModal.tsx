import React, { useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Button,
  Message,
  Space,
} from '@arco-design/web-react';
import { IconDownload, IconPlus } from '@arco-design/web-react/icon';
import styles from './style/index.module.less';

const AddAreaModal = () => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  const handleAdd = () => {
    setVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validate();
      console.log('表单数据:', values);
      // 发送数据到接口
      // await submitFormData(values);
      Message.success('提交成功');
      // setVisible(false);
      // form.resetFields();
    } catch (error) {
      console.log('表单验证失败:', error);
    }
  };

  const onClose = () => {
    setVisible(false);
  };

  return (
    <>
      <div className={styles['button-group']}>
        <div></div>
        <Space>
          <Button type="primary" icon={<IconPlus />} onClick={handleAdd}>
            新增
          </Button>
        </Space>
      </div>

      <Modal
        title="新增区域"
        visible={visible}
        onOk={handleOk}
        onCancel={onClose}
        okText="确定"
        cancelText="取消"
      >
        <Form form={form} scrollToFirstError>
          <Form.Item
            label="区域名称"
            field="name"
            rules={[{ required: true, message: '请输入区域名称' }]}
          >
            <Input placeholder="请输入区域名称" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddAreaModal;
