import { MinioDomain, MinioPort } from "./common";
var Minio = require('minio')

export default new Minio.Client({
    endPoint: MinioDomain,
    port: MinioPort,
    useSSL: false,
    accessKey: process.env.REACT_APP_MINIO_ACCESS_KEY || 'minioadmin',
    secretKey: process.env.REACT_APP_MINIO_SECRET_KEY || 'minioadmin'
});
