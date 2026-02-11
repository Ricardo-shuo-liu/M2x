def escape_html_code_final(html_content):
    """
    最终版：先还原已转义的字符，再重新正确转义（解决二次转义问题）
    """
    import re

    # 第一步：还原已被转义的字符（把& lt; / & gt; / & amp; 还原为 < / > / &）
    # 注意：这里要先还原& amp;，否则会把& lt;中的&也还原错
    content_unescaped = (
        html_content.replace("&amp;", "&")
        .replace("&lt;", "<")
        .replace("&gt;", ">")
        .replace("&quot;", '"')
        .replace("&#39;", "'")
    )

    # 第二步：匹配所有pre/code块（兼容任意格式）
    code_pattern = re.compile(
        r'(<pre\s*[^>]*>\s*<code\s*[^>]*>)(.*?)(</code\s*>\s*</pre\s*>)',
        re.DOTALL | re.IGNORECASE
    )

    def replace_func(match):
        prefix = match.group(1)
        code = match.group(2)
        suffix = match.group(3)

        # 对原始代码做一次正确的转义（仅转义必要字符）
        code_escaped = (
            code.replace("&", "&amp;")
            .replace("<", "&lt;")
            .replace(">", "&gt;")
            # 双引号/单引号可选转义（不影响显示，可注释）
            # .replace('"', "&quot;")
            # .replace("'", "&#39;")
        )
        return f"{prefix}{code_escaped}{suffix}"

    # 执行代码块转义
    final_html = code_pattern.sub(replace_func, content_unescaped)

    # 验证提示
    if final_html == content_unescaped:
        print("⚠️ 未匹配到任何<pre><code>块，请检查标签格式！")
    else:
        print("✅ 代码块转义完成，已修复二次转义问题！")

    return final_html

# ====================== 完整使用流程 ======================
# 1. 读取你的原始HTML文件
with open("original.html", "r", encoding="utf-8") as f:
    original_html = f.read()

# 2. 执行最终版转义（先还原，再正确转义）
fixed_html = escape_html_code_final(original_html)

# 3. 保存修复后的文件
with open("fixed_final.html", "w", encoding="utf-8") as f:
    f.write(fixed_html)

print("✅ 修复后的文件已保存为 fixed_final.html")