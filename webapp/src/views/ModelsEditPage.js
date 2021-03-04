import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  Suspense
} from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "@videojs/http-streaming";
import { Table, Space, Row, Col, Typography, Drawer, Button, Modal, Form, Input, Upload, FormInstance } from "antd";
import { request } from "../common";
import ResizeView from "./ResizeView";
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';

const { Title } = Typography;

const sceneDataSource = [
  {
    key: '1',
    name: '安全帽识别',
    description: '识别不带安全帽的不当行为',
  },
  {
    key: '2',
    name: '违停车辆识别',
    description: '识别违停的车辆',
  },
];

const sceneColumns = [
  {
    title: '场景名字',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '场景描述',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    render: (text, record) => (
      <Space size="middle">
        <a>编辑</a>
        {record.key !== '1' && <a>删除</a>}
      </Space>
    ),
  },
];

const dataSource = [
  {
    key: '1',
    name: '默认安全帽模型',
    description: '识别安全帽',
    scene: "安全帽识别"
  },
];

const columns = [
  {
    title: '模型名字',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '模型描述',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: '所属场景',
    dataIndex: 'scene',
    key: 'description',
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    render: (text, record) => (
      <Space size="middle">
        <a>编辑</a>
        {record.key !== '1' && <a>删除</a>}
      </Space>
    ),
  },
];

export default function ModelsEditPage() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [sources, setSources] = useState(dataSource);
  

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = (values) => {
    setIsModalVisible(false);
    if (values.name != null && values.description != null) {
      setSources([...sources, { name: values.name, description: values.description }])
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <div style={{ margin: "10px 10px" }}>
        <Title>场景信息</Title>
        <Button type="primary" onClick={showModal} style={{ margin: "16px 0" }}>新增场景</Button>
        <Table
          dataSource={sceneDataSource}
          columns={sceneColumns}
          pagination={false}
        />
      </div>

      <div style={{ margin: "10px 10px" }}>
        <Title>模型信息</Title>
        <Button type="primary" onClick={showModal} style={{ margin: "16px 0" }}>新增模型</Button>
        <Table
          dataSource={sources}
          columns={columns}
          pagination={false}
        />
      </div>
      {isModalVisible && (
        <Drawer
          title="新建模型"
          width={500}
          onClose={handleCancel}
          visible={true}
          bodyStyle={{ paddingBottom: 80 }}
        >
          <ModelEdit onOK={handleOk}/>
        </Drawer>
      )}
    </>
  );
}

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const tailLayout = {
  wrapperCol: {
    offset: 4,
    span: 20
  }
};

export function ModelEdit(props) {
  const onFinish = values => {
    props.onOK(values)
    console.log("Success:", values);
  };

  const onFinishFailed = errorInfo => {
    console.log("Failed:", errorInfo);
  };

  const normFile = (e) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };
  return (
    <Form
      {...layout}
      name="basic"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        label="模型名字"
        name="name"
        rules={[{ required: true, message: '请输入模型名字' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="模型描述"
        name="description"
        rules={[{ required: true, message: '请输入模型描述' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="upload"
        label="模型文件"
        valuePropName="fileList"
        getValueFromEvent={normFile}
        rules={[{ required: true, message: '请输入模型描述' }]}
      >
        <Upload name="file" action="/upload.do" listType="picture">
          <Button icon={<UploadOutlined />}>点击上传</Button>
        </Upload>
      </Form.Item>


      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit" className="login-form-button">
          保存
        </Button>
      </Form.Item>
    </Form>
  );
}
