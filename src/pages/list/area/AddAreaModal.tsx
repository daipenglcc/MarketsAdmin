import React, { useState, useEffect, useMemo } from 'react';
import { Modal, Form, Input } from '@arco-design/web-react';

const AddAreaModal = ({ visible, onOk, onClose, record }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && record) {
      form.setFieldsValue({
        title: record.title, // 根据 record 的内容回显区域名称
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

  return (
    <>
      <Modal
        title={record ? '修改区域' : '新增区域'}
        visible={visible}
        onOk={handleOk}
        onCancel={handClose}
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
