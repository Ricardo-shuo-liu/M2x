import logging
import functools
import os
from typing import Callable
from pathlib import Path

def get_target_path():
    """
    获得当M2x文件夹所处路径
    """
    target_path = Path(__file__).resolve().parent.parent

    return target_path
def logtitle(func:Callable
             )->Callable:
    """
    测试文档记录->自动记录测试文档
    Args:
        func(Callable):装饰器函数
    Returns:
        tools(Callable):装饰后的函数
    """
    logger_name = func.__module__
    @functools.wraps(func)
    def tools(*agrs,**kwargs):
        try:
            log = logging.getLogger(logger_name)
            log.setLevel(logging.DEBUG)
            # TODO:path
            logFiler = logging.FileHandler(os.path.join(get_target_path(),"test.log"),encoding="utf-8")
            logFiler.setLevel(logging.WARNING)
            # 只记录waring
            loghandler = logging.StreamHandler()
            loghandler.setLevel(logging.INFO)
            # 控制台输出 INFO 及以上
            formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
            loghandler.setFormatter(formatter)
            logFiler.setFormatter(formatter)
            # 把处理器添加到 logger
            log.addHandler(logFiler)
            log.addHandler(loghandler)
            func(*agrs,**kwargs)
        except Exception as e:
            log.error("ERROR",exc_info=True)
            raise e
    return tools
