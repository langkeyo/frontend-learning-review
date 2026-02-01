## 概念

Fetch API 是浏览器提供的原生网络请求接口，基于 Promise 设计，用于替代传统的 XMLHttpRequest。

### 基本语法

```javascript
fetch(url)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error))
```

### Response 对象

| 方法 | 说明 |
|------|------|
| `response.json()` | 解析 JSON |
| `response.text()` | 获取文本 |
| `response.blob()` | 获取二进制 |
| `response.arrayBuffer()` | 获取 ArrayBuffer |
| `response.formData()` | 获取 FormData |

### 发送不同类型的请求

```javascript
// GET 请求
fetch('/api/users')

// POST 请求
fetch('/api/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ name: '张三' })
})

// PUT 请求
fetch('/api/users/1', {
  method: 'PUT',
  body: JSON.stringify({ name: '李四' })
})

// DELETE 请求
fetch('/api/users/1', {
  method: 'DELETE'
})
```

### 错误处理

注意：fetch 只有在**网络错误**时才会 reject，HTTP 状态码（如 404、500）不会触发 reject。

```javascript
fetch('/api/data')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  })
  .catch(error => console.error(error))
```
