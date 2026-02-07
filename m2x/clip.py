import argparse
from .Converter import converter
import sys
from pathlib import Path
def main():
    """
    命令行api接口
    """
    parse = argparse.ArgumentParser(
        prog='m2x',
        description="M2x:A lightweight, free Markdown converter",
        epilog="examples:m2x --server | m2x --pdf MarkdownPath savePath"
    )
    parse.add_argument("-s","--server",
                       action="store_true",
                       help="Whether to start the FastAPI service.")

    group = parse.add_mutually_exclusive_group(required=False)
    group.add_argument("-p","--pdf",nargs=2,metavar=("MarkdownPath","savePath"),help="Start MD-to-PDF Conversion")
    group.add_argument("-w","--word",nargs=2,metavar=("MarkdownPath","savePath"),help="Start MD-to-Word Conversion")
    args = parse.parse_args()
    if args.server:
        if args.pdf is not None or args.word is not None:
            parse.error("--server mode does not support -p/--pdf or -w/--word parameters")
            sys.exit(1)
        else:
            print("目前功能没有完成")
            sys.exit(1)
    
    if args.pdf is None and args.word is None:
        parse.error("Must specify -p/--pdf or -w/--word (with MarkdownPath and SavePath) when not using --server")
        sys.exit(1)
    def validate_path(md_path: str) -> Path:
        """校验Markdown文件路径是否存在且为.md文件"""
        path = Path(md_path).resolve()
        if not path.exists():
            raise FileNotFoundError(f"Markdown file not found: {md_path}")
        if path.suffix.lower() not in ['.md', '.markdown']:
            raise ValueError(f"Not a valid Markdown file: {md_path}")
        return path
    try:
        converters = converter()
        if args.pdf:
            md_path = validate_path(args.pdf[0])
            save_path = Path(args.pdf[1]).resolve()
            converters._md_to_PDF(MdPath=str(md_path), savePath=str(save_path))  # 建议用小写方法名符合PEP8
            print(f"Successfully converted MD to PDF: {save_path}")
        elif args.word:
            md_path = validate_path(args.word[0])
            save_path = Path(args.word[1]).resolve()
            converters._md_to_WORD(MdPath=str(md_path), savePath=str(save_path))
            print(f"Successfully converted MD to Word: {save_path}")
    except FileNotFoundError as e:
        parse.error(f"File error: {str(e)}")
        sys.exit(1)
    except ValueError as e:
        parse.error(f"Parameter error: {str(e)}")
        sys.exit(1)
    except Exception as e:
        parse.error(f"Conversion failed: {str(e)} (Please check file paths and dependencies)")
        sys.exit(1)

if __name__ == "__main__":
    main()