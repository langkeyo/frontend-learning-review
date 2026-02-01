# Fetch API概念

## 什么是Fetch API？

Fetch API是现代浏览器提供的接口，用于发起网络请求。它提供了一个更强大和灵活的替代方案来取代传统的XMLHttpRequest。

## Fetch API的优势

- **基于Promise**：使用Promise处理异步操作
- **更简洁的语法**：比XMLHttpRequest更易读
- **支持流处理**：可以处理大文件和流数据
- **更好的错误处理**：区分网络错误和HTTP错误
- **模块化**：可以单独使用或与其他API结合

## 基本Fetch请求

### GET请求

```javascript
fetch('https://api.example.com/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('请求失败:', error));
```

### POST请求

```javascript
const userData = {
  name: "张三",
  email: "zhangsan@example.com"
};

fetch('https://api.example.com/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(userData)
})
.then(response => response.json())
.then(data => console.log('创建成功:', data))
.catch(error => console.error('POST请求失败:', error));
```

## Fetch API的核心概念

### Response对象

Fetch返回的Response对象包含以下属性：

- `status`: HTTP状态码
- `statusText`: 状态文本
- `ok`: 如果状态码在200-299范围内，则为true
- `headers`: 响应头
- `url`: 请求的URL
- `body`: 响应体（可读流）

### 读取响应数据

```javascript
fetch('https://api.example.com/data')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP错误! 状态: ${response.status}`);
    }
    return response.json(); // 或 response.text(), response.blob() 等
  })
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

## 请求配置

### 请求方法

```javascript
fetch('https://api.example.com/data', {
  method: 'GET', // 或 'POST', 'PUT', 'DELETE' 等
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  body: JSON.stringify({ key: 'value' }), // 仅适用于POST、PUT等
  mode: 'cors', // 请求模式：cors, no-cors, same-origin
  credentials: 'same-origin', // 是否包含cookie：omit, same-origin, include
  cache: 'default', // 缓存模式
  redirect: 'follow', // 重定向处理：follow, error, manual
  referrer: 'no-referrer', // 引用来源
  referrerPolicy: 'no-referrer-when-downgrade', // 引用策略
  integrity: 'sha256-abc123...', // 子资源完整性
  keepalive: true, // 保持连接
  signal: controller.signal // 中断信号
})
```

### 查询参数

```javascript
const params = new URLSearchParams({
  id: 123,
  sort: 'name',
  page: 1
});

fetch(`https://api.example.com/users?${params}`)
  .then(response => response.json())
  .then(data => console.log(data));
```

## 错误处理

### 区分网络错误和HTTP错误

```javascript
fetch('https://api.example.com/data')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP错误! 状态: ${response.status}`);
    }
    return response.json();
  })
  .then(data => console.log(data))
  .catch(error => {
    if (error.name === 'TypeError') {
      console.error('网络错误:', error.message);
    } else {
      console.error('HTTP错误:', error.message);
    }
  });
```

### 超时处理

```javascript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 5000);

fetch('https://api.example.com/data', {
  signal: controller.signal
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => {
  if (error.name === 'AbortError') {
    console.error('请求超时');
  } else {
    console.error('请求失败:', error);
  }
})
.finally(() => clearTimeout(timeoutId));
```

## 高级用法

### 并发请求

```javascript
function getUser() {
  return fetch('https://api.example.com/users/1').then(res => res.json());
}

function getPermissions() {
  return fetch('https://api.example.com/users/1/permissions').then(res => res.json());
}

Promise.all([getUser(), getPermissions()])
  .then(([user, permissions]) => {
    console.log('用户:', user);
    console.log('权限:', permissions);
  })
  .catch(error => console.error(error));
```

### 请求取消

```javascript
const controller = new AbortController();

fetch('https://api.example.com/data', {
  signal: controller.signal
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => {
  if (error.name === 'AbortError') {
    console.log('请求已取消');
  }
});

// 取消请求
controller.abort();
```

### 流处理

```javascript
fetch('https://api.example.com/large-file')
  .then(response => {
    const reader = response.body.getReader();
    return new ReadableStream({
      start(controller) {
        function push() {
          reader.read().then(({ done, value }) => {
            if (done) {
              controller.close();
              return;
            }
            controller.enqueue(value);
            push();
          });
        }
        push();
      }
    });
  })
  .then(stream => new Response(stream))
  .then(response => response.blob())
  .then(data => console.log(data));
```

## 请求拦截器

虽然Fetch本身没有内置拦截器，但可以通过包装函数实现：

```javascript
function fetchWithInterceptors(url, options = {}) {
  // 请求拦截器
  const requestInterceptor = (config) => {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${getToken()}`;
    return config;
  };

  // 响应拦截器
  const responseInterceptor = (response) => {
    if (!response.ok) {
      throw new Error(`HTTP错误! 状态: ${response.status}`);
    }
    return response.json();
  };

  const config = requestInterceptor({ url, ...options });
  return fetch(config.url, config)
    .then(responseInterceptor)
    .catch(error => {
      // 错误拦截器
      console.error('请求失败:', error);
      throw error;
    });
}

// 使用
fetchWithInterceptors('https://api.example.com/data')
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

## Fetch与XMLHttpRequest对比

| 特性 | Fetch API | XMLHttpRequest |
|------|-----------|---------------|
| 语法 | 更简洁 | 更复杂 |
| Promise | 内置支持 | 需要包装 |
| 流处理 | 支持 | 不支持 |
| 中断 | 支持 | 支持 |
| 跨域 | 更好的支持 | 支持 |
| 错误处理 | 更清晰 | 需要检查状态码 |

## 最佳实践

1. **始终检查response.ok**：确保HTTP状态码在200-299范围内
2. **使用try/catch**：处理Promise rejection
3. **设置超时**：避免长时间等待
4. **处理取消**：提供用户取消选项
5. **错误分类**：区分网络错误和HTTP错误
6. **使用合适的响应类型**：json、text、blob等
7. **考虑缓存策略**：根据需求设置cache选项
8. **安全考虑**：使用HTTPS，验证SSL证书

## 兼容性

Fetch API在现代浏览器中得到广泛支持，但在旧版浏览器中可能需要polyfill：

```html
<!-- 引入Fetch polyfill -->
<script src="https://cdn.jsdelivr.net/npm/@ungap/fetch"></script>
```

掌握Fetch API是现代前端开发的重要技能，能够让你更高效地进行网络请求。