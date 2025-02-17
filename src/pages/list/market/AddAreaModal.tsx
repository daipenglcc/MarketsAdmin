import React, { useState, useEffect, useMemo } from 'react';
import { Modal, Form, Input, Spin } from '@arco-design/web-react';
import Map from './Map';
import styles from './style/map.module.less';

const AddAreaModal = ({ visible, onOk, onClose, record }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && record) {
      form.setFieldsValue({
        title: record.title, // 根据 record 的内容回显大集名称
      });
    }
  }, [visible, record]); // 依赖于 visible 和 record

  const handleOk = async () => {
    try {
      let values = await form.validate();
      if (record) {
        values = {
          ...values,
          id: record.id,
        };
      }
      const ret = await onOk(values); // 调用父组件传入的 onOk
      if (ret) {
        form.resetFields(); // 重置表单
      }
    } catch (error) {
      console.log('表单验证失败:', error);
    }
  };

  const handClose = async () => {
    form.resetFields(); // 重置表单
    await onClose();
  };

  const onGetPosition = (position) => {
    console.log('获取到的位置:', position);
    // 这里可以处理获取到的位置
  };

  const [loading, setLoading] = React.useState(false); // table

  return (
    <>
      <Modal
        title={record ? '修改大集' : '新增大集'}
        visible={visible}
        onOk={handleOk}
        onCancel={handClose}
        okText="确定"
        cancelText="取消"
        style={{ width: '1000px' }}
      >
        {/* <Form form={form} scrollToFirstError>
          <Form.Item
            label="大集名称"
            field="title"
            rules={[{ required: true, message: '请输入大集名称' }]}
          >
            <Input placeholder="请输入大集名称" />
          </Form.Item>
        </Form> */}
        <Spin tip="loading Data..." loading={loading}>
          <Map onGetPosition={onGetPosition}></Map>
        </Spin>
      </Modal>
    </>
  );
};

export default AddAreaModal;
