# Fetch API应用场景

## 用户数据获取与显示

### 场景描述
创建一个用户列表应用，使用Fetch API从后端获取用户数据并动态显示。

### 实现步骤

1. **HTML结构**
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>用户列表</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>用户列表</h1>
    </header>

    <main>
        <div class="controls">
            <input type="text" id="search-input" placeholder="搜索用户...">
            <button id="refresh-btn">刷新</button>
        </div>

        <div id="user-list">
            <!-- 用户数据将在这里动态显示 -->
        </div>

        <div id="pagination">
            <button id="prev-page">上一页</button>
            <span id="page-info">第 1 页，共 1 页</span>
            <button id="next-page">下一页</button>
        </div>
    </main>

    <footer>
        <p>&copy; 2024 用户列表应用</p>
    </footer>
</body>
</html>
```

2. **CSS样式**
```css
body {
    font-family: 'Arial', sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f5f5f5;
    padding: 20px;
}

header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
}

header h1 {
    margin: 0;
}

main {
    max-width: 800px;
    margin: 0 auto;
}

.controls {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

.controls input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.controls button {
    padding: 10px 20px;
    background-color: #4a90e2;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.controls button:hover {
    background-color: #357abd;
}

#user-list {
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    min-height: 300px;
}

.user-card {
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 15px;
    background: #f8f9fa;
    display: flex;
    align-items: center;
    gap: 15px;
}

.user-card img {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    object-fit: cover;
}

.user-info {
    flex: 1;
}

.user-info h3 {
    margin: 0;
    color: #2d3748;
}

.user-info p {
    margin: 5px 0;
    color: #718096;
}

.user-actions {
    display: flex;
    gap: 10px;
}

.user-actions button {
    padding: 8px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9em;
}

.view-btn {
    background-color: #4a90e2;
    color: white;
}

.view-btn:hover {
    background-color: #357abd;
}

.delete-btn {
    background-color: #e74c3c;
    color: white;
}

.delete-btn:hover {
    background-color: #c0392b;
}

#pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 15px;
    margin-top: 20px;
}

#pagination button {
    padding: 8px 15px;
    background-color: #4a90e2;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

#pagination button:hover {
    background-color: #357abd;
}

#pagination button:disabled {
    background-color: #cbd5e0;
    cursor: not-allowed;
}

#page-info {
    color: #4a5568;
    font-weight: bold;
}

.loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
    color: #718096;
}

.error {
    color: #e74c3c;
    padding: 20px;
    background: #fdf2f2;
    border: 1px solid #feb2b2;
    border-radius: 8px;
    margin-top: 20px;
    text-align: center;
}

footer {
    text-align: center;
    margin-top: 30px;
    padding: 15px;
    background: #e2e8f0;
    border-radius: 8px;
    color: #4a5568;
}
```

3. **JavaScript交互**
```javascript
document.addEventListener('DOMContentLoaded', () => {
    const userList = document.getElementById('user-list');
    const searchInput = document.getElementById('search-input');
    const refreshBtn = document.getElementById('refresh-btn');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    const pageInfo = document.getElementById('page-info');

    // 模拟API URL
    const API_URL = 'https://api.example.com/users';

    // 分页状态
    let currentPage = 1;
    let totalPages = 1;
    let currentUsers = [];

    // 获取用户数据
    async function fetchUsers(page = 1, search = '') {
        try {
            showLoading();

            // 构建查询参数
            const params = new URLSearchParams({
                page: page,
                limit: 10,
                search: search
            });

            const response = await fetch(`${API_URL}?${params}`);

            if (!response.ok) {
                throw new Error(`HTTP错误! 状态: ${response.status}`);
            }

            const data = await response.json();

            // 更新分页状态
            currentPage = page;
            totalPages = data.totalPages || 1;
            currentUsers = data.users || [];

            // 渲染用户列表
            renderUsers(currentUsers);

            // 更新分页信息
            updatePagination();

        } catch (error) {
            showError(`获取用户数据失败: ${error.message}`);
            console.error('Fetch错误:', error);
        }
    }

    // 渲染用户列表
    function renderUsers(users) {
        userList.innerHTML = '';

        if (users.length === 0) {
            userList.innerHTML = '<p>没有找到用户</p>';
            return;
        }

        users.forEach(user => {
            const userCard = document.createElement('div');
            userCard.className = 'user-card';
            userCard.innerHTML = `
                <img src="https://picsum.photos/seed/${user.id}/60/60.jpg" alt="${user.name}">
                <div class="user-info">
                    <h3>${user.name}</h3>
                    <p>邮箱: ${user.email}</p>
                    <p>注册时间: ${new Date(user.registeredAt).toLocaleDateString()}</p>
                </div>
                <div class="user-actions">
                    <button class="view-btn" data-id="${user.id}">查看</button>
                    <button class="delete-btn" data-id="${user.id}">删除</button>
                </div>
            `;

            // 添加事件监听器
            const viewBtn = userCard.querySelector('.view-btn');
            viewBtn.addEventListener('click', () => viewUser(user.id));

            const deleteBtn = userCard.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => deleteUser(user.id));

            userList.appendChild(userCard);
        });
    }

    // 查看用户详情
    async function viewUser(userId) {
        try {
            const response = await fetch(`${API_URL}/${userId}`);

            if (!response.ok) {
                throw new Error(`HTTP错误! 状态: ${response.status}`);
            }

            const user = await response.json();

            // 显示用户详情（这里简单使用alert，实际应用中可以使用模态框）
            alert(`用户详情:\nID: ${user.id}\n姓名: ${user.name}\n邮箱: ${user.email}\n注册时间: ${new Date(user.registeredAt).toLocaleDateString()}`);
        } catch (error) {
            showError(`获取用户详情失败: ${error.message}`);
            console.error('Fetch错误:', error);
        }
    }

    // 删除用户
    async function deleteUser(userId) {
        if (!confirm('确定要删除这个用户吗？')) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/${userId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`HTTP错误! 状态: ${response.status}`);
            }

            // 重新获取数据
            fetchUsers(currentPage, searchInput.value);
        } catch (error) {
            showError(`删除用户失败: ${error.message}`);
            console.error('Fetch错误:', error);
        }
    }

    // 显示加载状态
    function showLoading() {
        userList.innerHTML = '<div class="loading">加载中...</div>';
    }

    // 显示错误状态
    function showError(message) {
        userList.innerHTML = `<div class="error">${message}</div>`;
    }

    // 更新分页信息
    function updatePagination() {
        pageInfo.textContent = `第 ${currentPage} 页，共 ${totalPages} 页`;

        // 禁用/启用分页按钮
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages;
    }

    // 事件监听器
    refreshBtn.addEventListener('click', () => {
        fetchUsers(currentPage, searchInput.value);
    });

    searchInput.addEventListener('input', () => {
        fetchUsers(1, searchInput.value);
    });

    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            fetchUsers(currentPage - 1, searchInput.value);
        }
    });

    nextPageBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            fetchUsers(currentPage + 1, searchInput.value);
        }
    });

    // 初始化加载数据
    fetchUsers();
});
```

## 文件上传与进度显示

### 场景描述
创建一个文件上传组件，使用Fetch API上传文件并显示上传进度。

### 实现步骤

1. **HTML结构**
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>文件上传</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>文件上传</h1>
    </header>

    <main>
        <div class="upload-container">
            <div class="drop-zone" id="drop-zone">
                <p>拖放文件到这里或点击选择文件</p>
                <input type="file" id="file-input" multiple>
            </div>

            <div class="upload-list">
                <h3>待上传文件</h3>
                <div id="file-list">
                    <!-- 文件列表将在这里显示 -->
                </div>
            </div>

            <button id="upload-btn">开始上传</button>

            <div id="upload-progress">
                <h3>上传进度</h3>
                <div id="progress-bar-container">
                    <!-- 进度条将在这里显示 -->
                </div>
            </div>
        </div>
    </main>

    <footer>
        <p>&copy; 2024 文件上传应用</p>
    </footer>
</body>
</html>
```

2. **CSS样式**
```css
body {
    font-family: 'Arial', sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f5f5f5;
    padding: 20px;
}

header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
}

header h1 {
    margin: 0;
}

main {
    max-width: 600px;
    margin: 0 auto;
}

.upload-container {
    background: white;
    border-radius: 8px;
    padding: 25px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.drop-zone {
    border: 2px dashed #4a90e2;
    border-radius: 8px;
    padding: 30px;
    text-align: center;
    margin-bottom: 20px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.drop-zone:hover {
    background-color: #f0f7ff;
}

.drop-zone p {
    margin: 0;
    color: #4a90e2;
    font-size: 1.2em;
}

#file-input {
    display: none;
}

.upload-list {
    margin-bottom: 20px;
}

.upload-list h3 {
    margin-bottom: 15px;
    color: #2d3748;
}

.file-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    margin-bottom: 10px;
    background: #f8f9fa;
}

.file-item .file-info {
    flex: 1;
}

.file-item .file-name {
    font-weight: bold;
    color: #2d3748;
}

.file-item .file-size {
    color: #718096;
    font-size: 0.9em;
}

.file-item .file-remove {
    background: none;
    border: none;
    color: #e74c3c;
    cursor: pointer;
    padding: 5px;
}

.file-item .file-remove:hover {
    background: #fadbd8;
    border-radius: 4px;
}

#upload-btn {
    width: 100%;
    padding: 12px;
    background-color: #4a90e2;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1.1em;
    margin-bottom: 20px;
}

#upload-btn:hover {
    background-color: #357abd;
}

#upload-btn:disabled {
    background-color: #cbd5e0;
    cursor: not-allowed;
}

#upload-progress {
    margin-top: 20px;
}

#progress-bar-container {
    margin-top: 15px;
}

.progress-bar {
    height: 20px;
    background-color: #e2e8f0;
    border-radius: 4px;
    overflow: hidden;
}

.progress-bar-fill {
    height: 100%;
    background-color: #4a90e2;
    width: 0%;
    transition: width 0.3s ease;
}

.progress-text {
    text-align: center;
    margin-top: 10px;
    color: #4a5568;
    font-weight: bold;
}

.error {
    color: #e74c3c;
    padding: 15px;
    background: #fdf2f2;
    border: 1px solid #feb2b2;
    border-radius: 8px;
    margin-top: 20px;
    text-align: center;
}

footer {
    text-align: center;
    margin-top: 30px;
    padding: 15px;
    background: #e2e8f0;
    border-radius: 8px;
    color: #4a5568;
}
```

3. **JavaScript交互**
```javascript
document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const fileList = document.getElementById('file-list');
    const uploadBtn = document.getElementById('upload-btn');
    const progressBarContainer = document.getElementById('progress-bar-container');

    // 存储选择的文件
    let selectedFiles = [];

    // 拖放功能
    dropZone.addEventListener('click', () => {
        fileInput.click();
    });

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.backgroundColor = '#f0f7ff';
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.style.backgroundColor = '';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.backgroundColor = '';
        handleFiles(e.dataTransfer.files);
    });

    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    // 处理文件
    function handleFiles(files) {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (!selectedFiles.find(f => f.name === file.name && f.size === file.size)) {
                selectedFiles.push(file);
                renderFileItem(file);
            }
        }
    }

    // 渲染文件项
    function renderFileItem(file) {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <div class="file-info">
                <div class="file-name">${file.name}</div>
                <div class="file-size">${formatFileSize(file.size)}</div>
            </div>
            <button class="file-remove">删除</button>
        `;

        const removeBtn = fileItem.querySelector('.file-remove');
        removeBtn.addEventListener('click', () => {
            removeFile(file, fileItem);
        });

        fileList.appendChild(fileItem);
    }

    // 删除文件
    function removeFile(file, fileItem) {
        selectedFiles = selectedFiles.filter(f => f.name !== file.name || f.size !== file.size);
        fileItem.remove();
    }

    // 格式化文件大小
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // 上传文件
    async function uploadFiles() {
        if (selectedFiles.length === 0) {
            alert('请先选择文件');
            return;
        }

        uploadBtn.disabled = true;

        // 创建进度条
        progressBarContainer.innerHTML = `
            <div class="progress-bar">
                <div class="progress-bar-fill" id="progress-bar"></div>
            </div>
            <div class="progress-text" id="progress-text">准备上传...</div>
        `;

        const progressBar = document.getElementById('progress-bar');
        const progressText = document.getElementById('progress-text');

        try {
            // 模拟上传进度
            let uploaded = 0;
            const total = selectedFiles.length;

            for (let i = 0; i < selectedFiles.length; i++) {
                const file = selectedFiles[i];

                // 模拟上传过程
                await new Promise(resolve => {
                    const interval = setInterval(() => {
                        uploaded++;
                        const progress = (uploaded / (total * 100)) * 100;
                        progressBar.style.width = `${progress}%`;
                        progressText.textContent = `上传中... ${Math.round(progress)}%`;

                        if (progress >= 100) {
                            clearInterval(interval);
                            resolve();
                        }
                    }, 50);
                });

                // 模拟API调用
                await fetch('https://api.example.com/upload', {
                    method: 'POST',
                    body: file
                });

                progressText.textContent = `上传完成: ${file.name}`;
            }

            // 上传完成
            progressText.textContent = '所有文件上传完成！';
            selectedFiles = [];
            fileList.innerHTML = '';

        } catch (error) {
            progressText.textContent = `上传失败: ${error.message}`;
            progressText.style.color = '#e74c3c';
            console.error('上传错误:', error);
        } finally {
            uploadBtn.disabled = false;
        }
    }

    // 事件监听器
    uploadBtn.addEventListener('click', uploadFiles);
});
```

## 实时数据更新

### 场景描述
创建一个实时数据监控仪表板，使用Fetch API定期获取最新数据并更新显示。

### 实现步骤

1. **HTML结构**
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>实时数据监控</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>实时数据监控</h1>
    </header>

    <main>
        <div class="dashboard">
            <div class="metric-card">
                <h3>在线用户</h3>
                <div class="metric-value" id="online-users">0</div>
                <div class="metric-change positive">+12%</div>
            </div>

            <div class="metric-card">
                <h3>页面浏览量</h3>
                <div class="metric-value" id="page-views">0</div>
                <div class="metric-change positive">+8%</div>
            </div>

            <div class="metric-card">
                <h3>转化率</h3>
                <div class="metric-value" id="conversion-rate">0%</div>
                <div class="metric-change negative">-3%</div>
            </div>

            <div class="metric-card">
                <h3>平均停留时间</h3>
                <div class="metric-value" id="avg-time">0s</div>
                <div class="metric-change positive">+5%</div>
            </div>
        </div>

        <div class="controls">
            <button id="start-monitoring">开始监控</button>
            <button id="stop-monitoring">停止监控</button>
            <select id="update-interval">
                <option value="1000">1秒</option>
                <option value="5000" selected>5秒</option>
                <option value="10000">10秒</option>
            </select>
        </div>

        <div id="data-table">
            <h3>最近活动</h3>
            <table>
                <thead>
                    <tr>
                        <th>时间</th>
                        <th>用户</th>
                        <th>操作</th>
                        <th>详情</th>
                    </tr>
                </thead>
                <tbody id="activity-list">
                    <!-- 活动数据将在这里显示 -->
                </tbody>
            </table>
        </div>
    </main>

    <footer>
        <p>&copy; 2024 实时数据监控</p>
    </footer>
</body>
</html>
```

2. **CSS样式**
```css
body {
    font-family: 'Arial', sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f5f5f5;
    padding: 20px;
}

header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
}

header h1 {
    margin: 0;
}

main {
    max-width: 1200px;
    margin: 0 auto;
}

.dashboard {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
}

.metric-card {
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    text-align: center;
}

.metric-card h3 {
    margin: 0 0 15px;
    color: #4a5568;
    font-size: 1.1em;
}

.metric-value {
    font-size: 2.5em;
    font-weight: bold;
    color: #2d3748;
    margin-bottom: 10px;
}

.metric-change {
    font-size: 0.9em;
    padding: 5px 10px;
    border-radius: 4px;
}

.positive {
    background-color: #d4edda;
    color: #155724;
}

.negative {
    background-color: #f8d7da;
    color: #721c24;
}

.controls {
    display: flex;
    gap: 10px;
    margin-bottom: 30px;
    justify-content: center;
}

.controls button {
    padding: 10px 20px;
    background-color: #4a90e2;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.controls button:hover {
    background-color: #357abd;
}

.controls button:disabled {
    background-color: #cbd5e0;
    cursor: not-allowed;
}

.controls select {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

#data-table {
    background: white;
    border-radius: 8px;
    padding: 25px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    overflow-x: auto;
}

#data-table h3 {
    margin-top: 0;
    color: #2d3748;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
}

th {
    background-color: #f8f9fa;
    color: #4a5568;
    font-weight: bold;
}

tr:hover {
    background-color: #f8f9fa;
}

.activity-item {
    animation: fadeIn 0.5s;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.loading {
    text-align: center;
    padding: 20px;
    color: #718096;
}

.error {
    color: #e74c3c;
    padding: 20px;
    background: #fdf2f2;
    border: 1px solid #feb2b2;
    border-radius: 8px;
    margin-top: 20px;
    text-align: center;
}

footer {
    text-align: center;
    margin-top: 30px;
    padding: 15px;
    background: #e2e8f0;
    border-radius: 8px;
    color: #4a5568;
}
```

3. **JavaScript交互**
```javascript
document.addEventListener('DOMContentLoaded', () => {
    const onlineUsersEl = document.getElementById('online-users');
    const pageViewsEl = document.getElementById('page-views');
    const conversionRateEl = document.getElementById('conversion-rate');
    const avgTimeEl = document.getElementById('avg-time');
    const activityList = document.getElementById('activity-list');
    const startBtn = document.getElementById('start-monitoring');
    const stopBtn = document.getElementById('stop-monitoring');
    const intervalSelect = document.getElementById('update-interval');

    let monitoringInterval;
    let isMonitoring = false;

    // 获取实时数据
    async function fetchRealtimeData() {
        try {
            // 模拟API调用
            await new Promise(resolve => setTimeout(resolve, 500));

            // 模拟数据
            const data = {
                onlineUsers: Math.floor(Math.random() * 1000) + 500,
                pageViews: Math.floor(Math.random() * 10000) + 5000,
                conversionRate: (Math.random() * 10).toFixed(2),
                avgTime: Math.floor(Math.random() * 300) + 30,
                activities: [
                    { time: new Date(), user: 'user1', action: '登录', details: '成功登录系统' },
                    { time: new Date(), user: 'user2', action: '浏览', details: '浏览了产品页面' },
                    { time: new Date(), user: 'user3', action: '购买', details: '购买了商品' }
                ]
            };

            // 更新指标
            onlineUsersEl.textContent = data.onlineUsers;
            pageViewsEl.textContent = data.pageViews.toLocaleString();
            conversionRateEl.textContent = `${data.conversionRate}%`;
            avgTimeEl.textContent = `${data.avgTime}s`;

            // 更新活动列表
            updateActivityList(data.activities);

        } catch (error) {
            console.error('获取实时数据失败:', error);
        }
    }

    // 更新活动列表
    function updateActivityList(activities) {
        activityList.innerHTML = '';

        activities.forEach(activity => {
            const row = document.createElement('tr');
            row.className = 'activity-item';
            row.innerHTML = `
                <td>${activity.time.toLocaleTimeString()}</td>
                <td>${activity.user}</td>
                <td>${activity.action}</td>
                <td>${activity.details}</td>
            `;
            activityList.appendChild(row);
        });
    }

    // 开始监控
    function startMonitoring() {
        if (isMonitoring) return;

        isMonitoring = true;
        startBtn.disabled = true;
        stopBtn.disabled = false;

        const interval = parseInt(intervalSelect.value);

        // 立即获取一次数据
        fetchRealtimeData();

        // 设置定时获取
        monitoringInterval = setInterval(fetchRealtimeData, interval);
    }

    // 停止监控
    function stopMonitoring() {
        if (!isMonitoring) return;

        isMonitoring = false;
        startBtn.disabled = false;
        stopBtn.disabled = true;

        if (monitoringInterval) {
            clearInterval(monitoringInterval);
            monitoringInterval = null;
        }
    }

    // 事件监听器
    startBtn.addEventListener('click', startMonitoring);
    stopBtn.addEventListener('click', stopMonitoring);
    intervalSelect.addEventListener('change', () => {
        if (isMonitoring) {
            stopMonitoring();
            startMonitoring();
        }
    });

    // 初始化显示
    fetchRealtimeData();
});
```

## 错误处理与重试机制

### 场景描述
创建一个健壮的API客户端，使用Fetch API并实现错误处理和自动重试机制。

### 实现步骤

1. **HTML结构**
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>健壮API客户端</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>健壮API客户端</h1>
    </header>

    <main>
        <div class="api-client">
            <div class="endpoint-section">
                <h3>API端点</h3>
                <input type="text" id="endpoint-input" value="https://api.example.com/data" placeholder="输入API端点URL">
                <button id="fetch-btn">获取数据</button>
            </div>

            <div class="response-section">
                <h3>响应数据</h3>
                <pre id="response-output">等待API响应...</pre>
            </div>

            <div class="settings-section">
                <h3>设置</h3>
                <div class="setting-group">
                    <label for="retry-count">重试次数:</label>
                    <input type="number" id="retry-count" value="3" min="0" max="10">
                </div>
                <div class="setting-group">
                    <label for="timeout">超时时间(毫秒):</label>
                    <input type="number" id="timeout" value="5000" min="1000" max="30000">
                </div>
                <div class="setting-group">
                    <label for="retry-delay">重试延迟(毫秒):</label>
                    <input type="number" id="retry-delay" value="1000" min="100" max="5000">
                </div>
            </div>
        </div>
    </main>

    <footer>
        <p>&copy; 2024 健壮API客户端</p>
    </footer>
</body>
</html>
```

2. **CSS样式**
```css
body {
    font-family: 'Arial', sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f5f5f5;
    padding: 20px;
}

header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
}

header h1 {
    margin: 0;
}

main {
    max-width: 800px;
    margin: 0 auto;
}

.api-client {
    background: white;
    border-radius: 8px;
    padding: 25px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.endpoint-section, .response-section, .settings-section {
    margin-bottom: 25px;
}

h3 {
    color: #2d3748;
    margin-bottom: 15px;
}

.setting-group {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 15px;
}

.setting-group label {
    flex: 1;
    font-weight: bold;
}

.setting-group input {
    width: 150px;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

#endpoint-input {
    flex: 3;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

#fetch-btn {
    padding: 10px 20px;
    background-color: #4a90e2;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

#fetch-btn:hover {
    background-color: #357abd;
}

#response-output {
    background: #f8f9fa;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    padding: 15px;
    white-space: pre-wrap;
    font-family: monospace;
    min-height: 200px;
    overflow-x: auto;
}

.loading {
    color: #718096;
    font-style: italic;
}

.success {
    color: #155724;
}

.error {
    color: #721c24;
}

footer {
    text-align: center;
    margin-top: 30px;
    padding: 15px;
    background: #e2e8f0;
    border-radius: 8px;
    color: #4a5568;
}
```

3. **JavaScript交互**
```javascript
document.addEventListener('DOMContentLoaded', () => {
    const endpointInput = document.getElementById('endpoint-input');
    const fetchBtn = document.getElementById('fetch-btn');
    const responseOutput = document.getElementById('response-output');
    const retryCountInput = document.getElementById('retry-count');
    const timeoutInput = document.getElementById('timeout');
    const retryDelayInput = document.getElementById('retry-delay');

    // 健壮的Fetch函数
    async function robustFetch(url, options = {}) {
        const retryCount = parseInt(retryCountInput.value) || 3;
        const timeout = parseInt(timeoutInput.value) || 5000;
        const retryDelay = parseInt(retryDelayInput.value) || 1000;

        let lastError;

        for (let i = 0; i < retryCount; i++) {
            try {
                // 设置超时
                const controller = new AbortController();
                const timeoutId = setTimeout(() => {
                    controller.abort();
                }, timeout);

                const response = await fetch(url, {
                    ...options,
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error(`HTTP错误! 状态: ${response.status}`);
                }

                return await response.json();

            } catch (error) {
                lastError = error;
                console.error(`尝试 ${i + 1} 失败:`, error);

                if (i < retryCount - 1) {
                    // 等待重试延迟
                    await new Promise(resolve => setTimeout(resolve, retryDelay));
                }
            }
        }

        throw lastError || new Error('所有重试都失败了');
    }

    // 获取数据
    async function fetchData() {
        const endpoint = endpointInput.value.trim();

        if (!endpoint) {
            responseOutput.textContent = '请输入API端点URL';
            responseOutput.className = 'error';
            return;
        }

        responseOutput.textContent = '加载中...';
        responseOutput.className = 'loading';

        try {
            const data = await robustFetch(endpoint);

            responseOutput.textContent = JSON.stringify(data, null, 2);
            responseOutput.className = 'success';

        } catch (error) {
            responseOutput.textContent = `错误: ${error.message}`;
            responseOutput.className = 'error';
            console.error('API调用失败:', error);
        }
    }

    // 事件监听器
    fetchBtn.addEventListener('click', fetchData);

    // 键盘事件
    endpointInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            fetchData();
        }
    });

    // 初始化显示
    responseOutput.textContent = '等待API响应...';
});
```

## Fetch API应用场景总结

Fetch API是现代前端开发的重要工具，通过以上应用场景，你可以：

1. **数据获取与显示**：使用Fetch API从后端获取数据并动态渲染
2. **文件上传**：实现文件上传功能并显示上传进度
3. **实时数据更新**：定期获取最新数据并更新UI
4. **错误处理**：实现健壮的错误处理和重试机制

掌握这些应用场景后，你将能够使用Fetch API创建各种功能丰富的Web应用。