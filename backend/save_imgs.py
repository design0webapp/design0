import csv
import json
import os.path

import psycopg
import requests
import tqdm
from dotenv import load_dotenv

load_dotenv()

OLLAMA_HOST = os.getenv("OLLAMA_HOST")
PG_HOST = os.getenv("PG_HOST")
PG_PORT = os.getenv("PG_PORT")
PG_DBNAME = os.getenv("PG_DBNAME")
PG_USER = os.getenv("PG_USER")
PG_PASSWORD = os.getenv("PG_PASSWORD")

f = open("./dataset/photos.tsv")
f.readline()
reader = csv.reader(f, delimiter="\t")
conn = psycopg.connect(
    host=PG_HOST,
    port=int(PG_PORT),
    dbname=PG_DBNAME,
    user=PG_USER,
    password=PG_PASSWORD,
    sslmode="require",
)
with conn.cursor() as cur:
    cur.execute("SELECT 1;")
    print(cur.fetchone())

for row in tqdm.tqdm(reader):
    id_ = row[0]
    url = row[2]
    # load json from dataset/jsons
    filename = f"./dataset/jsons/{id_}.json"
    if os.path.exists(filename):
        with open(filename) as f_json:
            data = json.load(f_json)
            category = data["category"]
            description = data["description"]
            # get embedding from ollama
            r = requests.post(
                f"{OLLAMA_HOST}/api/embeddings",
                json={
                    "model": "nomic-embed-text",
                    "prompt": f"search_document: {description}",
                },
            )
            r.raise_for_status()
            embedding = r.json()["embedding"]
            with conn.cursor() as cur:
                cur.execute(
                    "INSERT INTO images (id, url, description, category, embedding) "
                    "VALUES (%s, %s, %s, %s, %s)",
                    (id_, url, description, category, embedding),
                )
                conn.commit()
