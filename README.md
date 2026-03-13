# M2x - 🤖 A Lightweight Markdown Online Editor & Conversion Tool 👾

[![Python >3.10.9](https://img.shields.io/badge/python-%3E3.10.9-blue.svg)](https://www.python.org/downloads/)

---

[🌐 Switch to Chinese Version (切换到中文)](./README_zh.md)

---

## Project Description 👿

M2x is a lightweight online Markdown editor that implements basic Markdown editing functionality directly in your browser 😇. Additionally, it provides convenient APIs to quickly convert Markdown files to PDF and Word formats 🥰.

## Core Features 🤗

- **😻 Online Editing**: Enables online editing of your Markdown files via APIs directly in the browser
- **😼 Fast Conversion**: Converts your Markdown files to PDF and Word formats, supporting both local and online service modes

## Technical Implementation 👻

### Frontend 👀
- HTML
- JavaScript
- CSS
- Utilizes native frontend languages to achieve fast file loading and opening

### Backend 🧠
- FastAPI
- markdown2
- WeasyPrint
- Uvicorn
- python-docx
- beautifulsoup4
- Delivers fast response and efficient conversion

### Getting Started? 👽️

1. **Clone the Repository**

```bash
git clone <repository-url>
cd m2x
```

2. **Install Python Dependencies**

```bash
pip install -e .
```
### or you can choose🎃
```
pip install python-m2x
```
## Basic Usage

#### Command Line Interface 😵
```bash
m2x -p yourmarkdown_file_path yourtarget_path
# Convert text from Markdown to PDF

m2x -2 yourmarkdown_file_path yourtarget_path
# Convert text from Markdown to Word

m2x --server
# Launch the online editor in browser
```

## Data Flow Process 🌞

```
📄 Original Markdown File
    → 🚀 Process into HTML
    → 📊 Unify Data Format
    → 💡 Convert to Target Format
    → 🖥️ Frontend Dynamic Rendering
    → 💬 User Interaction
    → 📋 Final Output
```

## Contribution Process 🐸

1. Submit an Issue to report bugs or suggest new features
2. Fork the repository and create a feature branch
3. Implement features and write corresponding tests
4. Submit a Pull Request with a description of the changes
5. Merge after code review approval

## Testing Instructions 👐

- **Testing Framework**: pytest
- **Test Directory**: Test cases are organized by module under the `tests/` directory

## 🙏 Acknowledgments

- [fastapi](https://github.com/fastapi/fastapi): Core backend framework 🚀
- [markdown2](https://github.com/trentm/python-markdown2): Markdown conversion tool 🔥
- [weasyprint](https://github.com/Kozea/WeasyPrint): Converts HTML to PDF 💢
- [python-docx](https://github.com/dolanmiu/docx): Converts HTML content to Word 😡
- [uvicorn](https://github.com/encode/uvicorn): ASGI server for launching the application 💥
- [beautifulsoup4](https://pypi.org/project/beautifulsoup4/): Extracts HTML content for conversion 🪐

---

## 📞 Contact Us

For any questions or suggestions, please feel free to contact us via Issues or email.

---

**🚀 Thank you for using M2x! And thank you for your contributions to M2x!**
