import React, { useState, useEffect, useMemo } from "react";
import { Table, Button, Typography, Form, Input, Drawer, Image, Checkbox, Space, DatePicker } from "antd";
import { request } from "../common";
import moment from 'moment';

const { Title } = Typography;

const dataSource = [
  {
    key: '1',
    name: '张三',
    belong: "A部门",
    type: "安全帽识别",
    position: "机修车间",
    time: "2021-03-05 12:00",
    duration: "5分钟",
    black: "否",
    image: "http://12.168.1.152:9000/pictures/hat1.png",
  },
  {
    key: '2',
    name: '李四',
    belong: "B部门",
    type: "安全帽识别",
    position: "机修车间",
    time: "2021-03-06 12:00",
    duration: "1分钟",
    black: "否",
    image: "http://12.168.1.152:9000/pictures/hat2.png",
  },
  {
    key: '3',
    name: '王五',
    belong: "C部门",
    type: "安全帽识别",
    position: "机修车间",
    time: "2021-03-06 12:00",
    duration: "2分钟",
    black: "否",
    image: "http://12.168.1.152:9000/pictures/hat3.png",
  },
  {
    key: '4',
    name: '王五',
    belong: "C部门",
    type: "车辆入侵",
    position: "机修车间门口",
    time: "2021-03-07 12:00",
    duration: "30秒",
    black: "否",
    image: "http://12.168.1.152:9000/pictures/car.png",
  },
  {
    key: '5',
    number: '京A1233222',
    name: '王五',
    belong: "C部门",
    type: "接打电话",
    position: "工程车辆驾驶室",
    time: "2021-03-10 12:00",
    duration: "2分钟",
    speed: "60",
    card: "A34212",
    black: "否",
    image: "http://12.168.1.152:9000/pictures/call.png",
  },
  {
    key: '6',
    number: '京A1233222',
    name: '王五',
    belong: "D部门",
    type: "调度室值守",
    position: "调度室",
    time: "2021-03-10 12:00",
    duration: "2分钟",
    speed: "60",
    card: "A34212",
    black: "否",
    image: "http://12.168.1.152:9000/pictures/work.png",
  },
];

const columns = [
  // {
  //   title: "车牌号",
  //   dataIndex: "number",
  //   key: "number"
  // },
  // {
  //   title: "司机名字",
  //   dataIndex: "name",
  //   key: "name"
  // },
  {
    title: "所属机构",
    dataIndex: "belong",
    key: "belong"
  },
  {
    title: "违章类型",
    dataIndex: "type",
    key: "type"
  },
  {
    title: "检测位置",
    dataIndex: "position",
    key: "position"
  },
  {
    title: "报警时间",
    dataIndex: "time",
    key: "time"
  },
  {
    title: "报警持续时间",
    dataIndex: "duration",
    key: "duration"
  },
  // {
  //   title: "车速",
  //   dataIndex: "speed",
  //   key: "speed"
  // },
  // {
  //   title: "驾驶证照",
  //   dataIndex: "card",
  //   key: "card"
  // },
  // {
  //   title: "司机黑名单",
  //   dataIndex: "black",
  //   key: "black"
  // },
  {
    title: "浏览",
    dataIndex: "",
    key: "x",
    render: (record) => (
      <Image
        width={20}
        src={record.image}
      />
    )
  }
];

const plainOptions = ['安全帽识别', '车辆入侵', '接打电话', "调度室值守"];

const { RangePicker } = DatePicker;

export default function DeviceManager() {
  let [options, setOptions] = useState(plainOptions);

  let [timeRange, setTimeRange] = useState(null);

  function onChange(checkedValues) {
    setOptions(checkedValues);
  }

  const handleRangeChange = (value) => {
    setTimeRange(value)
  };

  let filterSrc = dataSource.filter(item => 
    options.indexOf(item.type) !== -1 
    && (timeRange == null || moment(item.time) >= timeRange[0] && moment(item.time) <= timeRange[1])
  )
  return (
    <div style={{ margin: "10px 10px" }}>
      <Space size={12} style={{ margin: "10px 0", justifyContent: "space-between", display: "flex"}}>
        <Checkbox.Group options={plainOptions} value={options} onChange={onChange} />
        <RangePicker onChange={handleRangeChange}/>
      </Space>
      
      <Table
        rowKey="deviceId"
        dataSource={filterSrc}
        columns={columns}
      />
   
    </div>
  );
}
