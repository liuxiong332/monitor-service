import { MinioDomain, MinioPort } from "./common";
var Minio = require('minio')

export default new Minio.Client({
    endPoint: MinioDomain,
    port: MinioPort,
    useSSL: false,
    accessKey: 'minioadmin',
    secretKey: 'minioadmin'
});
