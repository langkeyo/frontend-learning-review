## 概念

Promise 是 JavaScript 中处理异步操作的对象，代表一个异步操作的最终完成或失败。

### 状态

Promise 有三种状态：
- **Pending**：进行中
- **Fulfilled**：已成功
- **Rejected**：已失败

状态转换只能是单向的：Pending → Fulfilled 或 Pending → Rejected

### 基本用法

```javascript
const promise = new Promise((resolve, reject) => {
  // 异步操作
  setTimeout(() => {
    if (success) {
      resolve('成功!')
    } else {
      reject('失败!')
    }
  }, 1000)
})

promise
  .then(value => console.log(value))
  .catch(error => console.error(error))
```

### Promise 链

```javascript
fetch('/api/user')
  .then(res => res.json())
  .then(user => fetch(`/api/posts/${user.id}`))
  .then(res => res.json())
  .then(posts => console.log(posts))
  .catch(error => console.error(error))
```

### 静态方法

| 方法 | 说明 |
|------|------|
| `Promise.all()` | 全部成功才成功 |
| `Promise.race()` | 第一个完成的结果 |
| `Promise.allSettled()` | 等待全部完成 |
| `Promise.any()` | 第一个成功的结果 |
| `Promise.resolve()` | 创建已解决的 Promise |
| `Promise.reject()` | 创建已拒绝的 Promise |
