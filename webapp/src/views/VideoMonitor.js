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
import { Tabs } from "antd";
import { request } from "../common";
import ResizeView from "./ResizeView";

const { TabPane } = Tabs;

export function AllMonitor(props) {
  function callback(key) {
    props.onChange(key);
    console.log(key);
  }

  return (
    <Tabs defaultActiveKey="all" onChange={callback}>
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
    return () => {
      player.current.dispose();
    };
  }, [props.deviceId]);

  useEffect(() => {
    player.current.width(props.width);
    player.current.height(props.height);
  }, [props.width, props.height]);

  const VIDEOS = [
    `http://12.168.1.152:8080/live/files/10.mp4`, 
    `http://12.168.1.152:8080/live/files/12.mp4`,
    `http://12.168.1.152:8080/live/files/14.mp4`,
    `http://12.168.1.152:8080/live/files/16.mp4`,
  ]
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
      {/* <source
        src={`http://12.168.1.152:8080/live/10.mp4`}
        type="application/x-mpegURL"
      /> */}
      <source
        src={VIDEOS[props.deviceId % 4]}
        type="video/mp4"
      />
    </video-js>
  );
}

function OneVideoMonitor(props) {
  if (props.deviceId == null) {
    return <div className="device-column" />;
  }
  return (
    <ResizeView key={props.deviceId}>
      <MyVideo deviceId={props.deviceId} />
    </ResizeView>
  );
}

export function MultiVideoMonitor(props) {
  let devices = props.devices;
  if (props.devices.length > 1) {
    return (
      <Suspense>
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
      </Suspense>
    );
  } else {
    return (
      <Suspense>
        <div className="device-content">
          <div className="device-row">
            <OneVideoMonitor deviceId={devices[0] && devices[0].deviceId} />
          </div>
        </div>
      </Suspense>
    );
  }
}

export default function MyVideoMonitor() {
  let [devices, setDevices] = useState([]);
  let [showDevices, setShowDevices] = useState([]);

  useEffect(() => {
    request(`/devices`).then(items => {
      setDevices(items);
      setShowDevices(items);
    });
  }, []);

  const handleChange = useCallback(
    key => {
      console.log("change to key", key);
      if (key === "all") {
        setShowDevices(devices);
      } else {
        let device = devices.find(d => d.deviceId.toString() === key);
        console.log("Will show device", device);
        setShowDevices([device]);
      }
    },
    [devices]
  );
  return (
    <React.Fragment>
      <AllMonitor devices={devices} onChange={handleChange} />
      <MultiVideoMonitor devices={showDevices} />
    </React.Fragment>
  );
}
