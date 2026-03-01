@logtitle
def test_md2html():
    from m2x import Converter
    converters = Converter.converter()
    htmlContent = converters._md_to_html("test.md")
    converters._save_html(save_path="test.html",html_content=htmlContent)