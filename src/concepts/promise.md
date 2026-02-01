# Promise & Async/Await

## 什么是Promise？

Promise是JavaScript中处理异步操作的对象。它代表一个异步操作的最终完成（或失败）及其结果值。

## 基本概念

### Promise的状态

- **pending**：初始状态，既不是成功也不是失败
- **fulfilled**：操作成功完成
- **rejected**：操作失败

### 基本用法

```javascript
const promise = new Promise((resolve, reject) => {
  // 异步操作
  setTimeout(() => {
    const success = true;
    if (success) {
      resolve('Operation successful!');
    } else {
      reject('Operation failed!');
    }
  }, 1000);
});

promise
  .then(result => {
    console.log(result); // 'Operation successful!'
  })
  .catch(error => {
    console.error(error); // 'Operation failed!'
  });
```

## Promise方法

### then()

处理成功的结果。

```javascript
promise.then(result => {
  console.log('Success:', result);
});
```

### catch()

处理错误。

```javascript
promise.catch(error => {
  console.error('Error:', error);
});
```

### finally()

无论成功还是失败都会执行。

```javascript
promise.finally(() => {
  console.log('Operation completed');
});
```

### Promise链

```javascript
doAsyncTask()
  .then(result1 => {
    return doAnotherTask(result1);
  })
  .then(result2 => {
    return doThirdTask(result2);
  })
  .then(finalResult => {
    console.log('Final result:', finalResult);
  })
  .catch(error => {
    console.error('Error in chain:', error);
  });
```

## Promise静态方法

### Promise.resolve()

创建一个已解决的Promise。

```javascript
const resolvedPromise = Promise.resolve('Already resolved');
```

### Promise.reject()

创建一个已拒绝的Promise。

```javascript
const rejectedPromise = Promise.reject('Already rejected');
```

### Promise.all()

等待所有Promise完成。

```javascript
const promises = [
  Promise.resolve(1),
  Promise.resolve(2),
  Promise.resolve(3)
];

Promise.all(promises)
  .then(results => {
    console.log(results); // [1, 2, 3]
  })
  .catch(error => {
    console.error(error);
  });
```

### Promise.race()

等待第一个完成的Promise。

```javascript
const promises = [
  new Promise(resolve => setTimeout(() => resolve('first'), 100)),
  new Promise(resolve => setTimeout(() => resolve('second'), 50))
];

Promise.race(promises)
  .then(result => {
    console.log(result); // 'second'（第一个完成的）
  });
```

### Promise.allSettled()

等待所有Promise settle（无论成功还是失败）。

```javascript
const promises = [
  Promise.resolve('success'),
  Promise.reject('failure')
];

Promise.allSettled(promises)
  .then(results => {
    console.log(results);
    // [
    //   { status: 'fulfilled', value: 'success' },
    //   { status: 'rejected', reason: 'failure' }
    // ]
  });
```

### Promise.any()

等待第一个fulfilled的Promise。

```javascript
const promises = [
  Promise.reject('failure1'),
  Promise.reject('failure2'),
  Promise.resolve('success')
];

Promise.any(promises)
  .then(result => {
    console.log(result); // 'success'
  })
  .catch(error => {
    console.error(error); // AggregateError
  });
```

## Async/Await

### 基本用法

```javascript
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// 调用
fetchData()
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

### 并行执行

```javascript
async function fetchMultiple() {
  const [data1, data2] = await Promise.all([
    fetch('/api/data1').then(r => r.json()),
    fetch('/api/data2').then(r => r.json())
  ]);

  return { data1, data2 };
}
```

### 错误处理

```javascript
async function safeFetch() {
  try {
    const response = await fetch('/api/data');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
}
```

### 条件await

```javascript
async function conditionalAwait() {
  if (shouldFetch) {
    const data = await fetchData();
    return data;
  }
  return null;
}
```

## 实用场景

### API调用

```javascript
async function getUser(userId) {
  const response = await fetch(`/api/users/${userId}`);
  if (!response.ok) {
    throw new Error('User not found');
  }
  return await response.json();
}

// 使用
getUser(123)
  .then(user => console.log(user))
  .catch(error => console.error(error));
```

### 文件操作（Node.js）

```javascript
const fs = require('fs').promises;

async function readFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    return content;
  } catch (error) {
    console.error('File read error:', error);
    throw error;
  }
}
```

### 数据库查询

```javascript
async function getUserFromDB(userId) {
  try {
    const user = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
    return user;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}
```

### 并发请求

```javascript
async function fetchMultipleApis() {
  const [weather, news, stocks] = await Promise.all([
    fetchWeather(),
    fetchNews(),
    fetchStocks()
  ]);

  return { weather, news, stocks };
}
```

### 超时处理

```javascript
async function fetchWithTimeout(url, timeout = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timed out');
    }
    throw error;
  }
}
```

## 最佳实践

### 1. 总是使用try/catch

```javascript
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error; // 重新抛出错误或返回默认值
  }
}
```

### 2. 避免Promise hell

```javascript
// 不推荐
async function badPattern() {
  const a = await func1();
  const b = await func2(a);
  const c = await func3(b);
  return c;
}

// 推荐：使用Promise.all并行执行
async function goodPattern() {
  const [a, b, c] = await Promise.all([
    func1(),
    func2(),
    func3()
  ]);
  return combineResults(a, b, c);
}
```

### 3. 使用AbortController处理超时

```javascript
async function fetchWithTimeout(url, timeout = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timed out');
    }
    throw error;
  }
}
```

### 4. 错误边界处理

```javascript
async function safeAsyncOperation() {
  try {
    return await someAsyncOperation();
  } catch (error) {
    // 处理特定错误
    if (error instanceof SpecificError) {
      return handleSpecificError(error);
    }
    // 重新抛出其他错误
    throw error;
  }
}
```

### 5. 使用async/await而不是.then()

```javascript
// 不推荐
promise.then(result => {
  // 处理结果
}).catch(error => {
  // 处理错误
});

// 推荐
try {
  const result = await promise;
  // 处理结果
} catch (error) {
  // 处理错误
}
```

## 常见误区

### 1. 忘记await

```javascript
async function badExample() {
  const response = fetch('/api/data'); // 忘记await，返回Promise
  const data = await response.json(); // 错误：response不是Response对象
}

// 正确
async function goodExample() {
  const response = await fetch('/api/data');
  const data = await response.json();
}
```

### 2. 不必要的async/await

```javascript
// 不推荐：简单的Promise链不需要async/await
async function unnecessaryAsync() {
  return doSomething()
    .then(result => doAnotherThing(result))
    .catch(error => handleError(error));
}

// 推荐：直接返回Promise
function betterVersion() {
  return doSomething()
    .then(result => doAnotherThing(result))
    .catch(error => handleError(error));
}
```

### 3. 错误处理不当

```javascript
// 不推荐：捕获所有错误但不处理
async function badErrorHandling() {
  try {
    await someOperation();
  } catch (error) {
    // 什么也不做
  }
}

// 推荐：适当处理错误
async function goodErrorHandling() {
  try {
    await someOperation();
  } catch (error) {
    console.error('Operation failed:', error);
    // 或者返回默认值
    return defaultValue;
  }
}
```

### 4. 并行 vs 串行

```javascript
// 不推荐：串行执行
async function serialExecution() {
  const result1 = await operation1();
  const result2 = await operation2(result1);
  const result3 = await operation3(result2);
  return result3;
}

// 推荐：并行执行
async function parallelExecution() {
  const [result1, result2, result3] = await Promise.all([
    operation1(),
    operation2(),
    operation3()
  ]);
  return combineResults(result1, result2, result3);
}
```

Promise和async/await是现代JavaScript处理异步操作的核心技术。掌握它们可以让你的代码更加清晰、易读和可维护。