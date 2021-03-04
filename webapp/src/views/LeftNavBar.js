import React, { useState, useMemo } from "react";
import { Menu, Button } from "antd";
import {
  AppstoreOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  PieChartOutlined,
  DesktopOutlined,
  ContainerOutlined,
  MailOutlined
} from "@ant-design/icons";
import { useHistory, useLocation } from "react-router-dom";

const ALL_KEYS = ["/monitor", "/device", "/history", "/system"];

export default function LeftNavBar() {
  let history = useHistory();
  let location = useLocation();

  const handleClick = ({ item, key }) => {
    history.push(key);
  };

  let selectKey = useMemo(() => {
    if (ALL_KEYS.indexOf(location)) {
      return [location];
    } else {
      return [ALL_KEYS[0]];
    }
  }, [location]);

  return (
    <Menu
      defaultSelectedKeys={["/monitor"]}
      selectedKeys={selectKey}
      mode="inline"
      theme="light"
      className="left-menu"
      onClick={handleClick}
    >
      <Menu.Item key="/monitor">
        <PieChartOutlined />
        <span>实时监控</span>
      </Menu.Item>
      <Menu.Item key="/models">
        <DesktopOutlined />
        <span>模型管理</span>
      </Menu.Item>
      <Menu.Item key="/device">
        <DesktopOutlined />
        <span>设备管理</span>
      </Menu.Item>
      <Menu.Item key="/history">
        <ContainerOutlined />
        <span>历史数据</span>
      </Menu.Item>
      <Menu.Item key="/system">
        <MailOutlined />
        <span>系统信息</span>
      </Menu.Item>
    </Menu>
  );
}
