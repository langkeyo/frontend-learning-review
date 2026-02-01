## 概念

超时和重试是指在网络请求失败或超时时，自动重试请求以提高可靠性。

### 超时处理

使用 AbortController 实现超时：

```javascript
function fetchWithTimeout(url, options = {}, timeout = 5000) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => {
    controller.abort()
  }, timeout)

  return fetch(url, {
    ...options,
    signal: controller.signal
  })
    .finally(() => {
      clearTimeout(timeoutId)
    })
}

// 使用
fetchWithTimeout('/api/data')
  .then(response => response.json())
  .catch(error => {
    if (error.name === 'AbortError') {
      console.error('请求超时')
    } else {
      console.error('请求失败', error)
    }
  })
```

### 重试机制

#### 指数退避重试

```javascript
async function fetchWithRetry(url, options = {}, retries = 3, delay = 1000) {
  try {
    const response = await fetch(url, options)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    return response
  } catch (error) {
    if (retries > 0) {
      console.log(`重试中... 剩余次数: ${retries}`)
      await new Promise(resolve => setTimeout(resolve, delay))
      return fetchWithRetry(url, options, retries - 1, delay * 2)
    }
    throw error
  }
}

// 使用
fetchWithRetry('/api/data')
  .then(response => response.json())
  .catch(error => {
    console.error('最终失败:', error)
  })
```

### 完整封装

```javascript
async function fetchWithConfig(url, options = {}) {
  const {
    timeout = 5000,
    retries = 3,
    retryDelay = 1000,
    backoff = 2
  } = options.config || {}

  let lastError = null
  let currentDelay = retryDelay

  for (let i = 0; i <= retries; i++) {
    try {
      // 添加超时控制
      const response = await fetchWithTimeout(url, options, timeout)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      return response
    } catch (error) {
      lastError = error

      // 最后一次尝试失败，不再重试
      if (i === retries) {
        break
      }

      // 只有网络错误或5xx错误才重试
      const shouldRetry =
        error.name === 'AbortError' ||
        error.message.includes('5')

      if (!shouldRetry) {
        break
      }

      console.log(`重试 ${i + 1}/${retries}...`)
      await new Promise(resolve => setTimeout(resolve, currentDelay))
      currentDelay *= backoff
    }
  }

  throw lastError
}

// 使用
const result = await fetchWithConfig('/api/data', {
  config: { timeout: 3000, retries: 2 }
})
```

### 使用第三方库

推荐的 HTTP 库已内置这些功能：

```javascript
// Axios
axios.get('/api/data', {
  timeout: 5000
})

// ky
import ky from 'ky'

const data = await ky.get('/api/data', {
  timeout: 5000,
  retry: { limit: 3, methods: ['get'], statusCodes: [408, 429, 500, 502, 503, 504] }
}).json()
```
