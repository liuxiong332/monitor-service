import React, { useState, useCallback } from 'react';
import { App, View, Page, List, ListInput, ListButton, Button, Link, Block, Row, Col } from 'framework7-react';
import { request } from "./common";

// home.jsx
export default (props) => {
  let [username, setUsername] = useState("");
  let [password, setPassword] = useState("");
 
  const handleUsername = useCallback(event => {
    setUsername(event.target.value);
  });
  const handlePassword = useCallback(event => {
    setPassword(event.target.value);
  });
   
  const handleLogin = useCallback(() => {
    let body = {
      username, password
    };
    request(`/login`, { method: "POST", body }).then(item => {
      localStorage.setItem("token", item.token);
      props.$f7router.navigate("/commodities");
    });
  });
  return (
    <Page name="home">
      <List noHairlinesMd>
        
        <ListInput
          label="Name"
          type="text"
          placeholder="Your name"
          value={username}
          onChange={handleUsername}
          clearButton
        />

        <ListInput
          label="Enter Password"
          type="password"
          placeholder="Your password"
          value={password}
          onChange={handlePassword}
          clearButton
        />
        
      </List>

      <Block>
        <Row tag="p">
          <Col tag="span">
            <Button fill onClick={handleLogin}>登录</Button>
          </Col>
        </Row>

        <Row tag="p">
          <Col tag="span">
            <Link href="/signup/">注册</Link>
          </Col>
        </Row>
      </Block>
    </Page>
  );
};