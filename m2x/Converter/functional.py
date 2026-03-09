import markdown
from weasyprint import HTML
from docx import Document
from docx.shared import Inches
import os
from m2x import get_exec_file_dir

class converter():
    

    def escape_html_code(self,html_content):
        import re
        content_unescaped = (
            html_content.replace("&amp;", "&")
            .replace("&lt;", "<")
            .replace("&gt;", ">")
            .replace("&quot;", '"')
            .replace("&#39;", "'")
        )
        code_pattern = re.compile(
            r'(<pre\s*[^>]*>\s*<code\s*[^>]*>)(.*?)(</code\s*>\s*</pre\s*>)',
            re.DOTALL | re.IGNORECASE
        )

        def replace_func(match):
            prefix = match.group(1)
            code = match.group(2)
            suffix = match.group(3)
            code_escaped = (
                code.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
            )
            return f"{prefix}{code_escaped}{suffix}"
        final_html = code_pattern.sub(replace_func, content_unescaped)
        dir_path  = get_exec_file_dir(__file__)
        extension_path = os.path.join(dir_path,"extension.html")

        with open(extension_path,'r',encoding='utf-8') as fp:
            extension = fp.read()

        return extension + final_html
    def _md_to_html(self,
                    MdPath:str=None)->str:
        """
        将md转化为html格式
        """
        MdContent = self._get_content(MdPath)

        html_content = markdown.markdown(MdContent,extensions=['tables', 'fenced_code','toc','admonition','footnotes','nl2br','smarty'])

        
        return self.escape_html_code(html_content)
    def content_md2html(self,content):
        """
        将md的content转化为html
        """
        html_content = markdown.markdown(content,extensions=['tables', 'fenced_code','toc','admonition','footnotes','nl2br','smarty'])
        return self.escape_html_code(html_content)
    def content_md2word(self,content):
        """
        将md的content转化为word格式
        """
        pass
    def content_md2pdf(self,content):
        """
        将md的content转化为pdf格式
        """
        pass
    def _get_content(self,
                     MdPath:str)->str:
        """
        获得指定地址的内容
        """
        with open(MdPath,'r') as fp:
            content = fp.read()
        return content
    def _save_html(self,
                   save_path,
                   html_content):
        """
        将html内容存储到指定文件里面     
        """
        with open(save_path,'w') as fr:
            fr.write(html_content)
    def _md_to_PDF(self,
                MdPath:str,
                savePath:str):
        """
        将md内容转化成为PDF
        """
        htmlContent = self._md_to_html(MdPath)
        HTML(string=htmlContent).write_pdf(savePath)
    def _md_to_WORD(self,
                   MdPath:str,
                   savePath:str):
        """
        将md内容转化为word
        """
        htmlContent = self._md_to_html(MdPath)
        doc = Document()# 创建转化对象
        doc.add_paragraph(htmlContent)
        doc.save(savePath)
        
