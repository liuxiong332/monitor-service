import React, { useState, useCallback } from "react";
import { request } from "../common";
import { Form, Input, Button, Checkbox } from "antd";
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

// home.jsx
export default props => {
  let history = useHistory();
  const onFinish = values => {
    console.log("Success:", values);
    let body = {
      username: values.username,
      password: values.password
    };
    request(`/login`, { method: "POST", body }).then(item => {
      localStorage.setItem("token", item.token);
      history.push("/");
    });
  };

  const onFinishFailed = errorInfo => {
    console.log("Failed:", errorInfo);
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
    >
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

      <Form.Item {...tailLayout} name="remember" valuePropName="checked">
        <Checkbox>记住我</Checkbox>
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit" className="login-form-button">
          登录
        </Button>
        或者 <a href="/signup">现在注册!</a>
      </Form.Item>
    </Form>
  );
};
