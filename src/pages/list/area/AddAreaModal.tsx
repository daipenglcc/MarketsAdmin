import React, { useState, useEffect, useMemo } from 'react';
import { Modal, Form, Input } from '@arco-design/web-react';

const AddAreaModal = ({ visible, onOk, onClose }) => {
  const [form] = Form.useForm();
  const handleOk = async () => {
    try {
      const values = await form.validate();
      await onOk(values); // 调用父组件传入的 onOk
      form.resetFields(); // 重置表单
    } catch (error) {
      console.log('表单验证失败:', error);
    }
  };
  return (
    <>
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
            field="title"
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
