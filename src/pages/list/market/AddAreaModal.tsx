import React, { useState, useEffect, useMemo } from 'react';
import {
  Modal,
  Form,
  Input,
  Spin,
  Select,
  Checkbox,
  Tag,
  Button,
} from '@arco-design/web-react';
import Map from './Map';
import styles from './style/map.module.less';
import { datesList } from './constants';
import { getAreas } from '../../../api/market';

const AddAreaModal = ({ visible, onOk, onClose, record }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && record) {
      form.setFieldsValue({
        title: record.title, // 根据 record 的内容回显大集名称
      });
    }
  }, [visible, record]); // 依赖于 visible 和 record

  const [areaOptions, setAreaOptions] = useState([]); // 新增状态以存储地区选项
  useEffect(() => {
    const fetchAreas = async () => {
      const ret: any = await getAreas();
      setAreaOptions(
        ret.areas.map((item: any) => ({
          label: item.title,
          value: item.id,
        }))
      );
    };

    fetchAreas(); // 组件加载时调用接口
  }, []); // 只在组件挂载时调用

  const handleOk = async () => {
    try {
      let values = await form.validate();
      if (record) {
        values = {
          ...values,
          id: record.id,
        };
      }

      console.log('values', values);
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

  const [position, setPosition] = useState({ lat: '', lng: '' }); // 新增状态以存储经纬度

  const onGetPosition = (position) => {
    console.log('获取到的位置:', position);
    setPosition(position); // 更新经纬度状态
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
        <Form style={{ width: '100%' }} form={form} scrollToFirstError>
          <Form.Item
            label="大集名称"
            field="title"
            labelCol={{ span: 3 }}
            rules={[{ required: true, message: '请输入大集名称' }]}
          >
            <Input
              style={{ width: 200 }}
              placeholder="请输入大集名称"
              allowClear
            />
          </Form.Item>
          <Form.Item
            label="所属地区"
            field="area_id"
            labelCol={{ span: 3 }}
            rules={[{ required: true, message: '请选择所属地区' }]}
          >
            <Select
              style={{ width: 200 }}
              placeholder="请选择所属地区"
              options={areaOptions} // 使用从接口获取的地区选项
              allowClear
            />
          </Form.Item>
          <Form.Item
            label="阴历日期"
            field="dates"
            labelCol={{ span: 3 }}
            rules={[{ required: true, message: '请选择阴历日期' }]}
          >
            <Checkbox.Group defaultValue={['Beijing']}>
              {datesList.map((item) => {
                return (
                  <Checkbox key={item.value} value={item.value}>
                    {({ checked }) => {
                      return (
                        <Tag key={item.value} color={checked ? 'arcoblue' : ''}>
                          {item.label}
                        </Tag>
                      );
                    }}
                  </Checkbox>
                );
              })}
            </Checkbox.Group>
          </Form.Item>
          <Form.Item
            label="地址"
            field="address"
            labelCol={{ span: 3 }}
            rules={[{ required: true, message: '请输入地址' }]}
          >
            <Input style={{ width: 400 }} placeholder="请输入地址" allowClear />
          </Form.Item>
          {/* <Form.Item
            label="公交方式"
            field="title"
            labelCol={{ span: 3 }}
            rules={[{ required: true, message: '请输入公交方式' }]}
          >
            <Input style={{ width: 400 }} placeholder="请输入公交方式" />
          </Form.Item> */}
          <Form.Item
            label="坐标拾取"
            field="coordinates"
            labelCol={{ span: 3 }}
            rules={[{ required: true, message: '请输入坐标' }]}
          >
            <div style={{ marginBottom: '20px' }}>
              <Input
                style={{ width: 200 }}
                placeholder="纬度"
                value={position.lat} // 显示纬度
                allowClear
              />
              <Input
                style={{ width: 200, marginLeft: '10px' }}
                placeholder="经度"
                value={position.lng} // 显示经度
                allowClear
              />
              <Button type="primary" style={{ marginLeft: '10px' }}>
                定位
              </Button>
            </div>
            <Spin tip="loading Data..." loading={loading}>
              <Map onGetPosition={onGetPosition}></Map>
            </Spin>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddAreaModal;
