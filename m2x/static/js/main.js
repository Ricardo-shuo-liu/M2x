// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 导航栏激活状态切换
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // 移除所有激活状态
            navLinks.forEach(l => l.classList.remove('active'));
            // 为当前点击的链接添加激活状态
            this.classList.add('active');
        });
    });

    // 测试API按钮点击事件（跳转到API测试区域）
    const testApiBtn = document.getElementById('test-api-btn');
    testApiBtn.addEventListener('click', function() {
        document.getElementById('api').scrollIntoView({ behavior: 'smooth' });
    });

    // 发送API请求按钮点击事件
    const sendRequestBtn = document.getElementById('send-request-btn');
    sendRequestBtn.addEventListener('click', sendApiRequest);

    // 发送API请求的核心函数
    async function sendApiRequest() {
        // 获取用户输入
        const endpoint = document.getElementById('api-endpoint').value;
        const method = document.getElementById('request-method').value;
        const bodyText = document.getElementById('request-body').value;
        const responseOutput = document.getElementById('response-output');

        // 清空之前的响应
        responseOutput.textContent = 'Loading...';

        try {
            // 构建请求选项
            const requestOptions = {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            // 如果不是GET请求且有请求体，添加到请求选项
            if (method !== 'GET' && bodyText.trim() !== '') {
                requestOptions.body = JSON.parse(bodyText);
            }

            // 发送请求（这里默认请求本地FastAPI服务器，可根据实际修改）
            const response = await fetch(`http://localhost:8000${endpoint}`, requestOptions);
            
            // 处理响应
            const responseData = await response.json();
            responseOutput.textContent = JSON.stringify(responseData, null, 2);

            // 高亮响应状态
            if (!response.ok) {
                responseOutput.style.color = '#e74c3c';
            } else {
                responseOutput.style.color = '#27ae60';
            }
        } catch (error) {
            // 处理错误
            responseOutput.textContent = `Error: ${error.message}`;
            responseOutput.style.color = '#e74c3c';
        }
    }
});
