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

function MyApp() {
  return (
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
  );
}

export default MyApp;
