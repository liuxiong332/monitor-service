FROM minio/mc
COPY ./minio-init.sh /minio-init.sh
ENV MINIO_HOST=localhost MINIO_PORT=9000 MINIO_ACCESS_KEY=minio MINIO_SECRET_KEY=minio123
ENTRYPOINT [ "sh", "/minio-init.sh" ]