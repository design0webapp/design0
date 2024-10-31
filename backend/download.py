import csv
import os

import requests
import tqdm
from tenacity import retry


@retry
def download_image(_url: str):
    r = requests.get(_url)
    with open("./dataset/photos/" + id_ + ".jpg", "wb") as f_out:
        f_out.write(r.content)


existing_ids = set()
# list all jpg files in ./dataset/photos
for filename in os.listdir("./dataset/photos/"):
    if filename.endswith(".jpg"):
        existing_ids.add(filename.split(".")[0])

f = open("./dataset/photos.tsv")
f.readline()
reader = csv.reader(f, delimiter="\t")
for row in tqdm.tqdm(reader):
    id_ = row[0]
    if id_ in existing_ids:
        continue
    url = row[2] + "?fm=jpg&q=80&w=1080&h=1080&fit=max"
    download_image(url)
