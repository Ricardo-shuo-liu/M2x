from fastapi import FastAPI,Request
from fastapi.templating import Jinja2Templates
from fastapi.responses import FileResponse,HTMLResponse
from fastapi.staticfiles import StaticFiles
import uvicorn
import os
from pydantic import BaseModel
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
    class ConvertRequest(BaseModel):
        content: str
        target_format: str = "html"
    @app.post("/api/convert-md")
    async def convert_md(req: ConvertRequest):
        # 这里替换为你的本地 MD 转化函数
        # 示例：简单转化（实际替换为你的 M2x 工具逻辑）
        if req.target_format == "html":
            converted_content = f"<!-- Converted by M2x -->\n{req.content.upper()}"
        else:
            converted_content = req.content
        return {
            "success": True,
            "converted_content": converted_content,
            "target_format": req.target_format
        }

    
    uvicorn.run(
        app,
        host="127.0.0.1",
        port=3000,
        log_level="info",
    )

if __name__ == "__main__":
    start()