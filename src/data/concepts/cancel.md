## 概念

请求取消是指在需要时中止正在进行的网络请求，避免浪费资源和处理已过期的数据。

### AbortController

现代浏览器使用 AbortController 来取消请求。

```javascript
// 创建控制器
const controller = new AbortController()
const signal = controller.signal

// 发送请求
fetch('/api/data', { signal })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => {
    if (error.name === 'AbortError') {
      console.log('请求被取消')
    } else {
      console.error('请求失败', error)
    }
  })

// 取消请求
controller.abort()
```

### 使用场景

#### 1. 组件卸载时取消请求

```javascript
let controller = null

function loadData() {
  // 取消之前的请求
  if (controller) {
    controller.abort()
  }

  controller = new AbortController()

  fetch('/api/data', { signal: controller.signal })
    .then(response => response.json())
    .then(data => setState(data))
}

// 组件卸载时
useEffect(() => {
  loadData()
  return () => {
    if (controller) {
      controller.abort()
    }
  }
}, [])
```

#### 2. 输入框防抖搜索

```javascript
let controller = null

async function search(keyword) {
  // 取消上一次请求
  if (controller) {
    controller.abort()
  }

  controller = new AbortController()

  try {
    const response = await fetch(`/api/search?q=${keyword}`, {
      signal: controller.signal
    })
    const data = await response.json()
    displayResults(data)
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error(error)
    }
  }
}

// 防抖调用
debounce(search, 300)(keyword)
```

#### 3. 取消多个请求

```javascript
const controller = new AbortController()
const signal = controller.signal

Promise.all([
  fetch('/api/user', { signal }),
  fetch('/api/posts', { signal }),
  fetch('/api/comments', { signal })
])
  .then(/* ... */)

// 取消所有请求
controller.abort()
```

### Axios 取消

如果使用 Axios，可以使用 CancelToken（旧版）或 AbortController（新版）。

```javascript
// 使用 AbortController（Axios 0.22+）
const controller = new AbortController()

axios.get('/api/data', {
  signal: controller.signal
})

controller.abort()
```
