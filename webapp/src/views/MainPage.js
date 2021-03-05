import React, { useEffect } from "react";
import { Layout } from "antd";
import { useHistory, Switch, Route } from "react-router-dom";
import LeftNavBar from "./LeftNavBar";
import DeviceManager from "./DeviceManager";
import VideoMonitor from "./VideoMonitor";
import ModelsEditPage from "./ModelsEditPage";
import ResizeView from "./ResizeView";
import HistoryWatch from "./HistoryWatch";

const { Header, Footer, Sider, Content } = Layout;

function MyHeader() {
  const history = useHistory();
  const onExit = () => {
    localStorage.removeItem("token");
    history.push("/login");
  };

  return (
    <React.Fragment>
      <span>智能安全监控系统</span>
      <span className="exit-btn" onClick={onExit}>
        退出
      </span>
    </React.Fragment>
  );
}

export default function MainPage() {
  const history = useHistory();
  useEffect(() => {
    if (localStorage.getItem("token") == null) {
      history.push("/login");
    }
  }, [history]);

  return (
    <Layout className="main-layout">
      <Header>
        <MyHeader />
      </Header>
      <Layout>
        <Sider>
          <LeftNavBar />
        </Sider>
        <Content>
          <Switch>
            <Route exact path="/">
              <VideoMonitor />
            </Route>
            <Route exact path="/models">
              <ModelsEditPage />
            </Route>
            <Route exact path="/monitor">
              <VideoMonitor />
            </Route>
            <Route exact path="/device">
              <DeviceManager />
            </Route>
            <Route exact path="/history">
              <HistoryWatch />
            </Route>
          </Switch>
        </Content>
      </Layout>
    </Layout>
  );
}
