from markdown2 import Markdown
from weasyprint import HTML
from docx import Document
from docx.shared import Inches


class converter():
    def _md_to_html(self,
                    MdPath:str=None)->str:
        """
        将md转化为html格式
        """
        MdContent = self._get_content(MdPath)
        markdowner = Markdown()
        html_content = markdowner.convert(MdContent)

        return html_content
        # self._save_html(html_content)
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
        
