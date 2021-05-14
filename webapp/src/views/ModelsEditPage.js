import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  Suspense,
  useMemo,
  useImperativeHandle,
  forwardRef
} from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "@videojs/http-streaming";
import { Table, Space, Row, Col, Typography, Drawer, Button, Modal, Form, Input, Upload, Select } from "antd";
import { request, uploadUrl } from "../common";
import ResizeView from "./ResizeView";
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';

const { Title } = Typography;
const { Option } = Select;

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

const modelColumns = [
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
    key: 'sceneId',
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

export function SceneEditPage(props, ref) {
  const [isSceneModalVisible, setIsSceneModalVisible] = useState(false);

  const [sceneSources, setSceneSources] = useState(sceneDataSource);
  const [editSource, setEditSource] = useState(null);
  const [models, setModels] = useState(null);

  useEffect(() => {
    handleRefresh()
  }, []);

  const handleRefresh = () => {
    request(`/scenes`).then(items => {
      setSceneSources(items);
    });
    request('/models').then(items => setModels(items));
  }

  useImperativeHandle(ref, () => ({
    refresh: handleRefresh,
  }));

  const showSceneModal = () => {
    setIsSceneModalVisible(true);
    setEditSource(null)
  };

  const handleSceneOk = async (values) => {
    setIsSceneModalVisible(false);
    if (values.name != null && values.description != null && values.sceneId == null) {
      await request("/scenes", { method: "POST", body: { name: values.name, description: values.description, modelId: values.modelId } });
    } else if (values.name != null && values.description != null) {
      await request(`/scenes/${values.sceneId}`, { method: "PUT", body: { name: values.name, description: values.description, modelId: values.modelId } });
    }
    handleRefresh();
  };

  const handleSceneCancel = () => {
    setIsSceneModalVisible(false);
  };

  const handleTryEdit = (record) => {
    console.log("Will edit record ", record)
    request('/models').then(items => setModels(items));
    setEditSource(record);
    setIsSceneModalVisible(true);
  };

  const handleRemove = async (recordId) => {
    await request(`/scenes/${recordId}`, { method: "DELETE" })
    handleRefresh()
  };

  const columns = useMemo(() => (
    [
      ...sceneColumns.slice(0, sceneColumns.length - 1),
      {
        title: '默认模型',
        dataIndex: 'modelId',
        key: 'modelId',
        render: (text, record) => {
          if (models == null) return null;
          let model = models.find(item => item.id === text);
          if (model != null) { return model.name } else { return null }
        },
      },
      {
        ...sceneColumns[sceneColumns.length - 1],
        render: (text, record) => (
          <Space size="middle">
            <a onClick={() => handleTryEdit(record)}>编辑</a>
            {<a onClick={() => handleRemove(record.sceneId)}>删除</a>}
          </Space>
        ),
      }
    ]
  ), [models]);

  return (
    <>
      <div style={{ margin: "10px 10px" }}>
        <Title>场景信息</Title>
        <Button type="primary" onClick={showSceneModal} style={{ margin: "16px 0" }}>新增场景</Button>
        {models != null && <Table
          dataSource={sceneSources}
          columns={columns}
          pagination={false}
          dataIndex="sceneId"
        />}
      </div>
      {isSceneModalVisible && (
        <Drawer
          title={editSource == null ? "新建场景" : "编辑场景"}
          width={500}
          onClose={handleSceneCancel}
          visible={true}
          bodyStyle={{ paddingBottom: 80 }}
        >
          <SceneEdit onOK={handleSceneOk} editSource={editSource} models={models}/>
        </Drawer>
      )}
    </>
  );
}

export function ModelsOnlyEditPage(props) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [sources, setSources] = useState(dataSource);
  const [editSource, setEditSource] = useState(null);

  const [sceneSources, setSceneSources] = useState([]);

  useEffect(() => {
    handleRefresh()

    request(`/scenes`).then(items => {
      setSceneSources(items);
    });
  }, []);

  const handleRefresh = () => {
    props.onRefresh()
    request(`/models`).then(items => {
      setSources(items);
    });
  }

  const showModal = () => {
    setEditSource(null);
    setIsModalVisible(true);
  };

  const handleOk = async (values) => {
    setIsModalVisible(false);
    if (values.name != null && values.description != null && values.id == null) {
      await request("/models", { method: "POST", body: values });
    } else if (values.name != null && values.description != null) {
      await request(`/models/${values.id}`, { method: "PUT", body: values });
    }
    handleRefresh()
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleTryEdit = (record) => {
    console.log("Will edit record ", record)
    setEditSource(record);
    setIsModalVisible(true);
  };

  const handleRemove = async (recordId) => {
    await request(`/models/${recordId}`, { method: "DELETE" })
    handleRefresh()
  };

  const columns = [
    ...modelColumns.slice(0, modelColumns.length - 2),
    {
      ...sceneColumns[sceneColumns.length - 2],
      render: (text, record) => {
        console.log("edit source:", sceneSources, record)
        if (sceneSources == null) return "";
        let item = sceneSources.find(item => item.sceneId === record.sceneId)
        if (item != null) return item.name;
        return "";
      }
    },
    {
      ...modelColumns[modelColumns.length - 1],
      render: (text, record) => (
        <Space size="middle">
          <a onClick={() => handleTryEdit(record)}>编辑</a>
          {<a onClick={() => handleRemove(record.id)}>删除</a>}
        </Space>
      ),
    }
  ];

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
          title={editSource == null ? "新建模型" : "编辑模型"}
          width={500}
          onClose={handleCancel}
          visible={true}
          bodyStyle={{ paddingBottom: 80 }}
        >
          <ModelEdit onOK={handleOk} editSource={editSource} sceneSources={sceneSources}/>
        </Drawer>
      )}
    </>
  );
}

const SceneEditRefPage = forwardRef(SceneEditPage);

export default function ModelsEditPage() {
  const scenePageRef = useRef(null);
  return (
    <>
      <SceneEditRefPage ref={scenePageRef}/>
      <ModelsOnlyEditPage onRefresh={() => scenePageRef.current.refresh()}/>
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
    props.onOK({ ...props.editSource, ...values })
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

      {props.editSource != null && <Form.Item
        label="模型选择"
        name="modelId"
      >
        <Select
          placeholder="选择默认模型"
          allowClear
        >
          {props.models.filter(d => d.sceneId === props.editSource.sceneId).map(item => 
            <Option key={item.id} value={item.id}>{item.name}</Option>)
          }
        </Select>
      </Form.Item>}

      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit" className="login-form-button">
          保存
        </Button>
      </Form.Item>
    </Form>
  );
}

export function ModelEdit(props) {
  let uploadName = null;
  if (props.editSource && props.editSource.modelPath) {
    uploadName = props.editSource.modelPath;
  } else {
    uploadName = uuidv4();
  }

  const onFinish = values => {
    let newProps = { ...props.editSource, ...values };
    if (newProps.modelPath == null && values.upload && values.upload.length > 0) {
      newProps.modelPath = uploadName;
    }
    delete newProps.upload
    props.onOK(newProps);
    console.log("Success:", values, newProps);
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
      initialValues={props.editSource}
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
        label="场景"
        name="sceneId"
        rules={[{ required: true, message: '请选择场景' }]}
      >
        <Select
          placeholder="选择一个场景"
          allowClear
        >
          {props.sceneSources.map(item => <Option key={item.sceneId} value={item.sceneId}>{item.name}</Option>)}
        </Select>
      </Form.Item>

      <Form.Item
        name="upload"
        label="模型文件"
        valuePropName="fileList"
        getValueFromEvent={normFile}
        rules={[{ required: false, message: '请输入模型描述' }]}
      >
        <Upload name="file" action={uploadUrl(uploadName)} listType="picture">
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
