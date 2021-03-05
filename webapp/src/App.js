import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import "antd/dist/antd.css";
import Login from "./views/Login";
import Signup from "./views/Signup";
import Main from "./views/MainPage";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory
} from "react-router-dom";
import { ConfigProvider } from "antd";
import zhCN from 'antd/lib/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn'

moment.locale('zh-CN');

function MyApp() {
  return (
    <ConfigProvider locale={zhCN}>
    <Router>
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/signup">
          <Signup />
        </Route>
        <Route path="/">
          <Main></Main>
        </Route>
      </Switch>
    </Router>
    </ConfigProvider>
  );
}

export default MyApp;
