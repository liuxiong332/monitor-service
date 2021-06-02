from flask import Flask
from flask import request
import subprocess
import os
import time
import minio
import datetime
import json
import re
import requests
from flask_apscheduler import APScheduler

app = Flask(__name__)
scheduler = APScheduler()

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


@scheduler.task('interval', id='do_job_1', seconds=300, misfire_grace_time=900)
def job1():
    print('start interval task')
    with open('/home/optical/test_config/devices.json') as f:
       device_info = json.load(f)

    for i in range(len(device_info['source'])):
        files = os.listdir('/home/optical/img/{}'.format(i))
        sorted_f = sorted([f for f in files if f.endswith('.jpg')], key=lambda fn: int(re.search(r"\w+_(\d+)\.\w+", fn).group(1)))
        img_fn = None
        if len(sorted_f) > 0:
            img_fn = sorted_f[-1]

        print('Get image {}'.format(img_fn))

        use_rate = True

        hls_fn = None

        valid_fs = []

        if use_rate and img_fn is not None:
            hls_n = int(re.search(r"\w+_(\d+)\.\w+", img_fn).group(1)) / 180
            hls_fn = "live%.5d.ts" % (hls_n)
            hls_path = os.path.join('/mnt/hls/hls_{}'.format(i + 1), hls_fn)

            print('Try fetch {}'.format(hls_path))
            if not os.path.isfile(hls_path):
                hls_path = None

            img_path = os.path.join('/home/optical/img/{}'.format(i), img_fn) if img_fn is not None else None
            valid_fs = [fp for fp in [img_path, hls_path] if fp is not None]

        elif img_fn is not None:
            hls_dir = '/mnt/hls/hls_{}'.format(i + 1)
            hls_files = os.listdir(hls_dir) if os.path.isdir(hls_dir) else []
            sorted_hls = sorted(hls_files, key=lambda fn: int(re.match(r"live(\d+)\.\w+", fn).group(1))) 

            hls_fn = None
            if len(sorted_hls) > 0:
                hls_fn = sorted_hls[-1]

            print('Get video {}'.format(hls_fn))

            img_path = os.path.join('/home/optical/img/{}'.format(i), img_fn) if img_fn is not None else None
            video_path = os.path.join('/mnt/hls/hls_{}'.format(i + 1), hls_fn) if hls_fn is not None else None

            valid_fs = [fp for fp in [img_path, video_path] if fp is not None]

        if len(valid_fs) > 0:
            print('Send event with {}'.format(valid_fs))
            requests.post('http://localhost:8088/app/sendMyEvent', json={'deviceId': i, 'filePath': valid_fs})

        print('Will delete images')
        for f in files:
            os.remove(os.path.join('/home/optical/img/{}'.format(i), f))
        print('Done delete images')

        # print('Will delete videos')
        # for f in hls_files:
            # os.remove(os.path.join('/mnt/hls/hls_{}'.format(i + 1), f)) 
        # print('Done delete videos')

scheduler.init_app(app)
scheduler.start()
