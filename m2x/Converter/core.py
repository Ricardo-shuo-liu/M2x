import markdown
import os
from m2x import get_exec_file_dir
from m2x.Converter import HTML2X

class converter():
    
    def _get_content(self,
                     MdPath:str)->str:
        """
        获得指定地址的内容
        """
        with open(MdPath,'r') as fp:
            content = fp.read()
        return content
    def _md_to_html(self,
                    MdPath:str=None)->str:
        """
        将md转化为html格式
        """
        MdContent = self._get_content(MdPath)
        html_content = markdown.markdown(MdContent,extensions=['tables', 'fenced_code','toc','admonition','footnotes','nl2br','smarty'])     
        return HTML2X.CleanHTML.escape_html_code(html_content)
   
    def content_md2html(self,content):
        """
        将md的content转化为html
        """
        html_content = markdown.markdown(content,extensions=['tables', 'fenced_code','toc','admonition','footnotes','nl2br','smarty'])
        return HTML2X.CleanHTML.escape_html_code(html_content)
    def content_html2pdf(self,
                         htmlContent,
                         savePath):
        """
        将html的content转化为pdf存储在指定位置
        """
        transformer = HTML2X.HTMLToPdfConverter()
        transformer.convert_html_to_pdf(html_content=htmlContent,save_path=savePath)
    def content_html2word(self,
                          htmlContent,
                          savePath):
        """
        将html的content转化为word存储在指定位置
        """
        transformer = HTML2X.HTMLToWordConverter()
        transformer.convert_html_to_word(
            html_content=htmlContent
            ,save_path=savePath)
    def md_to_PDF(self,
                MdPath:str,
                savePath:str):
        """
        将md内容转化成为PDF
        """
        htmlContent = self._md_to_html(MdPath)
        transformer = HTML2X.HTMLToPdfConverter()
        transformer.convert_html_to_pdf(html_content=htmlContent,save_path=savePath)
    def md_to_WORD(self,
                   MdPath:str,
                   savePath:str):
        """
        将md内容转化为word
        """
        htmlContent = self._md_to_html(MdPath)
        transformer = HTML2X.HTMLToWordConverter()
        transformer.convert_html_to_word(
            html_content=htmlContent
            ,save_path=savePath)
        
