import React, { useState, useEffect, useMemo } from "react";
import { Table, Button, Typography, Form, Input, Drawer, Select } from "antd";
import { request } from "../common";

const { Title } = Typography;
const { Option } = Select;

const deviceTypeMap = {
  1: "未戴安全帽检测",
  2: "离岗检测",
  3: "车辆入侵检测",
  4: "驾驶员接打电话检测",
}

const statusMap = {
  0: "打开",
  1: "关闭",
}

const columns = [
  {
    title: "名称",
    dataIndex: "name",
    key: "name"
  },
  // {
  //   title: "设备密码",
  //   dataIndex: "password",
  //   key: "password"
  // },
  {
    title: "设备IP",
    dataIndex: "serviceUrl",
    key: "serviceUrl"
  },
  {
    title: "网点",
    dataIndex: "location",
    key: "location"
  },
  {
    title: "应用场景",
    dataIndex: "deviceType",
    key: "deviceType",
    render: (value) => deviceTypeMap[value]
  },
  {
    title: "路径",
    dataIndex: "path",
    key: "path"
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    render: (value) => statusMap[value]
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
  let [scenes, setScenes] = useState(null)

  useEffect(() => {
    request('/scenes').then(items => setScenes(items))
  }, []);

  useEffect(() => {
    handleRefresh();
  }, []);

  const handleRefresh = () => {
    setEditDevice(null);
    request(`/devices`).then(items => {
      items = items.map(item => ({ ...item, status: item["status"].toString() }))
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
      ...columns.slice(0, 3),
      {
        title: "应用场景",
        dataIndex: "deviceType",
        key: "deviceType",
        render: (value) => {
          console.log("Now scenes", scenes)
          let scene = scenes.find(scene => scene.sceneId === parseInt(value));
          if (scene != null) { return scene.name; } else { return null; }
        }
      },
      ...columns.slice(4, columns.length - 1),
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
  }, [scenes]);
  return (
    <div style={{ margin: "10px 10px" }}>
      <Title>设备信息</Title>
      <Button onClick={handleAdd} type="primary" style={{ margin: "16px 0" }}>
        添加设备
      </Button>
      {scenes != null && <Table
        rowKey="deviceId"
        dataSource={dataSource}
        pagination={false}
        columns={useColumns}
      />}
      {editDevice && (
        <Drawer
          title={editDevice.deviceId ? "修改设备" : "创建新设备"}
          width={500}
          onClose={handleClose}
          visible={true}
          bodyStyle={{ paddingBottom: 80 }}
        >
          <DeviceEdit editDevice={editDevice} scenes={scenes} onRefresh={handleRefresh} />
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
    let device = {...values, status: parseInt(values["status"]), deviceType: parseInt(values["deviceType"])};
    if (props.editDevice.deviceId) {
      request(`/devices/${props.editDevice.deviceId}`, {
        method: "PUT",
        body: device
      }).then(() => {
        props.onRefresh();
      });
    } else {
      request(`/devices/`, { method: "POST", body: device }).then(() => {
        props.onRefresh();
      });
    }
  };

  const onFinishFailed = errorInfo => {
    console.log("Failed:", errorInfo);
  };
  console.log("edit device ", props.editDevice)
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
      <Form.Item label="设备IP" name="serviceUrl">
        <Input />
      </Form.Item>
      <Form.Item label="场景" name="deviceType">
        <Select
          placeholder="选择场景" allowClear
        >
          {props.scenes.map(scene => <Option key={scene.sceneId} value={scene.sceneId}>{scene.name}</Option>)}
        </Select>
      </Form.Item>
      {/* <Form.Item label="设备密码" name="password">
        <Input />
      </Form.Item> */}

      <Form.Item label="路径" name="path">
        <Input />
      </Form.Item>

      <Form.Item label="网点" name="location">
        <Input />
      </Form.Item>

      <Form.Item label="状态" name="status">
        <Select
          placeholder="选择状态"
        >
          <Option value="0">打开</Option>
          <Option value="1">关闭</Option>
        </Select>
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit" className="login-form-button">
          保存
        </Button>
      </Form.Item>
    </Form>
  );
}
