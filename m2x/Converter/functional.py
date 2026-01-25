from markdown2 import Markdown
from weasyprint import HTML

class converter():
    def __init__(self):
        pass
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
                   html_content):
        """
        将html内容存储到指定文件里面     
        """
        save_path = "test.html"
        with open(save_path,'w') as fr:
            fr.write(html_content)
    def _md_PDF(self,
                MdPath:str,
                savePath:str):
        htmlContent = self._md_to_html(MdPath)
        HTML(string=htmlContent).write_pdf(savePath)
    def _md_WORD(self,
                   htmlPath:str,
                   savePath:str):
        pass
