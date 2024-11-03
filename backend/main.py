from typing import Optional

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
async def ping():
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
async def image_random(limit: int = 10) -> ImagesResponse:
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
async def image_search(
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


if __name__ == "__main__":
    logger.info("Starting server...")
    ping()
    # run server
    uvicorn.run(app, host="0.0.0.0", port=8000)
