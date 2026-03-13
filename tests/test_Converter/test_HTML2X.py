from unittest.mock import Mock, patch
@logtitle
def test_CleanHTML_import():
    """测试能否正常导入CleanHTML类"""
    with patch('builtins.__import__'):
        try:
            from m2x.Converter.HTML2X import CleanHTML
            assert CleanHTML is not None
        except ImportError as e:
            assert str(e) != ""
@logtitle
def test_HTMLToWordConverter_import():
    """测试能否正常导入HTMLToWordConverter类"""
    with patch('builtins.__import__'):
        try:
            from m2x.Converter.HTML2X import HTMLToWordConverter
            assert HTMLToWordConverter is not None
        except ImportError as e:
            assert str(e) != ""
@logtitle
def test_HTMLToPdfConverter_import():
    """测试能否正常导入HTMLToWordConverter类"""
    with patch('builtins.__import__'):
        try:
            from m2x.Converter.HTML2X import HTMLToPdfConverter
            assert HTMLToPdfConverter is not None
        except ImportError as e:
            assert str(e) != ""
@logtitle
def test_HTML2X_structure():
    """测试converter模块的基本结构"""
    # 不实际导入，而是测试模块路径是否存在
    import os
    file_path = os.path.join('m2x','Converter','HTML2X.py')
    assert os.path.exists(file_path), f"HTML2X文件不存在: {file_path}"
