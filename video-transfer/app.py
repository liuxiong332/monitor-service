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

    video_path = request.args.get("videoPath", "")

    if video_path != "":
        prefix, filename = os.path.split(video_path)
        new_path = os.path.join(prefix, filename.replace(".ts", ".mp4"))
        subprocess.run(["ffmpeg", "-i", video_path, "-c", "copy", "-y", new_path])
        
        
        file_name = "{}.mp4".format(int(datetime.datetime.now().timestamp()))
        client.fput_object(
            "videos", file_name, new_path, content_type="video/mp4"
        )
        return "http://12.168.1.152:9000/videos/{}".format(file_name)
    
    image_path = request.args.get("imagePath", "")
    if image_path != "":
        _, filename = os.path.split(image_path)
        _, extension = os.path.splitext(filename)

        file_name = "{}{}".format(int(datetime.datetime.now().timestamp()), extension)
        client.fput_object(
            "pictures", file_name, image_path,
        )
        return "http://12.168.1.152:9000/pictures/{}".format(file_name)