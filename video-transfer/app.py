from flask import Flask
from flask import request
import subprocess
import os
import time
import minio
import datetime

app = Flask(__name__)

@app.route("/")
def transfer_video():
    client = minio.Minio(
        "12.168.1.152:9000",
        access_key="minio",
        secret_key="minio123",
        secure=False,
    )

    video_path = request.args.get("path", "")

    
    prefix, filename = os.path.split(video_path)
    _, extension = os.path.splitext(filename)

    if extension == ".ts":
        new_path = os.path.join(prefix, filename.replace(".ts", ".mp4"))
        subprocess.run(["ffmpeg", "-i", video_path, "-c", "copy", "-y", new_path])
        
        file_name = "{}.mp4".format(int(datetime.datetime.now().timestamp()))
        client.fput_object(
            "videos", file_name, new_path, content_type="video/mp4"
        )
        return "http://12.168.1.152:9000/videos/{}".format(file_name)
    else:
        file_name = "{}{}".format(int(datetime.datetime.now().timestamp()), extension)
        client.fput_object(
            "pictures", file_name, video_path,
        )
        return "http://12.168.1.152:9000/pictures/{}".format(file_name)