from fastapi import FastAPI
from m2x import get_exec_file_dir

def start():
    app = FastAPI()
    pass
    @app.get("/")
    async def read_index():
        return 