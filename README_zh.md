# M2x - 🤖一个轻量markdown在线编辑器以及转化工具👾

[![Python >3.10.9](https://img.shields.io/badge/python-%3E3.10.9-blue.svg)](https://www.python.org/downloads/)

---

[🌐 切换到英文版本 (Switch to English)](./README.md)

---

## 项目简诉👿

m2x是一个轻量的markdown在线编辑器通过浏览器实现基本的markdwon编辑器的功能😇当然，也提供了快捷接口用于迅速的将markdown文件转化为pdf和word文件🥰

## 核心功能🤗

- **😻在线编辑**: 允许通过接口在线通过浏览器编辑您的markdown文件
- **😼快速转化**: 运行在本地和在线服务上将您的markdwon文件转化为pdf和word文件

## 技术实现👻


### 前端👀
- html
- javascript
- css
- 使用原生的前端语言尽可能实现快速的读取已经打开

### 后端🧠
- fastapi
- markdown2
- weasyprint
- uvicorn
- docx
- beautifulsoup4
- 快速响应完成转化

### 如何开始?👽️

1. **克隆仓库**

```bash
git clone <repository-url>
cd M2x
```

2. **安装Python依赖**

```bash
pip install -e .
```
### 也可以选择🎃
```
pip install python-m2x
```

## 基本使用

#### 命令行接口😵
```
m2x -p yourmarkdown_file_path yourtarget_path
# 将文本从markdown转化为pdf

m2x -2 yourmarkdown_file_path yourtarget_path
# 将文本从markdown转化为word

m2x --server
打开在线浏览器

```
## 数据流流程🌞

```
📄 原始markdown文件
    → 🚀 处理成HTML
    → 📊 统一数据格式
    → 💡 转化成指定格式
    → 🖥️ 前端动态渲染
    → 💬 用户交互
    → 📋 最终输出
```
## 贡献流程🐸

1. 提交Issue汇报问题或功能建议
2. Fork仓库并创建特性分支
3. 实现功能并编写测试
4. 提交Pull Request，说明功能变更
5. 代码审查通过后合并

## 测试说明👐

- **测试框架**：pytest
- **测试目录**：`tests/`目录下按模块组织测试用例

## 🙏 致谢

- [fastapi](https://github.com/fastapi/fastapi):后端核心工具🚀
- [markdown2](https://github.com/trentm/python-markdown2):markdown转化工具🔥
- [weasyprint](https://github.com/Kozea/WeasyPrint):将html转化为pdf💢
- [docx](https://github.com/dolanmiu/docx):将html文件转化为word😡
- [uvicorn](https://github.com/Kludex/uvicorn):启动app服务💥
- [beautifulsoup4](https://pypi.org/project/beautifulsoup4/):提取html的内容用于转化🪐
---

## 📞 联系方式

如有问题或建议，欢迎通过Issue或邮件联系我们。

---

**🚀 感谢您使用M2x!以及您对M2x的贡献!** 🎉