# 超时和重试

## 为什么需要重试机制？

网络请求可能会因为各种原因失败（如网络问题、服务器错误、超时等）。重试机制可以提高请求的成功率，改善用户体验。

## 基本重试逻辑

### 简单重试

```javascript
async function fetchWithRetry(url, options = {}, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      if (i === retries - 1) {
        throw error;
      }
    }

    // 等待一段时间再重试
    await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
  }
}

// 使用
fetchWithRetry('https://api.example.com/data')
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

## 指数退避重试

### 基本实现

```javascript
async function fetchWithExponentialBackoff(url, options = {}, maxRetries = 3) {
  let retryDelay = 1000; // 初始延迟1秒

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      if (i === maxRetries - 1) {
        throw error;
      }
    }

    // 指数退避：延迟时间指数增长
    await new Promise(resolve => setTimeout(resolve, retryDelay));
    retryDelay *= 2; // 每次重试延迟翻倍
  }
}

// 使用
fetchWithExponentialBackoff('https://api.example.com/data')
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

### 带抖动的指数退避

```javascript
function getRandomDelay(baseDelay) {
  // 添加随机抖动，避免多个客户端同时重试
  const jitter = baseDelay * 0.2 * (Math.random() - 0.5);
  return baseDelay + jitter;
}

async function fetchWithJitteredBackoff(url, options = {}, maxRetries = 3) {
  let retryDelay = 1000;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      if (i === maxRetries - 1) {
        throw error;
      }
    }

    const delay = getRandomDelay(retryDelay);
    await new Promise(resolve => setTimeout(resolve, delay));
    retryDelay *= 2;
  }
}
```

## 条件重试

### 基于HTTP状态码的重试

```javascript
function shouldRetry(response) {
  // 只对特定状态码进行重试
  const retryCodes = [408, 429, 500, 502, 503, 504];
  return retryCodes.includes(response.status);
}

async function fetchWithConditionalRetry(url, options = {}, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);

      if (response.ok || !shouldRetry(response)) {
        return await response.json();
      }
    } catch (error) {
      if (i === maxRetries - 1) {
        throw error;
      }
    }

    await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
  }
}
```

### 基于错误类型的重试

```javascript
function isNetworkError(error) {
  return error.name === 'TypeError' || // 网络错误
         error.name === 'AbortError';   // 请求被取消
}

async function fetchWithNetworkRetry(url, options = {}, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      if (!isNetworkError(error) || i === maxRetries - 1) {
        throw error;
      }
    }

    await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
  }
}
```

## 重试库

### axios-retry

```javascript
import axios from 'axios';
import axiosRetry from 'axios-retry';

// 配置axios重试
axiosRetry(axios, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    // 只对网络错误和5xx状态码重试
    return axiosRetry.isNetworkOrIdempotentRequestError(error) ||
           error.response?.status >= 500;
  }
});

// 使用axios
axios.get('https://api.example.com/data')
  .then(response => console.log(response.data))
  .catch(error => console.error(error));
```

### fetch-retry

```javascript
import { fetch } from 'fetch-retry';

const fetchWithRetry = fetch(window.fetch, {
  retries: 3,
  retryDelay: 1000,
  retryOn: (attempt, error, response) => {
    // 重试条件
    return attempt <= 3 && (
      error ||
      (response && response.status >= 500)
    );
  }
});

// 使用
fetchWithRetry('https://api.example.com/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

## 实用场景

### 通用重试函数

```javascript
class RetryManager {
  constructor(options = {}) {
    this.maxRetries = options.maxRetries || 3;
    this.retryDelay = options.retryDelay || 1000;
    this.backoffFactor = options.backoffFactor || 2;
    this.jitter = options.jitter || 0.2;
  }

  async execute(operation, ...args) {
    let retryDelay = this.retryDelay;

    for (let i = 0; i < this.maxRetries; i++) {
      try {
        return await operation(...args);
      } catch (error) {
        if (i === this.maxRetries - 1) {
          throw error;
        }
      }

      const delay = this.getDelay(retryDelay, i);
      await new Promise(resolve => setTimeout(resolve, delay));
      retryDelay *= this.backoffFactor;
    }
  }

  getDelay(baseDelay, attempt) {
    if (this.jitter === 0) {
      return baseDelay;
    }

    const jitterAmount = baseDelay * this.jitter * (Math.random() - 0.5);
    return baseDelay + jitterAmount;
  }
}

// 使用
const retryManager = new RetryManager({
  maxRetries: 3,
  retryDelay: 1000,
  backoffFactor: 2,
  jitter: 0.2
});

retryManager.execute(fetch, 'https://api.example.com/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

### React中的重试

```javascript
import { useState, useEffect } from 'react';

function DataFetcher({ url, retryCount = 3 }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    let retryCount = 3;

    const fetchData = async () => {
      while (retryCount > 0) {
        try {
          const response = await fetch(url);
          if (response.ok) {
            const result = await response.json();
            if (isMounted) {
              setData(result);
              setLoading(false);
            }
            return;
          }
        } catch (error) {
          if (retryCount === 1) {
            if (isMounted) {
              setError(error);
              setLoading(false);
            }
            return;
          }
        }

        retryCount--;
        await new Promise(resolve => setTimeout(resolve, 1000 * (4 - retryCount)));
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [url]);

  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {data && <div>Data: {JSON.stringify(data)}</div>}
    </div>
  );
}
```

### 并发请求重试

```javascript
async function fetchMultipleWithRetry(urls, options = {}, maxRetries = 3) {
  const results = await Promise.all(
    urls.map(url =>
      fetchWithRetry(url, options, maxRetries)
        .catch(error => ({ url, error }))
    )
  );

  return results.filter(result => !result.error);
}

// 使用
fetchMultipleWithRetry([
  'https://api.example.com/data1',
  'https://api.example.com/data2',
  'https://api.example.com/data3'
])
.then(successfulResults => console.log(successfulResults))
.catch(error => console.error(error));
```

### 文件上传重试

```javascript
async function uploadFileWithRetry(file, url, options = {}, maxRetries = 3) {
  const formData = new FormData();
  formData.append('file', file);

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        ...options
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      if (i === maxRetries - 1) {
        throw error;
      }
    }

    await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
  }
}
```

## 最佳实践

### 1. 使用指数退避

```javascript
// 不推荐：固定延迟
await new Promise(resolve => setTimeout(resolve, 1000));

// 推荐：指数退避
await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
```

### 2. 添加随机抖动

```javascript
// 添加抖动避免多个客户端同时重试
const jitter = delay * 0.2 * (Math.random() - 0.5);
await new Promise(resolve => setTimeout(resolve, delay + jitter));
```

### 3. 限制重试次数

```javascript
// 不推荐：无限重试
while (true) {
  try {
    return await fetch(url);
  } catch (error) {
    // 重试
  }
}

// 推荐：限制重试次数
for (let i = 0; i < maxRetries; i++) {
  try {
    return await fetch(url);
  } catch (error) {
    if (i === maxRetries - 1) throw error;
  }
}
```

### 4. 条件重试

```javascript
// 只对特定错误重试
if (shouldRetry(error)) {
  await retry();
}
```

### 5. 记录重试信息

```javascript
async function fetchWithRetry(url, options = {}, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.log(`Retry ${i + 1}/${maxRetries} failed:`, error.message);

      if (i === maxRetries - 1) {
        throw error;
      }
    }

    await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
  }
}
```

## 常见误区

### 1. 无限重试

```javascript
// 错误：可能导致无限循环
while (true) {
  try {
    const response = await fetch(url);
    if (response.ok) {
      return response.json();
    }
  } catch (error) {
    // 总是重试
  }
}

// 正确：限制重试次数
for (let i = 0; i < maxRetries; i++) {
  try {
    const response = await fetch(url);
    if (response.ok) {
      return response.json();
    }
  } catch (error) {
    if (i === maxRetries - 1) throw error;
  }
}
```

### 2. 忽略错误类型

```javascript
// 错误：对所有错误都重试
try {
  const response = await fetch(url);
  return response.json();
} catch (error) {
  // 重试
}

// 正确：只对特定错误重试
try {
  const response = await fetch(url);
  if (response.ok) {
    return response.json();
  }
} catch (error) {
  if (isNetworkError(error)) {
    // 重试
  } else {
    throw error;
  }
}
```

### 3. 不适当的重试延迟

```javascript
// 错误：固定延迟，可能导致服务器压力
await new Promise(resolve => setTimeout(resolve, 1000));

// 正确：指数退避
await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
```

### 4. 在已完成的请求上重试

```javascript
// 错误：在请求完成后重试
const response = await fetch(url);
if (!response.ok) {
  // 重试，但请求已经完成
}

// 正确：在catch块中重试
try {
  const response = await fetch(url);
  if (response.ok) {
    return response.json();
  }
} catch (error) {
  // 重试
}
```

### 5. 忽略服务器状态

```javascript
// 错误：对所有HTTP状态码都重试
try {
  const response = await fetch(url);
  return response.json();
} catch (error) {
  // 重试
}

// 正确：只对特定状态码重试
try {
  const response = await fetch(url);
  if (response.ok || response.status >= 500) {
    return response.json();
  }
} catch (error) {
  // 重试
}
```

重试机制是提高网络请求可靠性的重要技术。通过合理的重试策略，可以显著提高应用的稳定性和用户体验。掌握重试技术可以让你的网络请求更加健壮和可靠。