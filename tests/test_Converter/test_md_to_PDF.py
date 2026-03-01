@logtitle
def test_md2pdf():
    from m2x.Converter import converter
    converters = converter()
    converters._md_to_PDF("test.md","test.pdf")