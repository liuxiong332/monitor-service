import React, { useRef, useEffect, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "@videojs/http-streaming";
import { Tabs } from "antd";
import { request } from "../common";
import ResizeView from "./ResizeView";

const { TabPane } = Tabs;

function AllMonitor(props) {
  return (
    <Tabs defaultActiveKey="1">
      <TabPane style={{ width: 120 }} tab="所有网点" key="all"></TabPane>
      {props.devices.map(device => (
        <TabPane
          style={{ width: 120 }}
          tab={device.location}
          key={device.deviceId}
        ></TabPane>
      ))}
    </Tabs>
  );
}

function MyVideo(props) {
  let player = useRef();
  useEffect(() => {
    if (props.deviceId == null) {
      return;
    }
    // videojs("example-video").play();
    player.current = videojs("video" + props.deviceId, {
      // autoplay: true
      // fluid: true
      autoplay: true,
      muted: true
    });
    player.current.ready(function() {
      document.getElementById("video" + props.deviceId).click();
      player.current.play();
    });
  }, [props.deviceId]);

  useEffect(() => {
    player.current.width(props.width);
    player.current.height(props.height);
  }, [props.width, props.height]);

  return (
    <video-js
      id={"video" + props.deviceId}
      class="video-js vjs-default-skin device-video-column"
      controls={false}
    >
      {/* <source
        src="https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8"
        type="application/x-mpegURL"
      /> */}
      <source
        src={`http://localhost:8181/live/${props.deviceId}/live.m3u8`}
        type="application/x-mpegURL"
      />
    </video-js>
  );
}

function OneVideoMonitor(props) {
  if (props.deviceId == null) {
    return <div className="device-column" />;
  }
  return (
    <ResizeView>
      <MyVideo deviceId={props.deviceId} />
    </ResizeView>
  );
}

export function MultiVideoMonitor(props) {
  let devices = props.devices;
  if (props.devices.length > 1) {
    return (
      <div className="device-content">
        <div className="device-row">
          <OneVideoMonitor deviceId={devices[0] && devices[0].deviceId} />
          <OneVideoMonitor deviceId={devices[1] && devices[1].deviceId} />
        </div>
        <div className="device-row">
          <OneVideoMonitor deviceId={devices[2] && devices[2].deviceId} />
          <OneVideoMonitor deviceId={devices[3] && devices[3].deviceId} />
        </div>
      </div>
    );
  } else {
    return <OneVideoMonitor deviceId={devices[0] && devices[0].deviceId} />;
  }
}

export default function MyVideoMonitor() {
  let [devices, setDevices] = useState([]);

  useEffect(() => {
    request(`/devices`).then(items => {
      setDevices(items);
    });
  }, []);
  return (
    <React.Fragment>
      <AllMonitor devices={devices} />
      <MultiVideoMonitor devices={devices} />
    </React.Fragment>
  );
}
