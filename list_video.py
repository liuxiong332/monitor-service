import os
import requests

if __name__ == "__main__":
    for root, dir, files in os.walk("/home/optical/videos"):
        fns = [f for f in files if os.path.splitext(f)[1] == ".ts"]
        for f in fns:
            file_path = "{}/{}".format(root, f)
            print(file_path)
            requests.post("http://localhost:8088/app/sendEvent?filePath={}".format(file_path))