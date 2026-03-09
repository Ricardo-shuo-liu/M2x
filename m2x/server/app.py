from fastapi import FastAPI,Request
from fastapi.templating import Jinja2Templates
from fastapi.responses import FileResponse,HTMLResponse,StreamingResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
from pydantic import BaseModel
from m2x import get_exec_file_dir
from m2x.Converter import converter
from weasyprint import HTML as WeasyHTML
import io
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
        converters = converter()
        if req.target_format == "html":
            converted_content = converters.content_md2html(req.content)
            return {
            "success": True,
            "converted_content": converted_content,
            "target_format": req.target_format
        }
        elif req.target_format == "pdf":
            html_content = converters.content_md2html(req.content)
            pdf_buffer = io.BytesIO()
            WeasyHTML(string=html_content).write_pdf(pdf_buffer)
            pdf_buffer.seek(0)  # 重置文件指针到开头
            # 返回PDF文件流
            return StreamingResponse(
                pdf_buffer,
                media_type="application/pdf",
                headers={
                    "Content-Disposition": "attachment; filename=m2x_export.pdf"
                }
                )
        elif req.target_format == "word":
            pass
        else:
            pass

    
    uvicorn.run(
        app,
        host="127.0.0.1",
        port=3000,
        log_level="info",
    )

if __name__ == "__main__":
    start()