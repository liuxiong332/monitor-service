import json
import os
import requests

if __name__ == "__main__":
    for root, dir, files in os.walk(os.path.expanduser("~/images")):
        fns = [f for f in files if os.path.splitext(f)[1] == ".png"]
        for f in fns:
            file_path = "{}/{}".format(root, f)
            print(file_path)
            requests.post("http://localhost:8088/app/sendMyEvent", json={
                'deviceId': 0,  
                'filePath': [file_path]
            })