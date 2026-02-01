## 应用场景

### 场景 1：获取数据

```javascript
async function loadPosts() {
  try {
    const response = await fetch('/api/posts')
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    const posts = await response.json()
    return posts
  } catch (error) {
    console.error('加载失败', error)
  }
}
```

### 场景 2：提交表单

```javascript
async function submitForm(data) {
  const response = await fetch('/api/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  if (response.ok) {
    return await response.json()
  }
}
```

### 场景 3：上传文件

```javascript
async function uploadFile(file) {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  })

  return await response.json()
}
```

### 场景 4：流式读取

```javascript
async function fetchStream(url) {
  const response = await fetch(url)
  const reader = response.body.getReader()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    console.log(new TextDecoder().decode(value))
  }
}
```

### 场景 5：带认证的请求

```javascript
async function fetchWithAuth(url) {
  const token = localStorage.getItem('token')

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })

  return response
}
```
