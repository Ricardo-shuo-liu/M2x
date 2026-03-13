from fastapi import FastAPI
from fastapi.responses import FileResponse,HTMLResponse,StreamingResponse
from fastapi.staticfiles import StaticFiles
import uvicorn
import os
from pydantic import BaseModel
from m2x import get_exec_file_dir
from m2x.Converter import converter
from weasyprint import HTML as WeasyHTML
import io
import importlib.resources
def start():
    app = FastAPI(
        title="deeptracer",
        description="link body",
    )
    # 创建节点
    try:
        # 获取m2x包内static目录的绝对路径
        with importlib.resources.files("m2x").joinpath("static") as static_dir:
            static_path = str(static_dir)
    # 本地开发时用相对路径
    except Exception:
        from m2x import get_exec_file_dir
        dir_path = os.path.dirname(get_exec_file_dir(__file__))
        static_path = os.path.join(dir_path, "static")
    # 获得路径
    app.mount("/static",StaticFiles(directory=static_path),name="static")
    # 读取模板和挂载文件
    @app.get("/")
    async def index():
        try:
            with importlib.resources.files("m2x").joinpath("static/index.html").open("r", encoding="utf-8") as f:
                html_content = f.read()
                return HTMLResponse(content=html_content)
        except Exception:
            return FileResponse(os.path.join(static_path, "index.html"))
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
            converters.content_html2pdf(htmlContent=html_content,savePath=pdf_buffer)
            pdf_buffer.seek(0)  # 重置文件指针到开头
            # 返回PDF文件流
            return StreamingResponse(
                pdf_buffer,
                media_type="application/pdf",
                headers={
                    "Content-Disposition": "attachment; filename=m2x_export.pdf"
                }
                )
        elif req.target_format == "docx":
            html_content = converters.content_md2html(req.content)
            word_buffer = io.BytesIO()
            converters.content_html2word(htmlContent=html_content,savePath=word_buffer)
            word_buffer.seek(0)  # 重置文件指针到开头
            # 返回word文件流
            return StreamingResponse(
                word_buffer,
                media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                headers={
                    "Content-Disposition": "attachment; filename=m2x_export.docx"
                })
        else:
            return {
        "success": False,
        "message": f"不支持的格式：{req.target_format}，仅支持html/pdf/docx",
        "supported_formats": ["html", "pdf", "docx"]
    }

    
    uvicorn.run(
        app,
        host="127.0.0.1",
        port=3000,
        log_level="info",
    )