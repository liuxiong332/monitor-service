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
    name: '未戴安全帽检测',
    description: '识别不带安全帽的不当行为',
  },
  {
    key: '2',
    name: '离岗检测',
    description: '识别离开关键岗位的不当行为',
  },
  {
    key: '3',
    name: '车辆入侵检测',
    description: '识别违停的车辆或者错误进入的车辆',
  },
  {
    key: '4',
    name: '驾驶员接打电话检测',
    description: '识别驾驶员接打电话的不当行为',
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

export function SceneEditPage() {
  const [isSceneModalVisible, setIsSceneModalVisible] = useState(false);

  const [sceneSources, setSceneSources] = useState(sceneDataSource);
  const [editSource, setEditSource] = useState(null);

  const showSceneModal = () => {
    setIsSceneModalVisible(true);
  };

  const handleSceneOk = (values) => {
    setIsSceneModalVisible(false);
    if (values.name != null && values.description != null) {
      setSceneSources([...sceneSources, { name: values.name, description: values.description }])
    }
  };

  const handleSceneCancel = () => {
    setIsSceneModalVisible(false);
  };
  
  const handleEdit = (record) => {
    setEditSource(record);
    setIsSceneModalVisible(true);
  };

  const handleRemove = (recordId) => {
    const index = sceneSources.findIndex(item => item.key === recordId)
    if (index !== -1) setSceneSources([...sceneSources.slice(0, index), ...sceneSources.slice(index + 1)]);
  };

  const columns = [
    ...sceneColumns.slice(0, sceneColumns.length - 1), 
    {
      ...sceneColumns[sceneColumns.length - 1],
      render: (text, record) => (
        <Space size="middle">
          <a onClick={}>编辑</a>
          {record.key !== '1' && <a>删除</a>}
        </Space>
      ),
    }
  ];

  return (
    <>
      <div style={{ margin: "10px 10px" }}>
        <Title>场景信息</Title>
        <Button type="primary" onClick={showSceneModal} style={{ margin: "16px 0" }}>新增场景</Button>
        <Table
          dataSource={sceneSources}
          columns={sceneColumns}
          pagination={false}
        />
      </div>
      {isSceneModalVisible && (
        <Drawer
          title="新建场景"
          width={500}
          onClose={handleSceneCancel}
          visible={true}
          bodyStyle={{ paddingBottom: 80 }}
        >
          <SceneEdit onOK={handleSceneOk} editSource={editSource}/>
        </Drawer>
      )}
    </>
  );
}

export function ModelsOnlyEditPage() {
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

export default function ModelsEditPage() {
  
  return (
    <>
      <SceneEditPage />
      <ModelsOnlyEditPage />
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

export function SceneEdit(props) {
  const onFinish = values => {
    props.onOK(values)
    console.log("Success:", values);
  };

  const onFinishFailed = errorInfo => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Form
      {...layout}
      name="basic"
      initialValues={props.editSource}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        label="场景名字"
        name="name"
        rules={[{ required: true, message: '请输入场景名字' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="场景描述"
        name="description"
        rules={[{ required: true, message: '请输入场景描述' }]}
      >
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
