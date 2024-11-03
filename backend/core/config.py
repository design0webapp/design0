from pydantic_settings import BaseSettings


class Config(BaseSettings):
    # pg
    pg_host: str
    pg_port: int
    pg_dbname: str
    pg_user: str
    pg_password: str
    # ollama
    ollama_host: str
    # ideogram
    ideogram_api_key: str


conf = Config()
