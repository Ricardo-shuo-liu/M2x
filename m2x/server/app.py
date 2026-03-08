from fastapi import FastAPI,Request
from fastapi.templating import Jinja2Templates
from fastapi.responses import FileResponse,HTMLResponse
from fastapi.staticfiles import StaticFiles
import uvicorn
import os
from m2x import get_exec_file_dir
def start():
    app = FastAPI(
        title="deeptracer",
        description="link body",
    )
    # 创建节点
    dir_path = os.path.dirname(get_exec_file_dir(__file__))
    static_path = os.path.join(dir_path,"static")
    # 获得路径
    app.mount("/static",StaticFiles(directory=static_path),name="static")
    # 读取模板和挂载文件
    @app.get("/")
    async def index():
        try:
            return FileResponse(
                os.path.join(static_path,"index.html"),
                media_type="text/html" 
            )
        except Exception:
            HTMLResponse(content="<h1>404 - 文件不存在</h1>", status_code=404)
    uvicorn.run(
        app,
        host="127.0.0.1",
        port=8000,
        log_level="info",
    )

