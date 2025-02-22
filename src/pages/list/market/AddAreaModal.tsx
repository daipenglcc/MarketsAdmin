import React, { useState, useEffect, useRef } from 'react';
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
  const [formRef] = Form.useForm();

  useEffect(() => {
    if (visible && record) {
      formRef.setFieldsValue({
        coordinates: '天安门', // 根据 record 的内容回显大集名称
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

      formRef.setFieldsValue({
        coordinates: '',
      });
    };

    fetchAreas(); // 组件加载时调用接口
  }, []); // 只在组件挂载时调用

  const handleOk = async () => {
    try {
      let values = await formRef.validate();
      console.log('values', values);
      let objData = {
        name: values.name,
        area_id: values.area_id,
        region: values.area_id,
        dates: values.dates,
        position: position,
      };
      return;
      if (record) {
        objData = {
          ...objData,
          id: record.id,
        };
      }

      const ret = await onOk(objData); // 调用父组件传入的 onOk
      if (ret) {
        formRef.resetFields(); // 重置表单
      }
    } catch (error) {
      console.log('表单验证失败:', error);
    }
  };

  const handClose = async () => {
    formRef.resetFields(); // 重置表单
    await onClose();
  };

  const [position, setPosition] = useState({
    lat: '39.908820249133356',
    lng: '116.39747208772576',
  });

  const onGetPosition = (position) => {
    setPosition(position); // 更新经纬度状态
  };

  const [loading, setLoading] = React.useState(false); // table
  const mapRef = useRef(null); // 创建 ref
  const areaSearch = () => {
    if (mapRef.current) {
      mapRef.current.searchByKeyword(formRef.getFieldValue('coordinates')); // 调用子组件的方法
    }
  };

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
        <Form style={{ width: '100%' }} form={formRef} scrollToFirstError>
          <Form.Item
            label="大集名称"
            field="name"
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
          <Form.Item
            label="坐标拾取"
            labelCol={{ span: 3 }}
            // rules={[{ required: true }]}
          >
            <div className={styles['ip-info']}>
              <Form.Item
                field="coordinates"
                // rules={[{ required: true, message: '请输入位置' }]}
                style={{ width: 200, marginBottom: 0 }}
              >
                <Input
                  placeholder="请输入"
                  allowClear
                  onChange={(keyword) => {
                    console.log('E', keyword);
                    if (!keyword) {
                      areaSearch();
                    }
                  }}
                  onClear={areaSearch}
                />
              </Form.Item>
              <Button
                type="primary"
                style={{ marginLeft: '10px', marginRight: '10px' }}
                onClick={areaSearch}
              >
                定位
              </Button>
              <Input
                style={{ width: 240, height: 32 }}
                placeholder="纬度"
                value={'纬度：' + position.lat} // 显示纬度
                disabled
              />
              <Input
                style={{ width: 240, height: 32, marginLeft: '10px' }}
                placeholder="经度"
                value={'经度：' + position.lng} // 显示经度
                disabled
              />
            </div>
            <Spin tip="loading Data..." loading={loading}>
              <Map
                ref={mapRef}
                positionData={position}
                onGetPosition={onGetPosition}
              ></Map>
            </Spin>
          </Form.Item>
          {/* </div> */}
        </Form>
      </Modal>
    </>
  );
};

export default AddAreaModal;
