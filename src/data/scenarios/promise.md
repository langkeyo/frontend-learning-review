## 应用场景

### 场景 1：顺序执行异步操作

使用 Promise 链实现顺序执行。

```javascript
// 登录 → 获取用户信息 → 获取用户文章
login(email, password)
  .then(token => getUserInfo(token))
  .then(user => getUserPosts(user.id))
  .then(posts => console.log(posts))
  .catch(error => console.error(error))
```

### 场景 2：并行执行多个请求

使用 Promise.all 同时发起多个请求。

```javascript
Promise.all([
  fetch('/api/user').then(r => r.json()),
  fetch('/api/posts').then(r => r.json()),
  fetch('/api/comments').then(r => r.json())
])
  .then(([user, posts, comments]) => {
    console.log(user, posts, comments)
  })
```

### 场景 3：请求超时处理

使用 Promise.race 实现超时。

```javascript
function fetchWithTimeout(url, timeout = 5000) {
  return Promise.race([
    fetch(url),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), timeout)
    )
  ])
}
```

### 场景 4：无论成功失败都执行

```javascript
fetch('/api/data')
  .then(response => response.json())
  .finally(() => {
    loadingIndicator.hide()  // 无论成功失败都隐藏加载动画
  })
```

### 场景 5：获取最快响应

```javascript
// 从多个 CDN 获取资源，使用最先响应的
Promise.race([
  fetch('https://cdn1.com/file.js'),
  fetch('https://cdn2.com/file.js'),
  fetch('https://cdn3.com/file.js')
])
  .then(response => response.text())
```
