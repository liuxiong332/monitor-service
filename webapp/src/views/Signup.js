import React, { useState, useCallback, useRef } from "react";
import { Form, Input, Button, Checkbox } from "antd";
import { request } from "../common";
import { useHistory } from "react-router-dom";

const layout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 16
  }
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16
  }
};

const CanNotSend = 0;
const SendAvailable = 1;
const SendPending = 2;

// home.jsx
export default props => {
  let [canSendCode, setCanSendCode] = useState(CanNotSend);
  let formRef = useRef();

  let history = useHistory();

  const handleSend = async () => {
    const email = formRef.current.getFieldValue("email");
    setCanSendCode(SendPending);
    setTimeout(() => {
      setCanSendCode(SendAvailable);
    }, 1000 * 60);

    try {
      await request(`/sendVerifyCode?email=${email}`, { method: "POST" });
    } catch (err) {
      console.error(err);
      setCanSendCode(SendAvailable);
    }
  };

  const onFinish = values => {
    console.log("Success:", values);

    let body = {
      email: values.email,
      username: values.username,
      password: values.password,
      verificationCode: values.verificationCode
    };
    request(`/signUp`, { method: "POST", body }).then(item => {
      localStorage.setItem("token", item.token);
      history.push("/");
    });
  };

  const onFinishFailed = errorInfo => {
    console.log("Failed:", errorInfo);
  };

  const onValuesChange = changedValues => {
    if (changedValues.hasOwnProperty("email")) {
      setCanSendCode(
        changedValues.email.length > 0 ? SendAvailable : CanNotSend
      );
    }
    console.log("Value changes", changedValues);
  };

  return (
    <Form
      {...layout}
      name="login-form"
      initialValues={{
        remember: true
      }}
      size="large"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      onValuesChange={onValuesChange}
      ref={formRef}
    >
      <Form.Item
        label="邮箱"
        name="email"
        rules={[
          {
            type: "email",
            message: "不是合法的邮箱!"
          },
          {
            required: true,
            message: "请输入正确的邮箱!"
          }
        ]}
      >
        <Input type="email" />
      </Form.Item>

      <Form.Item label="邮箱验证码" className="verify-area">
        <Form.Item
          name="verificationCode"
          noStyle
          rules={[{ required: true, message: "验证码不能为空!" }]}
        >
          <Input style={{ width: 260 }} placeholder="请输入邮箱验证码" />
        </Form.Item>

        <Button
          type="primary"
          ghost
          disabled={canSendCode !== SendAvailable}
          onClick={handleSend}
        >
          {canSendCode === SendPending ? "验证码已发送" : "发送验证码"}
        </Button>
      </Form.Item>

      <Form.Item
        label="用户名"
        name="username"
        rules={[
          {
            required: true,
            message: "请输入用户名!"
          }
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="密码"
        name="password"
        rules={[
          {
            required: true,
            message: "请输入密码!"
          },
          ({ getFieldValue }) => ({
            validator(rule, value) {
              if (value && value.length < 6) {
                return Promise.reject("密码至少为6位!");
              }
              return Promise.resolve();
            }
          })
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        label="确认密码"
        name="password2"
        rules={[
          {
            required: true,
            message: "请输入密码!"
          },
          ({ getFieldValue }) => ({
            validator(rule, value) {
              if (value && getFieldValue("password") !== value) {
                return Promise.reject("两次输入密码不一致!");
              }
              return Promise.resolve();
            }
          })
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item {...tailLayout} name="remember" valuePropName="checked">
        <Checkbox>记住我</Checkbox>
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit" className="login-form-button">
          注册
        </Button>
        已注册，<a href="/login">去登录!</a>
      </Form.Item>
    </Form>
  );
};
