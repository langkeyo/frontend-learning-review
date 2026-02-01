## 概念

CORS（跨域资源共享）是浏览器的一种安全机制，限制一个域的网页请求另一个域的资源。

### 同源策略

同源是指：
- 协议相同（http/https）
- 域名相同
- 端口相同

**同源示例：**
```
https://example.com/page1.html
https://example.com/page2.html    ✓ 同源
https://example.com:8080/page2.html  ✗ 不同端口
https://api.example.com/page2.html  ✗ 不同子域
https://example.com/page2.html    ✗ 不同协议
```

### CORS 工作流程

#### 简单请求
浏览器直接发送请求，带 `Origin` 头部。

```
GET /api/data
Origin: https://example.com
```

服务器返回：
```
Access-Control-Allow-Origin: https://example.com
```

#### 预检请求（OPTIONS）
对于复杂请求，浏览器先发送 OPTIONS 请求。

```
OPTIONS /api/data
Origin: https://example.com
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type
```

### 常见响应头

| 头部 | 说明 |
|------|------|
| `Access-Control-Allow-Origin` | 允许的源 |
| `Access-Control-Allow-Methods` | 允许的方法 |
| `Access-Control-Allow-Headers` | 允许的头部 |
| `Access-Control-Allow-Credentials` | 是否允许携带凭证 |
| `Access-Control-Max-Age` | 预检缓存时间 |

### 解决方案

**1. 后端设置 CORS 头**
```javascript
res.header('Access-Control-Allow-Origin', '*')
```

**2. 使用代理**
```javascript
// 开发环境使用代理
const proxyUrl = 'https://cors-anywhere.herokuapp.com/'
fetch(proxyUrl + targetUrl)
```
