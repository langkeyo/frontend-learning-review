## 应用场景

### 场景 1：简单的 AbortController

```javascript
const controller = new AbortController()
const signal = controller.signal

fetch('/api/data', { signal })
  .then(response => response.json())
  .catch(error => {
    if (error.name === 'AbortError') {
      console.log('请求已取消')
    }
  })
```

### 场景 2：在组件卸载时取消

```javascript
const fetchData = () => {
  const controller = new AbortController()

  // 在组件卸载时清理
  return () => controller.abort()
}

const abort = fetchData()
// ... 组件卸载时
abort()
```

### 场景 3：多个请求共享 AbortController

```javascript
const controller = new AbortController()
const signal = controller.signal

// 取消时会同时取消所有使用该 signal 的请求
Promise.all([
  fetch('/api/user', { signal }),
  fetch('/api/posts', { signal }),
  fetch('/api/comments', { signal })
])
```

### 场景 4：超时后自动取消

```javascript
async function fetchWithTimeout(url, timeout = 5000) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, { signal: controller.signal })
    clearTimeout(timeoutId)
    return await response.json()
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('请求超时')
    }
    throw error
  }
}
```

### 场景 5：AbortController + 事件

```javascript
const controller = new AbortController()

// 当用户点击取消按钮时
document.getElementById('cancel-btn').addEventListener('click', () => {
  controller.abort()
})
```
