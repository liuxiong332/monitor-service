import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  Suspense,
  useMemo
} from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "@videojs/http-streaming";
import { Tabs } from "antd";
import { request } from "../common";
import ResizeView from "./ResizeView";
import { AllMonitor } from "./VideoMonitor";
import minioClient from "../minio";
import { DatePicker } from 'antd';
import moment from "moment";

const { TabPane } = Tabs;

function getAllDevices() {
  return new Promise((resolve, reject) => {
    var stream = minioClient.listObjectsV2('pictures', '', false, "");
    let objs = [];
    stream.on('data', function (obj) { objs.push(obj.prefix) });
    stream.on('error', function (err) { reject(err) });
    stream.on('end', function () {
      resolve(objs);
    });
  });
}

function formatDate(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2)
    month = '0' + month;
  if (day.length < 2)
    day = '0' + day;

  return [year, month, day].join('-');
}

const minioBucket = 'pictures';
function getImgsByDate(devicePrefix, date, addImg) {
  let datePrefix = formatDate(date);
  console.log("date:", datePrefix);
  var stream = minioClient.listObjectsV2('pictures', devicePrefix + datePrefix, true, "");
  stream.on('data', function (obj) {
    // console.log("list obj", obj);
    var publicUrl = minioClient.protocol + '//' + minioClient.host + ':' + minioClient.port + '/' + minioBucket + '/' + obj.name;
    addImg(publicUrl);
  });
  return new Promise((resolve, reject) => {
    stream.on('end', function () {
      resolve();
    });
    stream.on('error', function (err) {
      reject(err);
      console.error(err);
    });
  });
}

function getAllImgsByDate(prefixs, date, addImg) {
  return new Promise((resolve, reject) => {

    if (prefixs.length === 0) return resolve();
    let prefix = prefixs[0];
    getImgsByDate(prefix, date, addImg).then(
      () => getAllImgsByDate(prefixs.slice(1), date, addImg).then(resolve),
      reject
    );
  });
}

export default function PictureShower() {
  let [devices, setDevices] = useState([]);
  let [showDevices, setShowDevices] = useState([]);
  let [imgUrls, setImgUrls] = useState([]);
  let [curDate, setCurDate] = useState(() => moment());

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

  const devicePrefixs = useMemo(() => {
    return showDevices.map(item => "device_" + item.deviceId + "/");
  }, [showDevices]);
  console.log("device prefixs", devicePrefixs);
  // minioClient.listBuckets(function (err, buckets) {
  //   if (err) return console.log(err)
  //   console.log('buckets :', buckets)
  // });

  // getAllDevices().then(v => console.log("all devices:", v));
  useEffect(() => {
    let newUrls = [];
    getAllImgsByDate(devicePrefixs, curDate, (url) => {
      if (newUrls.indexOf(url) === -1) {
        newUrls.push(url);
      }
      console.log("new url ", newUrls)
    }).then(() => setImgUrls(newUrls));
  }, [curDate, devicePrefixs]);

  return (
    <React.Fragment>
      <div className="picture-tab-header">
        <AllMonitor devices={devices} onChange={handleChange} />
        <DatePicker size="small" value={curDate} onChange={setCurDate} />
      </div>
      <div className="img-content">
        {imgUrls.map(url => <img key={url} src={url} width="200" height="200" />)}
        {imgUrls.length === 0 && <div>没有要展示的图片</div>}
      </div>
    </React.Fragment>
  );
}
