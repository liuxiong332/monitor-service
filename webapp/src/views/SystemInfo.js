import React, { useState, useEffect, useMemo } from "react";
import { Table, Button, Typography, Form, Input, Drawer, Select } from "antd";
import { request } from "../common";

const { Title } = Typography;

export default function SystemInfo() {
  return (
    <div style={{ margin: "10px 10px" }}>
      <Title>系统信息</Title>
      <div>
      露天矿视频安全行为分析系统可以对露天煤矿进行系统监测，当出现未戴安全帽，离岗，车辆入侵，驾驶员接打电话等危险行为时，会进行报警。
      </div>
    </div>
  );
}
