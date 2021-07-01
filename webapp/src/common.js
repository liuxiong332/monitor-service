const INNER_HOST = process.env.REACT_APP_INNER_HOST;

const IS_INNER_NET = INNER_HOST ? new RegExp(INNER_HOST.replace('.', '\\.')).test(window.location.host) : false // window.location.host
const IS_LOCAL_HOST = /localhost/.test(window.location.host)

const BROWSER_DOMAIN = /([^:]+)/.exec(window.location.host)[0]

const SERVICE_HOST = process.env.REACT_APP_SERVICE_HOST || BROWSER_DOMAIN;

const LOCAL_SERVICE_PORT = process.env.REACT_APP_SERVICE_PORT || 8088
const REMOTE_SERVICE_PORT = process.env.REACT_APP_REMOTE_SERVICE_PORT || 8088
const SERVICE_PORT = IS_INNER_NET || IS_LOCAL_HOST ? LOCAL_SERVICE_PORT : REMOTE_SERVICE_PORT;

const MINIO_HOST = process.env.REACT_APP_MINIO_HOST || BROWSER_DOMAIN;
const MINIO_PORT = Number(process.env.REACT_APP_MINIO_PORT || 9000);

const LOCAL_VIDEO_PORT = process.env.REACT_APP_LOCAL_VIDEO_PORT || 8090
const REMOTE_VIDEO_PORT = process.env.REACT_APP_REMOTE_VIDEO_PORT || 8090

export const Domain = `http://${SERVICE_HOST}:${SERVICE_PORT}`;
export const VideoDomain = `http://${SERVICE_HOST}:${IS_INNER_NET || IS_LOCAL_HOST ? LOCAL_VIDEO_PORT : REMOTE_VIDEO_PORT}`;
export const MinioDomain = MINIO_HOST;
export const MinioPort = MINIO_PORT;

export class ServerError extends Error {
  constructor(code, msg) {
    super(msg);
    this.code = code;
  }
}

export async function request(path, { method, body, headers } = {}) {
  headers = { ...headers, "Content-Type": "application/json" };
  if (typeof body === "object") {
    body = JSON.stringify(body);
  }
  let res = await fetch(Domain + path, { method, body, headers });
  let result = await res.json();
  if (result.code !== 200) {
    throw new ServerError(result.code, result.errMsg);
  }
  return result.data;
}

export function uploadUrl(uploadName) {
  return Domain + `/models/upload?uploadPath=${uploadName}`;
}