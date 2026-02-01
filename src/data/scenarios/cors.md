## 应用场景

### 场景 1：前端调用第三方 API

```javascript
// 直接调用可能遇到 CORS 问题
fetch('https://api.weather.com/data')

// 解决方案：后端代理
fetch('/api/weather')  // 代理到 https://api.weather.com/data
```

### 场景 2：开发环境代理配置

Vite 开发服务器配置代理：

```javascript
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://api.example.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```

### 场景 3：携带 Cookie

```javascript
// 需要服务器设置: Access-Control-Allow-Credentials: true
fetch('/api/data', {
  credentials: 'include'  // 包含 cookie
})
```

### 场景 4：自定义请求头

```javascript
fetch('/api/data', {
  headers: {
    'Content-Type': 'application/json',
    'X-Custom-Header': 'value'
  }
})
```

### 场景 5：处理 CORS 错误

```javascript
async function safeFetch(url) {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      console.error('可能是 CORS 问题')
    }
    throw error
  }
}
```
