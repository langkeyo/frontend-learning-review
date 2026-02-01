## 应用场景

### 场景 1：线性退避重试

```javascript
async function fetchWithRetry(url, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url)
      if (response.ok) {
        return await response.json()
      }
    } catch (error) {
      if (i === maxRetries - 1) throw error

      // 等待后重试，使用指数退避
      const delay = Math.pow(2, i) * 1000
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
}
```

### 场景 2：固定延迟重试

```javascript
async function fetchWithFixedDelay(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url)
      if (response.ok) {
        return await response.json()
      }
    } catch (error) {
      if (i === retries - 1) throw error

      // 固定延迟
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }
}
```

### 场景 3：带超时的重试

```javascript
async function fetchWithTimeoutAndRetry(url, timeout = 3000, maxRetries = 2) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    for (let i = 0; i < maxRetries; i++) {
      const response = await fetch(url, {
        signal: controller.signal
      })

      if (response.ok) {
        clearTimeout(timeoutId)
        return await response.json()
      }
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('请求超时')
    }
    if (i === maxRetries - 1) throw error

    await new Promise(resolve => setTimeout(resolve, 1000))
    }
  } finally {
    clearTimeout(timeoutId)
  }
}
```

### 场景 4：请求队列

```javascript
class RequestQueue {
  constructor(maxConcurrent = 3) {
    this.queue = []
    this.active = 0
    this.maxConcurrent = maxConcurrent
  }

  async add(requestFn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ fn: requestFn, resolve, reject })
      this.process()
    })
  }

  process() {
    while (this.active < this.maxConcurrent && this.queue.length > 0) {
      const { fn, resolve, reject } = this.queue.shift()
      this.active++

      fn().then(resolve).catch(reject).finally(() => {
        this.active--
        this.process()
      })
    }
  }
}
```

### 场景 5：指数退避 + 抖动

```javascript
async function fetchWithJitter(url, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      // 添加随机抖动，避免雷群效应
      const jitter = Math.random() * 500
      const response = await fetch(url)

      if (response.ok) {
        return await response.json()
      }
    } catch (error) {
      if (i === maxRetries - 1) throw error

      // 指数退避 + 抖动
      const delay = Math.pow(2, i) * 1000 + jitter
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
}
```
