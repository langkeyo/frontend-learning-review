# Axios应用场景

## 用户认证与授权

### 场景描述
创建一个用户登录系统，使用Axios进行API调用并处理认证和授权。

### 实现步骤

1. **HTML结构**
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>用户登录</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>用户登录</h1>
    </header>

    <main>
        <div class="login-container">
            <form id="login-form">
                <div class="form-group">
                    <label for="username">用户名:</label>
                    <input type="text" id="username" name="username" required>
                </div>

                <div class="form-group">
                    <label for="password">密码:</label>
                    <input type="password" id="password" name="password" required>
                </div>

                <div class="form-group">
                    <label for="remember">记住我</label>
                    <input type="checkbox" id="remember" name="remember">
                </div>

                <button type="submit">登录</button>
            </form>

            <div id="login-result"></div>

            <div class="links">
                <a href="#" id="forgot-password">忘记密码?</a>
                <a href="#" id="register">注册新账号</a>
            </div>
        </div>
    </main>

    <footer>
        <p>&copy; 2024 用户登录系统</p>
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
    max-width: 400px;
    margin: 0 auto;
}

.login-container {
    background: white;
    border-radius: 8px;
    padding: 25px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.form-group {
    margin-bottom: 15px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

.form-group input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
}

.form-group input[type="checkbox"] {
    width: auto;
    margin-right: 5px;
}

button {
    width: 100%;
    padding: 12px;
    background-color: #4a90e2;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1.1em;
}

button:hover {
    background-color: #357abd;
}

#login-result {
    margin-top: 20px;
    padding: 15px;
    border-radius: 8px;
    text-align: center;
    display: none;
}

.success {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
}

.error {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
}

.links {
    margin-top: 20px;
    text-align: center;
}

.links a {
    color: #4a90e2;
    text-decoration: none;
    margin: 0 10px;
}

.links a:hover {
    text-decoration: underline;
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
// 模拟Axios
const mockAxios = {
    post: (url, data, config = {}) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // 模拟登录成功
                if (data.username === 'admin' && data.password === 'password') {
                    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' + Math.random();
                    resolve({
                        data: {
                            user: {
                                id: 1,
                                username: 'admin',
                                email: 'admin@example.com',
                                role: 'admin'
                            },
                            token: token
                        }
                    });
                } else {
                    reject(new Error('用户名或密码错误'));
                }
            }, 1000);
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const loginResult = document.getElementById('login-result');

    // 登录函数
    async function login(username, password, remember) {
        try {
            loginResult.style.display = 'none';

            // 显示加载状态
            loginResult.textContent = '登录中...';
            loginResult.className = 'loading';
            loginResult.style.display = 'block';

            // 调用登录API
            const response = await mockAxios.post('/api/login', {
                username,
                password
            });

            // 保存token
            localStorage.setItem('token', response.data.token);
            if (remember) {
                localStorage.setItem('rememberMe', 'true');
            }

            // 显示成功消息
            loginResult.textContent = '登录成功！正在跳转到首页...';
            loginResult.className = 'success';

            // 模拟跳转
            setTimeout(() => {
                alert('登录成功！欢迎回来，' + username);
                // 实际应用中这里应该是页面跳转
                // window.location.href = '/dashboard';
            }, 1500);

        } catch (error) {
            // 显示错误消息
            loginResult.textContent = `登录失败: ${error.message}`;
            loginResult.className = 'error';
        }
    }

    // 表单提交
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;

        await login(username, password, remember);
    });

    // 忘记密码
    document.getElementById('forgot-password').addEventListener('click', (e) => {
        e.preventDefault();
        alert('忘记密码功能开发中...');
    });

    // 注册
    document.getElementById('register').addEventListener('click', (e) => {
        e.preventDefault();
        alert('注册功能开发中...');
    });

    // 检查记住我
    const rememberMe = localStorage.getItem('rememberMe');
    if (rememberMe === 'true') {
        document.getElementById('remember').checked = true;
    }
});
```

## 并发请求处理

### 场景描述
创建一个数据仪表板，使用Axios并发处理多个API请求。

### 实现步骤

1. **HTML结构**
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>数据仪表板</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>数据仪表板</h1>
    </header>

    <main>
        <div class="dashboard">
            <div class="metric-card">
                <h3>总销售额</h3>
                <div class="metric-value" id="total-sales">¥0</div>
                <div class="metric-change positive">+12%</div>
            </div>

            <div class="metric-card">
                <h3>订单数量</h3>
                <div class="metric-value" id="order-count">0</div>
                <div class="metric-change positive">+8%</div>
            </div>

            <div class="metric-card">
                <h3>活跃用户</h3>
                <div class="metric-value" id="active-users">0</div>
                <div class="metric-change negative">-3%</div>
            </div>

            <div class="metric-card">
                <h3>转化率</h3>
                <div class="metric-value" id="conversion-rate">0%</div>
                <div class="metric-change positive">+5%</div>
            </div>
        </div>

        <div class="controls">
            <button id="refresh-data">刷新数据</button>
            <select id="time-range">
                <option value="day">今天</option>
                <option value="week">本周</option>
                <option value="month">本月</option>
                <option value="year">今年</option>
            </select>
        </div>

        <div id="data-table">
            <h3>最近订单</h3>
            <table>
                <thead>
                    <tr>
                        <th>订单号</th>
                        <th>客户</th>
                        <th>金额</th>
                        <th>状态</th>
                        <th>时间</th>
                    </tr>
                </thead>
                <tbody id="orders-list">
                    <!-- 订单数据将在这里显示 -->
                </tbody>
            </table>
        </div>
    </main>

    <footer>
        <p>&copy; 2024 数据仪表板</p>
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

.order-item {
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
// 模拟Axios
const mockAxios = {
    get: (url, config = {}) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // 模拟API响应
                const timeRange = config.params?.range || 'day';

                const mockData = {
                    sales: Math.floor(Math.random() * 100000) + 50000,
                    orders: Math.floor(Math.random() * 1000) + 200,
                    users: Math.floor(Math.random() * 500) + 100,
                    conversion: (Math.random() * 10).toFixed(2),
                    ordersList: Array.from({length: 5}, (_, i) => ({
                        id: `ORD${String(i + 1).padStart(6, '0')}`,
                        customer: `客户${i + 1}`,
                        amount: Math.floor(Math.random() * 10000) + 1000,
                        status: ['已完成', '处理中', '已发货', '待付款'][Math.floor(Math.random() * 4)],
                        time: new Date(Date.now() - Math.random() * 86400000).toLocaleString()
                    }))
                };

                resolve({ data: mockData });
            }, 1000);
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const totalSalesEl = document.getElementById('total-sales');
    const orderCountEl = document.getElementById('order-count');
    const activeUsersEl = document.getElementById('active-users');
    const conversionRateEl = document.getElementById('conversion-rate');
    const ordersList = document.getElementById('orders-list');
    const refreshBtn = document.getElementById('refresh-data');
    const timeRangeSelect = document.getElementById('time-range');

    // 获取数据
    async function fetchData() {
        try {
            // 显示加载状态
            totalSalesEl.textContent = '加载中...';
            orderCountEl.textContent = '加载中...';
            activeUsersEl.textContent = '加载中...';
            conversionRateEl.textContent = '加载中...';

            // 并发获取多个数据
            const [salesResponse, ordersResponse, usersResponse, conversionResponse] = await Promise.all([
                mockAxios.get('/api/sales', { params: { range: timeRangeSelect.value } }),
                mockAxios.get('/api/orders', { params: { range: timeRangeSelect.value } }),
                mockAxios.get('/api/users', { params: { range: timeRangeSelect.value } }),
                mockAxios.get('/api/conversion', { params: { range: timeRangeSelect.value } })
            ]);

            // 更新指标
            totalSalesEl.textContent = `¥${salesResponse.data.sales.toLocaleString()}`;
            orderCountEl.textContent = salesResponse.data.orders.toLocaleString();
            activeUsersEl.textContent = salesResponse.data.users.toLocaleString();
            conversionRateEl.textContent = `${salesResponse.data.conversion}%`;

            // 更新订单列表
            updateOrdersList(salesResponse.data.ordersList);

        } catch (error) {
            console.error('获取数据失败:', error);
            // 显示错误状态
            totalSalesEl.textContent = '¥0';
            orderCountEl.textContent = '0';
            activeUsersEl.textContent = '0';
            conversionRateEl.textContent = '0%';

            const errorDiv = document.createElement('div');
            errorDiv.className = 'error';
            errorDiv.textContent = '获取数据失败，请稍后再试';
            document.querySelector('#data-table').appendChild(errorDiv);
        }
    }

    // 更新订单列表
    function updateOrdersList(orders) {
        ordersList.innerHTML = '';

        orders.forEach(order => {
            const row = document.createElement('tr');
            row.className = 'order-item';
            row.innerHTML = `
                <td>${order.id}</td>
                <td>${order.customer}</td>
                <td>¥${order.amount.toLocaleString()}</td>
                <td>${order.status}</td>
                <td>${order.time}</td>
            `;
            ordersList.appendChild(row);
        });
    }

    // 事件监听器
    refreshBtn.addEventListener('click', fetchData);
    timeRangeSelect.addEventListener('change', fetchData);

    // 初始化加载数据
    fetchData();
});
```

## 请求拦截器应用

### 场景描述
创建一个带有请求和响应拦截器的Axios实例，统一处理认证和错误。

### 实现步骤

1. **HTML结构**
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>拦截器示例</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>拦截器示例</h1>
    </header>

    <main>
        <div class="interceptor-demo">
            <div class="endpoint-section">
                <h3>API端点</h3>
                <input type="text" id="endpoint-input" value="https://api.example.com/data" placeholder="输入API端点URL">
                <button id="fetch-btn">获取数据</button>
            </div>

            <div class="response-section">
                <h3>响应数据</h3>
                <pre id="response-output">等待API响应...</pre>
            </div>

            <div class="status-section">
                <h3>请求状态</h3>
                <div id="request-status">
                    <p>状态: <span id="status-text">空闲</span></p>
                    <p>请求次数: <span id="request-count">0</span></p>
                    <p>成功次数: <span id="success-count">0</span></p>
                    <p>失败次数: <span id="failure-count">0</span></p>
                </div>
            </div>
        </div>
    </main>

    <footer>
        <p>&copy; 2024 拦截器示例</p>
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

.interceptor-demo {
    background: white;
    border-radius: 8px;
    padding: 25px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.endpoint-section, .response-section, .status-section {
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

#request-status {
    background: #f8f9fa;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    padding: 15px;
}

#request-status p {
    margin: 10px 0;
    color: #4a5568;
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
// 模拟Axios
const mockAxios = {
    create: () => {
        let requestCount = 0;
        let successCount = 0;
        let failureCount = 0;

        const instance = {
            get: (url, config = {}) => {
                return new Promise((resolve, reject) => {
                    requestCount++;

                    // 模拟请求延迟
                    setTimeout(() => {
                        // 模拟成功/失败
                        const isSuccess = Math.random() > 0.3;

                        if (isSuccess) {
                            successCount++;
                            resolve({
                                data: {
                                    message: '请求成功',
                                    timestamp: new Date().toISOString(),
                                    requestId: `req_${requestCount}`
                                }
                            });
                        } else {
                            failureCount++;
                            reject(new Error('网络错误'));
                        }
                    }, 1000);
                });
            },

            // 状态获取
            getStatus: () => ({
                requestCount,
                successCount,
                failureCount
            })
        };

        // 请求拦截器
        instance.interceptors = {
            request: {
                use: (onFulfilled, onRejected) => {
                    console.log('请求拦截器已设置');
                }
            },
            response: {
                use: (onFulfilled, onRejected) => {
                    console.log('响应拦截器已设置');
                }
            }
        };

        return instance;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const endpointInput = document.getElementById('endpoint-input');
    const fetchBtn = document.getElementById('fetch-btn');
    const responseOutput = document.getElementById('response-output');
    const statusText = document.getElementById('status-text');
    const requestCount = document.getElementById('request-count');
    const successCount = document.getElementById('success-count');
    const failureCount = document.getElementById('failure-count');

    // 创建Axios实例
    const apiClient = mockAxios.create();

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
        statusText.textContent = '请求中...';

        try {
            const response = await apiClient.get(endpoint);

            responseOutput.textContent = JSON.stringify(response.data, null, 2);
            responseOutput.className = 'success';
            statusText.textContent = '成功';

        } catch (error) {
            responseOutput.textContent = `错误: ${error.message}`;
            responseOutput.className = 'error';
            statusText.textContent = '失败';
            console.error('API调用失败:', error);
        }

        // 更新状态
        const status = apiClient.getStatus();
        requestCount.textContent = status.requestCount;
        successCount.textContent = status.successCount;
        failureCount.textContent = status.failureCount;
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
    statusText.textContent = '空闲';
});
```

## 文件下载与进度显示

### 场景描述
创建一个文件下载组件，使用Axios下载文件并显示下载进度。

### 实现步骤

1. **HTML结构**
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>文件下载</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>文件下载</h1>
    </header>

    <main>
        <div class="download-container">
            <div class="file-list">
                <h3>可用文件</h3>
                <ul id="files-list">
                    <li>
                        <span class="file-name">document.pdf</span>
                        <span class="file-size">2.5 MB</span>
                        <button class="download-btn" data-url="https://example.com/files/document.pdf">下载</button>
                    </li>
                    <li>
                        <span class="file-name">image.jpg</span>
                        <span class="file-size">1.2 MB</span>
                        <button class="download-btn" data-url="https://example.com/files/image.jpg">下载</button>
                    </li>
                    <li>
                        <span class="file-name">video.mp4</span>
                        <span class="file-size">15.8 MB</span>
                        <button class="download-btn" data-url="https://example.com/files/video.mp4">下载</button>
                    </li>
                </ul>
            </div>

            <div class="download-progress">
                <h3>下载进度</h3>
                <div id="progress-bar-container">
                    <div class="progress-bar">
                        <div class="progress-bar-fill" id="progress-bar"></div>
                    </div>
                    <div class="progress-text" id="progress-text">等待下载...</div>
                </div>
            </div>
        </div>
    </main>

    <footer>
        <p>&copy; 2024 文件下载应用</p>
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

.download-container {
    background: white;
    border-radius: 8px;
    padding: 25px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.file-list {
    margin-bottom: 30px;
}

.file-list h3 {
    color: #2d3748;
    margin-bottom: 15px;
}

.file-list ul {
    list-style: none;
    padding: 0;
}

.file-list li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    margin-bottom: 10px;
    background: #f8f9fa;
}

.file-name {
    font-weight: bold;
    color: #2d3748;
}

.file-size {
    color: #718096;
    margin: 0 15px;
}

.download-btn {
    padding: 8px 15px;
    background-color: #4a90e2;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.download-btn:hover {
    background-color: #357abd;
}

.download-btn:disabled {
    background-color: #cbd5e0;
    cursor: not-allowed;
}

.download-progress {
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

.loading {
    color: #718096;
    font-style: italic;
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
// 模拟Axios
const mockAxios = {
    get: (url, config = {}) => {
        return new Promise((resolve, reject) => {
            const totalSize = Math.floor(Math.random() * 20) + 1; // 1-20 MB
            let downloaded = 0;

            // 模拟下载进度
            const interval = setInterval(() => {
                downloaded += Math.random() * 2; // 每次增加0-2MB

                if (downloaded >= totalSize) {
                    clearInterval(interval);
                    resolve({
                        data: `文件下载完成: ${url}`,
                        totalSize: totalSize,
                        downloaded: totalSize
                    });
                } else {
                    // 模拟进度更新
                    if (config.onDownloadProgress) {
                        config.onDownloadProgress({
                            loaded: downloaded,
                            total: totalSize
                        });
                    }
                }
            }, 100);

            // 模拟可能的错误
            setTimeout(() => {
                if (Math.random() < 0.1) { // 10%的概率失败
                    clearInterval(interval);
                    reject(new Error('下载失败'));
                }
            }, 5000);
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const downloadButtons = document.querySelectorAll('.download-btn');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');

    // 下载文件
    async function downloadFile(url, fileName) {
        try {
            // 重置进度条
            progressBar.style.width = '0%';
            progressText.textContent = '准备下载...';

            // 找到对应的下载按钮并禁用
            const downloadBtn = Array.from(downloadButtons).find(btn => btn.dataset.url === url);
            if (downloadBtn) {
                downloadBtn.disabled = true;
                downloadBtn.textContent = '下载中...';
            }

            // 开始下载
            await mockAxios.get(url, {
                onDownloadProgress: (progress) => {
                    const percent = (progress.loaded / progress.total) * 100;
                    progressBar.style.width = `${percent}%`;
                    progressText.textContent = `下载中... ${Math.round(percent)}%`;
                }
            });

            // 下载完成
            progressText.textContent = '下载完成！';
            if (downloadBtn) {
                downloadBtn.textContent = '下载';
                downloadBtn.disabled = false;
            }

        } catch (error) {
            progressText.textContent = `下载失败: ${error.message}`;
            progressText.style.color = '#e74c3c';
            console.error('下载错误:', error);

            // 重新启用按钮
            const downloadBtn = Array.from(downloadButtons).find(btn => btn.dataset.url === url);
            if (downloadBtn) {
                downloadBtn.textContent = '下载';
                downloadBtn.disabled = false;
            }
        }
    }

    // 事件监听器
    downloadButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const url = btn.dataset.url;
            const fileName = btn.parentElement.querySelector('.file-name').textContent;
            downloadFile(url, fileName);
        });
    });
});
```

## Axios应用场景总结

Axios是强大的HTTP客户端，通过以上应用场景，你可以：

1. **用户认证**：实现登录系统和token管理
2. **并发请求**：同时处理多个API请求
3. **拦截器**：统一处理请求和响应
4. **文件下载**：实现文件下载和进度显示

掌握这些应用场景后，你将能够使用Axios创建各种功能丰富的Web应用。