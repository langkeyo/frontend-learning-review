# Fetch API

## 什么是Fetch API？

Fetch API是一个现代的、基于Promise的HTTP客户端，用于在浏览器和Node.js中进行网络请求。它提供了一个更强大和灵活的替代传统`XMLHttpRequest`的方法。

## 基本用法

### GET请求

```javascript
fetch('https://api.example.com/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

### POST请求

```javascript
fetch('https://api.example.com/data', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Alice',
    age: 30
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

## Fetch API的主要特性

### Promise-based

```javascript
// 使用async/await
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

### 响应处理

```javascript
fetch('https://api.example.com/data')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

### 响应类型

```javascript
fetch('https://api.example.com/data')
  .then(response => {
    // 转换为JSON
    return response.json();

    // 转换为文本
    // return response.text();

    // 转换为Blob
    // return response.blob();

    // 转换为ArrayBuffer
    // return response.arrayBuffer();
  });
```

## 请求配置

### 请求头

```javascript
fetch('https://api.example.com/data', {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your-token'
  }
});
```

### 请求体

```javascript
fetch('https://api.example.com/data', {
  method: 'POST',
  body: JSON.stringify({
    name: 'Alice',
    age: 30
  })
});
```

### 超时处理

```javascript
function fetchWithTimeout(url, options, timeout = 5000) {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timed out')), timeout)
    )
  ]);
}

// 使用
fetchWithTimeout('https://api.example.com/data', {}, 3000)
  .then(response => response.json())
  .catch(error => console.error(error));
```

## 实用场景

### 获取JSON数据

```javascript
async function getUser(userId) {
  const response = await fetch(`https://api.example.com/users/${userId}`);
  if (!response.ok) {
    throw new Error('User not found');
  }
  return await response.json();
}

// 使用
getUser(123)
  .then(user => console.log(user))
  .catch(error => console.error(error));
```

### 上传文件

```javascript
async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('https://api.example.com/upload', {
    method: 'POST',
    body: formData
  });

  return await response.json();
}
```

### 并发请求

```javascript
async function fetchMultipleUrls(urls) {
  const promises = urls.map(url =>
    fetch(url).then(response => response.json())
  );

  return Promise.all(promises);
}

// 使用
fetchMultipleUrls([
  'https://api.example.com/data1',
  'https://api.example.com/data2'
])
.then(results => console.log(results))
.catch(error => console.error(error));
```

### 流式处理大响应

```javascript
async function streamLargeResponse(url) {
  const response = await fetch(url);

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  let result = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    result += decoder.decode(value, { stream: true });
  }

  return result;
}
```

### 处理CORS

```javascript
fetch('https://api.example.com/data', {
  mode: 'cors', // 跨域请求
  credentials: 'include' // 包含cookie
})
.then(response => response.json())
.then(data => console.log(data));
```

## 错误处理

### 网络错误 vs HTTP错误

```javascript
fetch('https://api.example.com/data')
  .then(response => {
    if (!response.ok) {
      // HTTP错误（如404, 500）
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => console.log(data))
  .catch(error => {
    if (error.name === 'TypeError') {
      // 网络错误（如DNS解析失败）
      console.error('Network error:', error);
    } else {
      // HTTP错误
      console.error('HTTP error:', error);
    }
  });
```

### 全局错误处理

```javascript
function handleFetchError(error) {
  console.error('Fetch error:', error);
  // 可以显示用户友好的错误消息
  alert('Something went wrong. Please try again later.');
}

// 使用
fetch('https://api.example.com/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(handleFetchError);
```

## 高级用法

### 请求拦截器

```javascript
function createFetchInterceptor() {
  const originalFetch = window.fetch;

  window.fetch = function(url, options = {}) {
    // 添加默认头部
    options.headers = {
      ...options.headers,
      'X-Custom-Header': 'value'
    };

    return originalFetch(url, options);
  };
}

// 使用
createFetchInterceptor();
```

### 响应拦截器

```javascript
function wrapFetch() {
  const originalFetch = window.fetch;

  return function(url, options) {
    return originalFetch(url, options)
      .then(response => {
        // 检查响应状态
        if (response.status === 401) {
          // 处理未授权错误
          window.location.href = '/login';
        }
        return response;
      });
  };
}

// 使用
window.fetch = wrapFetch();
```

### 重试机制

```javascript
async function fetchWithRetry(url, options = {}, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        return response;
      }
    } catch (error) {
      if (i === retries - 1) throw error;
    }

    // 等待一段时间再重试
    await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
  }
}

// 使用
fetchWithRetry('https://api.example.com/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

### 缓存控制

```javascript
fetch('https://api.example.com/data', {
  cache: 'no-cache', // 不使用缓存
  // 或 'default', 'reload', 'force-cache', 'only-if-cached'
})
.then(response => response.json())
.then(data => console.log(data));
```

## 最佳实践

### 1. 总是检查response.ok

```javascript
async function fetchData() {
  const response = await fetch('https://api.example.com/data');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}
```

### 2. 使用async/await而不是.then()

```javascript
// 不推荐
fetch('https://api.example.com/data')
  .then(response => response.json())
  .then(data => console.log(data));

// 推荐
async function fetchData() {
  const response = await fetch('https://api.example.com/data');
  const data = await response.json();
  console.log(data);
}
```

### 3. 处理网络错误和HTTP错误

```javascript
async function safeFetch(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    if (error.name === 'TypeError') {
      console.error('Network error:', error);
    } else {
      console.error('HTTP error:', error);
    }
    throw error;
  }
}
```

### 4. 设置适当的超时

```javascript
async function fetchWithTimeout(url, timeout = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timed out');
    }
    throw error;
  }
}
```

### 5. 使用JSON辅助函数

```javascript
async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

// 使用
fetchJson('https://api.example.com/data')
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

## 常见误区

### 1. 忽略response.ok

```javascript
// 错误：不检查HTTP状态码
fetch('https://api.example.com/data')
  .then(response => response.json())
  .then(data => console.log(data));

// 可能导致处理404或500状态的响应
```

### 2. 忘记处理网络错误

```javascript
// 错误：只处理HTTP错误，不处理网络错误
fetch('https://api.example.com/data')
  .then(response => response.json())
  .catch(error => console.error(error));

// 网络错误（如DNS解析失败）会被捕获，但HTTP错误需要额外检查
```

### 3. 不正确的JSON解析

```javascript
// 错误：在response.json()之前访问response.body
fetch('https://api.example.com/data')
  .then(response => {
    console.log(response.body); // 错误：body已经被读取
    return response.json();
  });

// 正确：response.json()会自动处理
```

### 4. 忽略CORS问题

```javascript
// 错误：跨域请求没有正确配置
fetch('https://api.example.com/data');

// 正确：配置CORS
fetch('https://api.example.com/data', {
  mode: 'cors',
  credentials: 'include'
});
```

### 5. 过度使用fetch

```javascript
// 不推荐：在循环中频繁调用fetch
for (const url of urls) {
  fetch(url);
}

// 推荐：使用Promise.all并发请求
Promise.all(urls.map(url => fetch(url).then(r => r.json())));
```

Fetch API是现代JavaScript进行网络请求的标准方式，掌握它可以让你的网络请求代码更加简洁、可读和可维护。它与Promise和async/await无缝集成，提供了强大的错误处理和响应处理能力。