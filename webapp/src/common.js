const SERVICE_HOST = process.env.REACT_APP_SERVICE_HOST || "localhost";
const SERVICE_PORT = process.env.REACT_APP_SERVICE_PORT || 8080;

const MINIO_HOST = process.env.REACT_APP_MINIO_HOST || "127.0.0.1";
const MINIO_PORT = Number(process.env.REACT_APP_MINIO_PORT || 9000);

export const Domain = `http://${SERVICE_HOST}:${SERVICE_PORT}`;
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
