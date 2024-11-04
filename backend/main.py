import tempfile
from pathlib import Path
from typing import Optional

import cv2
import numpy as np
import requests
import uvicorn
from fastapi import FastAPI
from loguru import logger
from psycopg_pool import ConnectionPool
from pydantic import BaseModel

from core.config import conf

app = FastAPI()
pool = ConnectionPool(
    conninfo=(
        f"host={conf.pg_host} "
        f"port={conf.pg_port} "
        f"dbname={conf.pg_dbname} "
        f"user={conf.pg_user} "
        f"password={conf.pg_password} "
        f"sslmode=require"
    ),
    min_size=1,
    max_size=10,
)
# URL_SUFFIX used to limit size of image
URL_SUFFIX = "?fm=jpg&q=80&w=1080&h=1080&fit=max"


@app.get("/ping")
def ping():
    with pool.connection() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT 1")
            logger.info(cur.fetchone())


class Image(BaseModel):
    id: str
    url: str
    category: str
    description: str


class ImagesResponse(BaseModel):
    images: list[Image]


@app.get("/api/image/random")
def image_random(limit: int = 10) -> ImagesResponse:
    resp = ImagesResponse(images=[])
    with pool.connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT id,url,category,description FROM images ORDER BY RANDOM() LIMIT %s",
                (limit,),
            )
            for row in cur.fetchall():
                resp.images.append(
                    Image(
                        id=row[0],
                        url=row[1] + URL_SUFFIX,
                        category=row[2],
                        description=row[3],
                    )
                )
    return resp


@app.get("/api/image/search")
def image_search(
    query: str, limit: int = 10, category: Optional[str] = None
) -> ImagesResponse:
    query = "search_query: " + query
    resp = ImagesResponse(images=[])
    with pool.connection() as conn:
        with conn.cursor() as cur:
            sql = f"SELECT id,url,category,description,embedding<=>ai.ollama_embed('nomic-embed-text', %s, host=>'{conf.ollama_host}') as distance FROM images"
            if category:
                sql += " WHERE category = %s"
            sql += " ORDER BY distance LIMIT %s"
            cur.execute(
                sql,
                (query, category, limit) if category is not None else (query, limit),
            )
            for row in cur.fetchall():
                resp.images.append(
                    Image(
                        id=row[0],
                        url=row[1] + URL_SUFFIX,
                        category=row[2],
                        description=row[3],
                    )
                )
    return resp


class EditRequest(BaseModel):
    image_url: str
    polygons: list[list[list[float]]]
    prompt: str


class EditResponse(BaseModel):
    url: str


@app.post("/api/image/edit")
def image_edit(req: EditRequest):
    # Create a temporary directory
    with tempfile.TemporaryDirectory() as temp_dir:
        # Download the image
        response = requests.get(req.image_url)
        image_path = Path(temp_dir) / "image"
        with open(image_path, "wb") as f:
            f.write(response.content)

        # Load the image
        image = cv2.imread(str(image_path))

        # Create a white mask with the same size as the image
        mask = np.full(image.shape[:2], 255, dtype=np.uint8)

        # Draw polygons in black on the mask
        for polygon in req.polygons:
            points = np.int32(polygon)
            # Draw filled polygon in black (0)
            cv2.fillPoly(mask, [points], 0)

        # Save mask if needed
        mask_path = Path(temp_dir) / "mask.png"
        cv2.imwrite(str(mask_path), mask)

        with open(image_path, "rb") as image_file:
            with open(mask_path, "rb") as mask_file:
                resp = requests.post(
                    "https://api.ideogram.ai/edit",
                    data={
                        "prompt": req.prompt,
                        "model": "V_2_TURBO",
                        "magic_prompt_option": "ON",
                        "style_type": "AUTO",
                    },
                    files={
                        "image_file": image_file,
                        "mask": mask_file,
                    },
                    headers={"Api-Key": conf.ideogram_api_key},
                )
                resp.raise_for_status()
    data = resp.json()["data"][0]
    logger.info(f"edit image return data: {data}")
    return EditResponse(url=data["url"])


if __name__ == "__main__":
    logger.info("Starting server...")
    ping()
    # run server
    uvicorn.run(app, host="0.0.0.0", port=8000)
