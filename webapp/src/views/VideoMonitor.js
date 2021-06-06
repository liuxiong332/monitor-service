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
import { Tabs, Space } from "antd";
import { request, VideoDomain } from "../common";
import ResizeView from "./ResizeView";

const { TabPane } = Tabs;

export function AllMonitor(props) {
  function callback(key) {
    props.onChange(key);
    console.log(key);
  }

  return (
    <Tabs className="device-tabs" defaultActiveKey="all" onChange={callback}>
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
    `${VideoDomain}/hls_0/`, 
    `${VideoDomain}/live/files/work.mp4`,
    `${VideoDomain}/live/files/enter.mp4`,
    `${VideoDomain}/live/files/makecall.mp4`,
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
      <source
        src={`http://222.74.238.102:8090/hls_${props.index}/live.m3u8`}
        type="application/x-mpegURL"
      />
      {/* <source
        src={VIDEOS[(props.deviceId - 1) % 4]}
        type="video/mp4"
      /> */}
    </video-js>
  );
}

function OneVideoMonitor(props) {
  if (props.device == null || props.scenes == null) {
    return <div className="device-column" />;
  }
  let scene = props.scenes.find(s => s.sceneId === props.device.deviceType);

  if (scene && scene.name === "驾驶员接打电话检测") {
    const noVideoStyle = { flex: 1, height: "100%", position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }
    return (
      <div className="device-column" style={noVideoStyle}>
        没有监控视频
      </div>
    );
  }
  
  return (
    <ResizeView key={props.device.deviceId}>
      <MyVideo deviceId={props.device.deviceId} index={props.devices.indexOf(props.device)} />
    </ResizeView>
  );
}

export function MultiVideoMonitor(props) {
  let devices = props.devices;
  let showDevices = props.showDevices;
  let scenes = props.scenes;

  let filterDevices = devices.filter(d => {
    let scene = scenes.find(s => s.sceneId === d.deviceType)
    return scene && scene.name !== "驾驶员接打电话检测";
  })

  if (showDevices.length > 1) {
    return (
      <Suspense>
        <div className="device-content">
          <div className="device-row">
            <OneVideoMonitor device={showDevices[0]} devices={filterDevices} scenes={scenes} />
            <OneVideoMonitor device={showDevices[1]} devices={filterDevices} scenes={scenes} />
          </div>
          <div className="device-row">
            <OneVideoMonitor device={showDevices[2]} devices={filterDevices} scenes={scenes} />
            <OneVideoMonitor device={showDevices[3]} devices={filterDevices} scenes={scenes}/>
          </div>
        </div>
      </Suspense>
    );
  } else {
    return (
      <Suspense>
        <div className="device-content">
          {showDevices[0] && <div style={{margin: "0 0 10px 0"}}>{showDevices[0].name}正在进行监控</div>}
          
          <div className="device-row">
            <OneVideoMonitor device={showDevices[0]} devices={filterDevices} scenes={scenes}/>
          </div>
        </div>
      </Suspense>
    );
  }
}

export default function MyVideoMonitor() {
  let [devices, setDevices] = useState(null);
  let [scenes, setScenes] = useState(null);
  let [showDevices, setShowDevices] = useState(null);

  useEffect(() => {
    request(`/devices`).then(items => {
      setDevices(items);
      setShowDevices(items);
    });
    request(`/scenes`).then(items => {
      setScenes(items);
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

  if (devices == null || scenes == null || showDevices == null) return null;
  return (
    <React.Fragment>
      <AllMonitor devices={devices} onChange={handleChange} />
      <MultiVideoMonitor devices={devices} showDevices={showDevices} scenes={scenes}/>
    </React.Fragment>
  );
}
