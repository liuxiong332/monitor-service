import React, { useState, useEffect, useMemo } from "react";
import { Table, Button, Typography, Form, Input, Drawer } from "antd";
import { request } from "../common";

const { Title } = Typography;

const columns = [
  {
    title: "设备名称",
    dataIndex: "name",
    key: "name"
  },
  {
    title: "设备密码",
    dataIndex: "password",
    key: "password"
  },
  {
    title: "设备服务",
    dataIndex: "serviceUrl",
    key: "serviceUrl"
  },
  {
    title: "网点",
    dataIndex: "location",
    key: "location"
  },
  {
    title: "类型",
    dataIndex: "deviceType",
    key: "deviceType"
  },
  {
    title: "Action",
    dataIndex: "",
    key: "x",
    render: () => <a>Delete</a>
  }
];

export default function DeviceManager() {
  let [dataSource, setDataSource] = useState([]);
  let [editDevice, setEditDevice] = useState(null);

  useEffect(() => {
    handleRefresh();
  }, []);

  const handleRefresh = () => {
    setEditDevice(null);
    request(`/devices`).then(items => {
      setDataSource(items);
    });
  };

  const handleAdd = () => {
    setEditDevice({});
  };

  const handleClose = () => {
    setEditDevice(null);
  };

  const handleModify = record => {
    setEditDevice(record);
  };

  const handleDelete = record => {
    request(`/devices/${record.deviceId}`, { method: "DELETE" }).then(() => {
      handleRefresh();
    });
  };

  const useColumns = useMemo(() => {
    return [
      ...columns.slice(0, columns.length - 1),
      {
        title: "动作",
        dataIndex: "",
        key: "x",
        render: (text, record, index) => (
          <div>
            <Button
              type="primary"
              style={{ marginRight: 10 }}
              onClick={handleModify.bind(this, record)}
            >
              修改
            </Button>
            <Button type="primary" onClick={handleDelete.bind(this, record)}>
              删除
            </Button>
          </div>
        )
      }
    ];
  }, []);
  return (
    <div style={{ margin: "10px 10px" }}>
      <Title>设备信息</Title>
      <Button onClick={handleAdd} type="primary" style={{ margin: "16px 0" }}>
        添加设备
      </Button>
      <Table
        rowKey="deviceId"
        dataSource={dataSource}
        pagination={false}
        columns={useColumns}
      />
      {editDevice && (
        <Drawer
          title={editDevice.deviceId ? "修改设备" : "创建新设备"}
          width={500}
          onClose={handleClose}
          visible={true}
          bodyStyle={{ paddingBottom: 80 }}
        >
          <DeviceEdit editDevice={editDevice} onRefresh={handleRefresh} />
        </Drawer>
      )}
    </div>
  );
}

const layout = {
  labelCol: {
    span: 4
  },
  wrapperCol: {
    span: 20
  }
};
const tailLayout = {
  wrapperCol: {
    offset: 4,
    span: 20
  }
};

export function DeviceEdit(props) {
  const onFinish = values => {
    console.log("Success:", values);
    if (props.editDevice.deviceId) {
      request(`/devices/${props.editDevice.deviceId}`, {
        method: "PUT",
        body: values
      }).then(() => {
        props.onRefresh();
      });
    } else {
      request(`/devices/`, { method: "POST", body: values }).then(() => {
        props.onRefresh();
      });
    }
  };

  const onFinishFailed = errorInfo => {
    console.log("Failed:", errorInfo);
  };
  return (
    <Form
      {...layout}
      initialValues={props.editDevice}
      name="device"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item label="设备名称" name="name">
        <Input />
      </Form.Item>
      <Form.Item label="设备密码" name="password">
        <Input />
      </Form.Item>
      <Form.Item label="设备服务" name="serviceUrl">
        <Input />
      </Form.Item>
      <Form.Item label="类型" name="deviceType">
        <Input />
      </Form.Item>
      <Form.Item label="网点" name="location">
        <Input />
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit" className="login-form-button">
          保存
        </Button>
      </Form.Item>
    </Form>
  );
}
