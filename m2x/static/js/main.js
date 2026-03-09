// 全局变量
let editor;
const API_BASE = "http://127.0.0.1:3000/api";
let isExporting = false;
// 新增大纲相关变量
let outlineData = [];
// 新增搜索相关变量
let searchDecorations = [];

document.addEventListener('DOMContentLoaded', () => {
    initEditor();
    bindEvents();
    initEmojiPanel();
    initResizablePanel(); // 适配新的双分隔条
    initToggleFunctions(); // 新增大纲开关
    initOutlineFunction(); // 初始化大纲功能
    initSearchFunction(); // 新增：初始化模糊查询功能
    setInterval(autoSave, 30000);
});

// 初始化编辑器（完全保留原有逻辑）
function initEditor() {
    require.config({
        paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.41.0/min/vs' }
    });

    require(['vs/editor/editor.main'], function() {
        const savedContent = localStorage.getItem('m2x_editor_content') || "";
        
        editor = monaco.editor.create(document.getElementById('editorContainer'), {
            value: savedContent,
            language: 'markdown',
            theme: 'vs-dark',
            automaticLayout: true,
            wordWrap: 'on',
            fontSize: 14,
            tabSize: 2,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            lineNumbers: 'on'
        });

        editor.focus();
        editor.onDidChangeModelContent(() => {
            updateHTMLPreview(); // 保留原有预览逻辑
            updateStats();
            updateOutline(); // 新增大纲更新
            // 新增：内容变化时更新搜索结果
            const searchText = document.getElementById('searchInput').value.trim();
            if (searchText) {
                searchInEditor(searchText);
            }
        });

        updateStats();
        // 新增行数统计初始化
        document.getElementById('lineCount').innerHTML = `<i class="fa fa-list-ol text-neon"></i> 行数: ${savedContent.split('\n').length}`;
        if (savedContent) {
            updateHTMLPreview();
            updateOutline(); // 初始化大纲
        }
    });
}

// 绑定事件（保留原有逻辑，新增大纲刷新按钮）
function bindEvents() {
    // 保存按钮（原有逻辑）
    document.getElementById('saveBtn').addEventListener('click', () => {
        const content = editor.getValue();
        if (!content.trim()) {
            alert('没有可保存的内容！');
            return;
        }
        const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = '未命名.md';
        a.click();
        alert('MD文件已保存！');
    });

    // 导出按钮（原有逻辑）
    document.getElementById('exportBtn').addEventListener('click', async () => {
        if (isExporting) return;
        const content = editor.getValue();
        const format = document.getElementById('outputFormat').value;
        
        if (!content.trim()) {
            alert('没有可导出的内容！');
            return;
        }

        isExporting = true;
        const exportBtn = document.getElementById('exportBtn');
        const exportLoading = document.getElementById('exportLoading');
        exportBtn.disabled = true;
        exportLoading.classList.remove('hidden');

        try {
            const response = await fetch(`${API_BASE}/convert-md`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: content,
                    target_format: format
                })
            });

            if (!response.ok) throw new Error(`接口调用失败：${response.status}`);

            if (format === "html") {
                const result = await response.json();
                const blob = new Blob([result.converted_content], { type: 'text/html' });
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = `m2x_export.${format}`;
                a.click();
                alert('HTML文件已导出！');
            } else if (format === "pdf") {
                const blob = await response.blob();
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = `m2x_export.${format}`;
                a.click();
                alert('PDF文件已开始下载！');
            } else {
                alert('Word导出功能需集成docx.js，建议参考：https://github.com/dolanmiu/docx');
            }
        } catch (error) {
            alert(`导出失败：${error.message}`);
        } finally {
            isExporting = false;
            exportBtn.disabled = false;
            exportLoading.classList.add('hidden');
        }
    });

    // 刷新预览按钮（原有逻辑）
    document.getElementById('refreshPreviewBtn').addEventListener('click', () => {
        updateHTMLPreview();
    });

    // 格式化按钮（原有逻辑）
    document.getElementById('formatBtn').addEventListener('click', () => {
        const content = editor.getValue();
        editor.setValue(content.replace(/\n+/g, '\n').replace(/\n(#+)/g, '\n\n$1').trim() + '\n');
    });

    // 新增：刷新大纲按钮
    document.getElementById('refreshOutlineBtn').addEventListener('click', () => {
        updateOutline();
    });
}

// Emoji面板（保留原有逻辑，适配新样式）
function initEmojiPanel() {
    const emojiContainer = document.getElementById('emojiContainer');
    const emojiList = emojiContainer.textContent.trim().split(/\s+/);
    
    emojiContainer.innerHTML = '';
    const fullEmojiList = [...emojiList, ...emojiList];
    
    fullEmojiList.forEach(emoji => {
        if (emoji) {
            const emojiSpan = document.createElement('span');
            emojiSpan.className = 'inline-block px-2 py-1 text-lg cursor-pointer hover:scale-125 transition-transform duration-200';
            emojiSpan.textContent = emoji;
            emojiSpan.setAttribute('title', '点击复制');
            emojiSpan.addEventListener('click', () => {
                navigator.clipboard.writeText(emoji).then(() => {
                    const copyTip = document.getElementById('copyTip');
                    copyTip.style.opacity = '1';
                    setTimeout(() => {
                        copyTip.style.opacity = '0';
                    }, 1500);
                    editor.trigger('emoji', 'type', emoji);
                });
            });
            emojiContainer.appendChild(emojiSpan);
        }
    });

    emojiContainer.addEventListener('animationiteration', () => {
        emojiContainer.style.transform = 'translateX(0)';
        setTimeout(() => {
            emojiContainer.style.transition = 'none';
            emojiContainer.style.transform = 'translateX(0)';
            setTimeout(() => {
                emojiContainer.style.transition = 'transform 20s linear';
            }, 0);
        }, 0);
    });
}

// 可拖拽调整面板大小（适配双分隔条）
function initResizablePanel() {
    const outlineResizer = document.getElementById('outlineResizer');
    const editorResizer = document.getElementById('editorResizer');
    const outlinePanel = document.getElementById('outlinePanel');
    const editorPanel = document.getElementById('editorPanel');
    const previewPanel = document.getElementById('previewPanel');
    const mainContainer = document.getElementById('mainContainer');

    let isResizing = false;
    let currentResizer = null;

    // 开始拖拽
    function startResize(resizer) {
        return (e) => {
            isResizing = true;
            currentResizer = resizer;
            resizer.classList.add('bg-neon/30');
            document.body.style.cursor = 'col-resize';
            e.preventDefault();
        };
    }

    // 结束拖拽
    function stopResize() {
        isResizing = false;
        if (currentResizer) {
            currentResizer.classList.remove('bg-neon/30');
        }
        document.body.style.cursor = '';
        currentResizer = null;
    }

    // 拖拽调整
    function resizePanel(e) {
        if (!isResizing || !currentResizer) return;

        const mainRect = mainContainer.getBoundingClientRect();
        const x = e.clientX - mainRect.left;

        if (currentResizer === outlineResizer) {
            // 大纲面板宽度限制：40px - 300px
            const width = Math.max(40, Math.min(300, x));
            outlinePanel.style.width = `${width}px`;
        } else if (currentResizer === editorResizer) {
            // 预览面板宽度限制：200px 以上
            const previewWidth = Math.max(200, mainRect.width - x - 2);
            previewPanel.style.width = `${previewWidth}px`;
            // 编辑区自适应
            editorPanel.style.flex = '1';
        }

        if (editor) editor.layout();
    }

    // 绑定拖拽事件
    outlineResizer.addEventListener('mousedown', startResize(outlineResizer));
    editorResizer.addEventListener('mousedown', startResize(editorResizer));
    document.addEventListener('mousemove', resizePanel);
    document.addEventListener('mouseup', stopResize);
    document.addEventListener('mouseleave', stopResize);
}

// 功能开关（新增大纲开关，保留原有逻辑）
function initToggleFunctions() {
    // 预览区开关（原有逻辑适配新布局）
    const previewToggle = document.getElementById('previewToggle');
    const previewPanel = document.getElementById('previewPanel');
    const editorResizer = document.getElementById('editorResizer');

    previewToggle.addEventListener('change', () => {
        if (previewToggle.checked) {
            previewPanel.style.display = 'flex';
            editorResizer.style.display = 'flex';
        } else {
            previewPanel.style.display = 'none';
            editorResizer.style.display = 'none';
            editorPanel.style.flex = '1';
            if (editor) editor.layout();
        }
    });

    // Emoji面板开关（适配新布局 - 编辑区上方）
    const emojiToggle = document.getElementById('emojiToggle');
    const emojiPanel = document.getElementById('emojiPanel');
    
    emojiToggle.addEventListener('change', () => {
        if (emojiToggle.checked) {
            emojiPanel.style.display = 'block';
        } else {
            emojiPanel.style.display = 'none';
        }
        if (editor) editor.layout();
    });

    // 新增：大纲面板开关
    const outlineToggle = document.getElementById('outlineToggle');
    const outlinePanel = document.getElementById('outlinePanel');
    const outlineResizer = document.getElementById('outlineResizer');
    
    outlineToggle.addEventListener('change', () => {
        if (outlineToggle.checked) {
            outlinePanel.style.display = 'flex';
            outlineResizer.style.display = 'flex';
        } else {
            outlinePanel.style.display = 'none';
            outlineResizer.style.display = 'none';
            editorPanel.style.flex = '1';
            if (editor) editor.layout();
        }
    });
}

// 新增：大纲功能（不影响原有逻辑）
function initOutlineFunction() {
    // 解析Markdown标题
    function parseMarkdownTitles(content) {
        const lines = content.split('\n');
        const titles = [];

        lines.forEach((line, index) => {
            const match = line.match(/^(#{1,6})\s+(.*?)\s*$/);
            if (match) {
                const level = match[1].length;
                const text = match[2];
                titles.push({
                    level,
                    text,
                    line: index
                });
            }
        });
        return titles;
    }

    // 全局更新大纲方法
    window.updateOutline = function() {
        const content = editor.getValue();
        const titles = parseMarkdownTitles(content);
        outlineData = titles;
        const outlineContainer = document.getElementById('outlineContainer');

        if (titles.length === 0) {
            outlineContainer.innerHTML = `
                <div class="text-textLight text-xs text-center py-8">
                    <i class="fa fa-file-alt mb-2"></i>
                    <p>无标题内容</p>
                    <p class="mt-1 text-[10px]">输入Markdown标题自动生成</p>
                    <p class="mt-2 text-[10px] text-neon/70">示例：# 一级标题 ## 二级标题</p>
                </div>
            `;
            return;
        }

        let outlineHTML = '';
        titles.forEach((title) => {
            const indent = (title.level - 1) * 12;
            const colorClass = title.level === 1 ? 'text-vscode-title' : 'text-white';
            
            outlineHTML += `
                <div class="mb-1" style="padding-left: ${indent}px;" data-line="${title.line}">
                    <div class="hover:bg-neon/10 rounded px-1 py-0.5 text-xs ${colorClass} cursor-pointer outline-item">
                        <i class="fa fa-chevron-right text-[8px] mr-1 opacity-50"></i>
                        ${title.text}
                    </div>
                </div>
            `;
        });

        outlineContainer.innerHTML = outlineHTML;

        // 绑定大纲跳转事件
        document.querySelectorAll('.outline-item').forEach(item => {
            item.addEventListener('click', () => {
                const line = parseInt(item.parentElement.dataset.line);
                editor.revealLineInCenter(line + 1);
                editor.setPosition({ lineNumber: line + 1, column: 1 });
                editor.focus();
                // 点击反馈
                item.classList.add('bg-neon/20');
                setTimeout(() => item.classList.remove('bg-neon/20'), 1000);
            });
        });
    };
}

// 新增：模糊查询功能
function initSearchFunction() {
    const searchInput = document.getElementById('searchInput');
    const searchCount = document.getElementById('searchCount');

    // 清除之前的搜索高亮
    function clearSearchDecorations() {
        if (searchDecorations.length > 0) {
            editor.deltaDecorations(searchDecorations, []);
            searchDecorations = [];
        }
        searchCount.classList.add('hidden');
        searchCount.textContent = '0/0';
    }

    // 模糊查询核心逻辑
    function searchInEditor(searchText) {
        clearSearchDecorations();
        
        if (!searchText || !editor) return;
        
        const content = editor.getValue();
        const lines = content.split('\n');
        const decorations = [];
        let matchCount = 0;

        // 忽略大小写的正则
        const regex = new RegExp(searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');

        lines.forEach((line, lineNumber) => {
            let match;
            while ((match = regex.exec(line)) !== null) {
                matchCount++;
                const startColumn = match.index + 1;
                const endColumn = match.index + searchText.length + 1;
                
                decorations.push({
                    range: new monaco.Range(lineNumber + 1, startColumn, lineNumber + 1, endColumn),
                    options: {
                        inlineClassName: 'search-match',
                        hoverMessage: { value: `匹配项 ${matchCount}` }
                    }
                });
            }
        });

        // 应用高亮装饰
        searchDecorations = editor.deltaDecorations([], decorations);
        
        // 更新匹配计数
        searchCount.textContent = `${matchCount}/${matchCount}`;
        searchCount.classList.remove('hidden');

        // 如果有匹配项，滚动到第一个匹配位置
        if (matchCount > 0 && decorations.length > 0) {
            editor.revealRangeInCenter(decorations[0].range, monaco.editor.ScrollType.Smooth);
        }
    }

    // 绑定搜索事件
    searchInput.addEventListener('input', (e) => {
        const text = e.target.value.trim();
        searchInEditor(text);
    });

    // 清空搜索
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            searchInput.value = '';
            clearSearchDecorations();
            searchInput.blur();
        }
        // 回车跳转到下一个匹配项
        else if (e.key === 'Enter') {
            e.preventDefault();
            const content = editor.getValue();
            const searchText = searchInput.value.trim();
            if (!searchText || !editor) return;
            
            const currentPosition = editor.getPosition();
            const currentLine = currentPosition.lineNumber - 1;
            const currentColumn = currentPosition.column - 1;
            
            // 从当前位置继续搜索
            const remainingContent = content.slice(
                currentLine * (lines[currentLine]?.length || 0) + currentColumn
            );
            
            const regex = new RegExp(searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
            regex.lastIndex = 0;
            
            const match = regex.exec(remainingContent);
            if (match) {
                // 计算新位置（简化版）
                let charCount = 0;
                let targetLine = currentLine;
                let targetColumn = currentColumn + match.index + 1;
                
                // 找到对应的行和列
                while (targetLine < lines.length && targetColumn > lines[targetLine].length) {
                    targetColumn -= lines[targetLine].length + 1; // +1 是换行符
                    targetLine++;
                }
                
                if (targetLine < lines.length) {
                    editor.setPosition({
                        lineNumber: targetLine + 1,
                        column: Math.min(targetColumn, lines[targetLine].length + 1)
                    });
                    editor.revealPositionInCenter({
                        lineNumber: targetLine + 1,
                        column: targetColumn
                    }, monaco.editor.ScrollType.Smooth);
                    editor.focus();
                }
            }
        }
    });

    // 失去焦点时保留搜索结果
    searchInput.addEventListener('blur', () => {
        if (searchInput.value.trim()) {
            searchCount.classList.remove('hidden');
        }
    });

    // 暴露全局方法
    window.clearSearchDecorations = clearSearchDecorations;
}

// 快速预览逻辑（完全保留原有逻辑）
async function updateHTMLPreview() {
    const content = editor.getValue();
    const preview = document.getElementById('previewContainer');
    const previewToggle = document.getElementById('previewToggle');

    // 预览区隐藏时不渲染
    if (!previewToggle.checked) return;

    if (!content.trim()) {
        preview.innerHTML = `
            <div class="flex items-center justify-center h-full text-textLight">
                <div class="text-center">
                    <i class="fa fa-keyboard text-neon text-3xl mb-2"></i>
                    <p class="text-sm">点击左侧编辑区开始输入内容 🚀</p>
                    <p class="text-xs mt-1 text-textLight/70">支持 Markdown 语法高亮+实时预览</p>
                </div>
            </div>
        `;
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/convert-md`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                content: content,
                target_format: 'html'
            })
        });

        if (!res.ok) throw new Error(`预览加载失败：${res.status}`);
        const data = await res.json();

        if (data.success) {
            let cleanHtml = data.converted_content
                .replace(/<html[^>]*>|<\/html>/gi, '')
                .replace(/<body[^>]*>|<\/body>/gi, '')
                .replace(/<head[^>]*>|<\/head>/gi, '')
                .replace(/<meta[^>]*>/gi, '')
                .replace(/<title[^>]*>|<\/title>/gi, '')
                .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                .replace(/style="[^"]*"/gi, '')
                .replace(/class="[^"]*"/gi, '');

            preview.innerHTML = `<div class="preview-inner">${cleanHtml}</div>`;
        }
    } catch (e) {
        preview.innerHTML = `
            <div class="flex items-center justify-center h-full text-[#ff6b6b]">
                <div class="text-center">
                    <i class="fa fa-exclamation-triangle text-2xl mb-2"></i>
                    <p class="text-sm">预览失败：${e.message}</p>
                </div>
            </div>
        `;
    }
}

// 字符统计（新增行数统计）
function updateStats() {
    const content = editor.getValue();
    const charCount = content.length;
    const wordCount = content.replace(/\s+/g, ' ').replace(/[\u4e00-\u9fa5]/g, ' $& ').trim().split(/\s+/).filter(Boolean).length;
    const lineCount = content.split('\n').length;
    
    document.getElementById('charCount').innerHTML = `<i class="fa fa-file-text-o text-neon"></i> 字符数: ${charCount}`;
    document.getElementById('wordCount').innerHTML = `<i class="fa fa-font text-neon"></i> 单词数: ${wordCount}`;
    document.getElementById('lineCount').innerHTML = `<i class="fa fa-list-ol text-neon"></i> 行数: ${lineCount}`;
}

// 自动保存（原有逻辑）
function autoSave() {
    const content = editor.getValue();
    if (content) {
        localStorage.setItem('m2x_editor_content', content);
    }
}
