import {
  Form,
  Input,
  Checkbox,
  Link,
  Button,
  Space,
} from '@arco-design/web-react';
import { FormInstance } from '@arco-design/web-react/es/Form';
import { IconLock, IconUser } from '@arco-design/web-react/icon';
import React, { useEffect, useRef, useState } from 'react';
import useStorage from '@/utils/useStorage';
import useLocale from '@/utils/useLocale';
import locale from './locale';
import { loginApi } from '../../api/user';
import styles from './style/index.module.less';

export default function LoginForm() {
  const formRef = useRef<FormInstance>();
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginParams, setLoginParams, removeLoginParams] =
    useStorage('loginParams');

  const t = useLocale(locale);

  const [rememberPassword, setRememberPassword] = useState(!!loginParams);

  function afterLoginSuccess(userInfo) {
    // 记住密码
    if (rememberPassword) {
      setLoginParams(JSON.stringify(userInfo));
    } else {
      removeLoginParams();
    }
    // 记录登录状态
    localStorage.setItem('userStatus', 'login');
    // 跳转首页
    window.location.href = '/';
  }

  const toLogin = async (params: any) => {
    setErrorMessage('');
    setLoading(true);
    try {
      const userInfo = await loginApi({
        username: params.userName,
        password: params.password,
      });
      console.log('ret', userInfo);
      afterLoginSuccess(userInfo);
    } catch (error) {
      setLoading(false);
      console.log('error:', error);
    }
  };

  function onSubmitClick() {
    formRef.current
      .validate()
      .then((values) => {
        toLogin(values);
      })
      .catch((error) => {
        console.error('表单验证失败:', error);
        console.log('验证失败的字段:', error.fields);
      });
  }

  // 读取 localStorage，设置初始值
  useEffect(() => {
    const rememberPassword = !!loginParams;
    setRememberPassword(rememberPassword);
    if (formRef.current && rememberPassword) {
      const parseParams = JSON.parse(loginParams);
      formRef.current.setFieldsValue(parseParams);
    }
  }, [loginParams]);

  return (
    <div className={styles['login-form-wrapper']}>
      <div className={styles['login-form-title']}>{t['login.form.title']}</div>
      <div className={styles['login-form-sub-title']}>
        {t['login.form.title']}
      </div>
      <div className={styles['login-form-error-msg']}></div>
      <Form
        className={styles['login-form']}
        layout="vertical"
        ref={formRef}
        initialValues={{ userName: '', password: '' }}
      >
        <Form.Item
          field="userName"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input
            prefix={<IconUser />}
            placeholder="用户名"
            onPressEnter={onSubmitClick}
          />
        </Form.Item>
        <Form.Item
          field="password"
          rules={[{ required: true, message: '请输入密码' }]}
        >
          <Input.Password
            prefix={<IconLock />}
            placeholder="密码"
            onPressEnter={onSubmitClick}
          />
        </Form.Item>
        <Space size={16} direction="vertical">
          <div className={styles['login-form-password-actions']}>
            <Checkbox checked={rememberPassword} onChange={setRememberPassword}>
              记住密码
            </Checkbox>
          </div>
          <Button type="primary" long onClick={onSubmitClick} loading={loading}>
            登录
          </Button>
        </Space>
      </Form>
    </div>
  );
}
