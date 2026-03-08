// 全局变量
let editor;
const API_BASE = "http://localhost:3000/api";

// 页面加载完成后初始化（核心：确保编辑器能创建）
document.addEventListener('DOMContentLoaded', () => {
    // 初始化 Monaco 编辑器
    initEditor();
    // 绑定按钮事件
    bindEvents();
    // 自动保存（每30秒）
    setInterval(autoSave, 30000);
});

/**
 * 初始化 Monaco 编辑器（关键：直接创建空白编辑区，能打字）
 */
function initEditor() {
    // 配置 Monaco 加载路径
    require.config({
        paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.41.0/min/vs' }
    });

    // 加载并创建编辑器
    require(['vs/editor/editor.main'], function() {
        // 从缓存恢复内容（没有则为空）
        const savedContent = localStorage.getItem('m2x_editor_content') || "";
        
        // 创建编辑器（黑色系主题，直接可编辑）
        editor = monaco.editor.create(document.getElementById('editorContainer'), {
            value: savedContent,
            language: 'markdown',
            theme: 'vs-dark',          // 黑色主题
            automaticLayout: true,     // 自适应布局
            wordWrap: 'on',            // 自动换行
            fontSize: 14,              // 字体大小
            tabSize: 2,                // 缩进
            minimap: { enabled: false },// 关闭小地图
            scrollBeyondLastLine: false,
            lineNumbers: 'on'          // 显示行号
        });

        // 关键：强制聚焦编辑器 → 打开就能打字
        setTimeout(() => {
            editor.focus();
        }, 500);

        // 监听内容变化 → 更新预览和统计
        editor.onDidChangeModelContent(() => {
            updatePreview();
            updateStats();
        });

        // 初始化统计和预览
        updateStats();
        if (savedContent) updatePreview();
    });
}

/**
 * 绑定所有按钮事件
 */
function bindEvents() {
    // 保存 MD 文件到本地
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
        alert('已保存为 MD 文件！');
    });

    // 导出其他格式（调用你的后端接口 /api/convert-md）
    document.getElementById('exportBtn').addEventListener('click', async () => {
        const content = editor.getValue();
        const format = document.getElementById('outputFormat').value;
        
        if (!content.trim()) {
            alert('没有可导出的内容！');
            return;
        }

        try {
            // 调用你的后端接口（注意：你的接口名是 convert-md，参数是 target_format）
            const response = await fetch(`${API_BASE}/convert-md`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: content,
                    target_format: format  // 你的参数名是 target_format，不是 format！
                })
            });

            if (!response.ok) throw new Error(`接口调用失败：${response.status}`);
            const result = await response.json();

            // 生成下载文件
            const blob = new Blob([result.converted_content], { 
                type: format === 'html' ? 'text/html' : 'application/octet-stream' 
            });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `m2x_export.${format}`;
            a.click();
            alert(`已导出为 ${format.toUpperCase()} 文件！`);
        } catch (error) {
            alert(`导出失败：${error.message}`);
        }
    });

    // 刷新预览
    document.getElementById('refreshPreviewBtn').addEventListener('click', updatePreview);
    
    // 格式化 MD
    document.getElementById('formatBtn').addEventListener('click', () => {
        const content = editor.getValue();
        editor.setValue(content.replace(/\n+/g, '\n').replace(/\n(#+)/g, '\n\n$1').trim() + '\n');
    });

    // 切换格式刷新预览
    document.getElementById('outputFormat').addEventListener('change', updatePreview);
}

/**
 * 更新预览区（调用你的后端接口）
 */
async function updatePreview() {
    const content = editor.getValue();
    const format = document.getElementById('outputFormat').value;
    const preview = document.getElementById('previewContainer');

    if (!content.trim()) {
        preview.innerHTML = '<div class="flex items-center justify-center h-full text-[#666]"><p>点击左侧编辑区开始输入内容 📝</p></div>';
        return;
    }

    try {
        // 调用你的后端接口（参数名是 target_format）
        const res = await fetch(`${API_BASE}/convert-md`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                content: content,
                target_format: format
            })
        });

        if (!res.ok) throw new Error(`接口调用失败：${res.status}`);
        const data = await res.json();

        // 渲染预览
        if (format === 'html' && data.success) {
            preview.innerHTML = data.converted_content;
        } else {
            preview.innerHTML = `<div class="flex items-center justify-center h-full text-[#00ff9d]"><p>${format.toUpperCase()} 格式已转换完成</p></div>`;
        }
    } catch (e) {
        preview.innerHTML = `<div class="flex items-center justify-center h-full text-[#ff6b6b]"><p>预览失败：${e.message}</p></div>`;
    }
}

/**
 * 更新字符/单词统计
 */
function updateStats() {
    const content = editor.getValue();
    const charCount = content.length;
    const wordCount = content.replace(/\s+/g, ' ').replace(/[\u4e00-\u9fa5]/g, ' $& ').trim().split(/\s+/).filter(Boolean).length;
    
    document.getElementById('charCount').textContent = `字符数: ${charCount}`;
    document.getElementById('wordCount').textContent = `单词数: ${wordCount}`;
}

/**
 * 自动保存到缓存
 */
function autoSave() {
    const content = editor.getValue();
    if (content) localStorage.setItem('m2x_editor_content', content);
}
