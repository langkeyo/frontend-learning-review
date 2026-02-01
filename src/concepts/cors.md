# 跨域处理 (CORS)

## 什么是CORS？

CORS（Cross-Origin Resource Sharing，跨源资源共享）是一种浏览器安全机制，用于限制一个源（域名、协议、端口）的文档或脚本如何与另一个源的资源进行交互。

## 为什么需要CORS？

浏览器出于安全考虑，默认禁止跨域请求。CORS提供了一种安全的方式，允许服务器明确地告诉浏览器："这个源可以访问我的资源"。

## 基本概念

### 同源 vs 跨源

- **同源**：协议、域名、端口都相同
- **跨源**：协议、域名、端口任意一个不同

```javascript
// 同源示例
https://example.com:8080/page1.html -> https://example.com:8080/api/data

// 跨源示例
https://example.com:8080/page1.html -> https://api.example.com/data
```

## CORS请求类型

### 简单请求

满足以下条件的请求被认为是简单请求：

1. HTTP方法：GET、HEAD、POST
2. 头部字段：Accept、Accept-Language、Content-Language、Content-Type（仅限application/x-www-form-urlencoded、multipart/form-data、text/plain）
3. 没有自定义头部

简单请求会发送一个预检请求。

### 预检请求

对于非简单请求（如PUT、DELETE方法，或包含自定义头部），浏览器会先发送一个OPTIONS请求来检查服务器是否允许该请求。

## 服务器端CORS配置

### Node.js (Express)

```javascript
const express = require('express');
const cors = require('cors');
const app = express();

// 允许所有来源
app.use(cors());

// 或更细粒度的配置
app.use(cors({
  origin: 'https://example.com',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.get('/data', (req, res) => {
  res.json({ message: 'Hello from server!' });
});
```

### Python (Flask)

```python
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # 允许所有来源

# 或更细粒度的配置
cors = CORS(app, resources={r"/api/*": {"origins": "https://example.com"}})

@app.route('/data')
def get_data():
    return jsonify({"message": "Hello from server!"})
```

### Java (Spring Boot)

```java
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DataController {

    @CrossOrigin(origins = "https://example.com")
    @GetMapping("/data")
    public Map<String, String> getData() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Hello from server!");
        return response;
    }
}
```

## 客户端CORS配置

### Fetch API

```javascript
fetch('https://api.example.com/data', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'X-Custom-Header': 'value'
  },
  mode: 'cors', // 显式指定CORS模式
  credentials: 'include' // 包含cookie
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error(error));
```

### XMLHttpRequest

```javascript
const xhr = new XMLHttpRequest();
xhr.open('GET', 'https://api.example.com/data', true);
xhr.withCredentials = true; // 包含cookie
xhr.setRequestHeader('Content-Type', 'application/json');
xhr.onreadystatechange = function() {
  if (xhr.readyState === 4) {
    if (xhr.status === 200) {
      console.log(JSON.parse(xhr.responseText));
    }
  }
};
xhr.send();
```

## 实用场景

### 允许特定来源

```javascript
// 服务器端配置
app.use(cors({
  origin: 'https://myapp.com',
  credentials: true
}));

// 客户端配置
fetch('https://api.example.com/data', {
  credentials: 'include'
});
```

### 允许多个来源

```javascript
const allowedOrigins = ['https://app1.com', 'https://app2.com'];

app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
```

### 动态CORS配置

```javascript
app.use(cors({
  origin: (origin, callback) => {
    // 根据请求动态决定是否允许
    const isAllowed = checkOrigin(origin);
    callback(null, isAllowed);
  }
}));
```

### 处理预检请求

```javascript
// 服务器端配置
app.options('/api/data', cors()); // 处理OPTIONS预检请求

app.post('/api/data', cors(), (req, res) => {
  res.json({ message: 'Data received' });
});
```

### 跨域withCredentials

```javascript
// 服务器端配置
app.use(cors({
  origin: 'https://example.com',
  credentials: true
}));

// 客户端配置
fetch('https://api.example.com/data', {
  method: 'POST',
  body: JSON.stringify({ data: 'value' }),
  credentials: 'include' // 包含cookie
});
```

## 常见问题及解决方案

### 1. 'No Access-Control-Allow-Origin' header

```javascript
// 服务器端解决方案
app.use(cors({
  origin: '*', // 或特定域名
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 或在响应头中添加
res.header('Access-Control-Allow-Origin', 'https://example.com');
```

### 2. 预检请求失败

```javascript
// 确保服务器处理OPTIONS请求
app.options('/api/data', (req, res) => {
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.sendStatus(200);
});
```

### 3. Cookie不被发送

```javascript
// 服务器端配置
app.use(cors({
  origin: 'https://example.com',
  credentials: true
}));

// 客户端配置
fetch('https://api.example.com/data', {
  credentials: 'include'
});
```

### 4. 自定义头部不被允许

```javascript
// 服务器端配置
app.use(cors({
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Custom-Header']
}));

// 或在预检响应中指定
res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Custom-Header');
```

## 最佳实践

### 1. 最小化CORS配置

```javascript
// 不推荐：允许所有来源
app.use(cors());

// 推荐：只允许必要的来源
app.use(cors({
  origin: 'https://myapp.com',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### 2. 使用环境变量配置CORS

```javascript
// 根据环境配置不同的CORS策略
const corsConfig = process.env.NODE_ENV === 'production'
  ? { origin: 'https://production.com' }
  : { origin: '*' };

app.use(cors(corsConfig));
```

### 3. 处理CORS错误

```javascript
async function fetchWithCors(url) {
  try {
    const response = await fetch(url, { mode: 'cors' });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('CORS')) {
      console.error('CORS error:', error);
      // 可以显示用户友好的错误消息
      alert('Cross-origin request not allowed. Please check your CORS configuration.');
    }
    throw error;
  }
}
```

### 4. 测试CORS配置

```javascript
// 使用curl测试CORS
curl -I -X OPTIONS https://api.example.com/data \
  -H "Origin: https://test.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type"

// 检查响应头中的Access-Control-Allow-Origin
```

### 5. 考虑使用代理

```javascript
// 在开发环境中使用代理
// package.json
"proxy": "https://api.example.com"

// 在代码中
fetch('/data') // 会被代理到 https://api.example.com/data
```

## 替代方案

### JSONP（JSON with Padding）

```javascript
function handleResponse(data) {
  console.log(data);
}

const script = document.createElement('script');
script.src = 'https://api.example.com/data?callback=handleResponse';
document.body.appendChild(script);
```

### 代理服务器

```javascript
// 使用Nginx作为代理
location /api/ {
  proxy_pass https://api.example.com;
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
}
```

### PostMessage

```javascript
// 父窗口
const childWindow = window.open('https://example.com');

// 发送消息
childWindow.postMessage({ data: 'hello' }, 'https://example.com');

// 接收消息
window.addEventListener('message', (event) => {
  if (event.origin === 'https://example.com') {
    console.log(event.data);
  }
});
```

CORS是现代Web开发中必须面对的安全机制。正确配置CORS可以确保你的应用能够安全地进行跨域请求，同时保护用户数据安全。理解CORS的工作原理和配置方法对于开发跨域应用至关重要。