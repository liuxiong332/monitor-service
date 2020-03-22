export const Domain = "http://localhost:8080";

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
