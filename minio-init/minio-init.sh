mc config host add myminio http://$MINIO_HOST:$MINIO_PORT $MINIO_ACCESS_KEY $MINIO_SECRET_KEY || exit 1
mc mb --ignore-existing myminio/pictures || exit 1
mc policy set public myminio/pictures || exit 1