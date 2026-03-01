@logtitle
def test_md2word():
    from m2x.Converter import converter
    converters = converter()
    converters._md_to_WORD("test.md","test.docx")
    # raise TimeoutError("this just a test for test.log")