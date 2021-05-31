from flask import Flask
from flask import request
import subprocess
import os
import time
import minio
import datetime
import json

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


@app.route("/startDS", methods=['POST'])
def start_ds():
    print('start deepstream')
    device_info = request.get_json(force=True)
    print(device_info)
    subprocess.run(['pkill', 'deepstream-app'])
    
    with open('/home/optical/test_config/devices.json', 'w') as f:
        f.write(json.dumps(device_info, indent=4))

    subprocess.run(['/home/optical/test_config/test'], cwd='/home/optical/test_config/')

    for index in range(1, len(device_info['source']) + 1):
        model_file = '/home/optical/test_config/model_{}/deepstream_config.txt'.format(index)
        log_fn = open('dslog_{}.log'.format(index), 'w')
        subprocess.Popen(['/opt/nvidia/deepstream/deepstream-5.0/sources/objectDetector_Yolo/deepstream-app', '-c', model_file], stdout=log_fn, stderr=log_fn, cwd='/home/optical/test_config/')
    return 'OK'
