CREATE TABLE IF NOT EXISTS images
(
    id          varchar PRIMARY KEY,
    url         varchar,
    category    varchar,
    description varchar,
    embedding   vector(768)
);

CREATE INDEX IF NOT EXISTS images_category_idx ON images (category);

CREATE INDEX IF NOT EXISTS images_embedding_idx ON images
    USING hnsw (embedding vector_cosine_ops);