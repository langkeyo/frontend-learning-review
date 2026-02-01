# 请求取消

## 为什么需要请求取消？

在Web应用中，用户可能会快速切换操作，导致之前的网络请求变得无用。请求取消可以：

1. 避免不必要的网络流量
2. 防止过时的响应影响应用状态
3. 提高用户体验

## Fetch API的请求取消

### 使用AbortController

```javascript
// 创建AbortController
const controller = new AbortController();
const signal = controller.signal;

// 发起请求
fetch('https://api.example.com/data', { signal })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => {
    if (error.name === 'AbortError') {
      console.log('Request was aborted');
    } else {
      console.error('Fetch error:', error);
    }
  });

// 取消请求
controller.abort();
```

### 自动取消（如超时）

```javascript
function fetchWithTimeout(url, options = {}, timeout = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  return fetch(url, { ...options, signal: controller.signal })
    .finally(() => clearTimeout(timeoutId))
    .catch(error => {
      if (error.name === 'AbortError') {
        throw new Error('Request timed out');
      }
      throw error;
    });
}

// 使用
fetchWithTimeout('https://api.example.com/data', {}, 3000)
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

## Axios的请求取消

### 基本取消

```javascript
import axios from 'axios';

// 创建CancelToken
const CancelToken = axios.CancelToken;
let cancel;

axios.get('/user/123', {
  cancelToken: new CancelToken(function executor(c) {
    cancel = c;
  })
})
.then(response => console.log(response.data))
.catch(function (error) {
  if (axios.isCancel(error)) {
    console.log('Request canceled', error.message);
  } else {
    console.error(error);
  }
});

// 取消请求
cancel('Operation canceled by the user');
```

### 使用AbortController（Axios v0.22.0+）

```javascript
const controller = new AbortController();

axios.get('/user/123', {
  signal: controller.signal
})
.then(response => console.log(response.data))
.catch(error => {
  if (axios.isCancel(error)) {
    console.log('Request canceled');
  } else {
    console.error(error);
  }
});

// 取消请求
controller.abort();
```

## 实用场景

### 取消未完成的请求

```javascript
class RequestManager {
  constructor() {
    this.activeRequests = new Map();
  }

  async request(url, options = {}) {
    const controller = new AbortController();
    const signal = controller.signal;
    const requestId = Math.random().toString(36).substr(2, 9);

    this.activeRequests.set(requestId, controller);

    try {
      const response = await fetch(url, { ...options, signal });
      this.activeRequests.delete(requestId);
      return await response.json();
    } catch (error) {
      this.activeRequests.delete(requestId);
      throw error;
    }
  }

  cancel(requestId) {
    const controller = this.activeRequests.get(requestId);
    if (controller) {
      controller.abort();
      this.activeRequests.delete(requestId);
    }
  }

  cancelAll() {
    for (const [requestId, controller] of this.activeRequests) {
      controller.abort();
    }
    this.activeRequests.clear();
  }
}

// 使用
const requestManager = new RequestManager();

// 发起请求
const requestId = 'request1';
requestManager.request('https://api.example.com/data')
  .then(data => console.log(data))
  .catch(error => {
    if (error.name === 'AbortError') {
      console.log('Request was canceled');
    } else {
      console.error(error);
    }
  });

// 取消请求
requestManager.cancel(requestId);
```

### 路由切换时取消请求

```javascript
import { useEffect } from 'react';

function DataFetcher({ userId }) {
  useEffect(() => {
    const controller = new AbortController();

    fetch(`https://api.example.com/users/${userId}`, { signal: controller.signal })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => {
        if (error.name !== 'AbortError') {
          console.error(error);
        }
      });

    // 组件卸载时取消请求
    return () => {
      controller.abort();
    };
  }, [userId]);

  return <div>Loading data...</div>;
}
```

### 搜索框防抖取消

```javascript
function SearchBox() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const controllerRef = useRef(null);

  const handleSearch = debounce(async (searchQuery) => {
    // 取消之前的请求
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      const response = await fetch(`https://api.example.com/search?q=${searchQuery}`, {
        signal: controller.signal
      });
      const data = await response.json();
      setResults(data.results);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error(error);
      }
    } finally {
      controllerRef.current = null;
    }
  }, 300);

  const handleChange = (e) => {
    setQuery(e.target.value);
    handleSearch(e.target.value);
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search..."
      />
      <div>
        {results.map(item => (
          <div key={item.id}>{item.name}</div>
        ))}
      </div>
    </div>
  );
}
```

### 文件上传取消

```javascript
function FileUploader() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const controllerRef = useRef(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    const controller = new AbortController();
    controllerRef.current = controller;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    setProgress(0);

    try {
      const response = await fetch('https://api.example.com/upload', {
        method: 'POST',
        body: formData,
        signal: controller.signal,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        }
      });

      const result = await response.json();
      console.log('Upload complete:', result);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Upload error:', error);
      }
    } finally {
      setUploading(false);
      controllerRef.current = null;
    }
  };

  const handleCancel = () => {
    if (controllerRef.current) {
      controllerRef.current.abort();
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      <button onClick={handleCancel} disabled={!uploading}>
        Cancel
      </button>
      {uploading && <div>Progress: {progress}%</div>}
    </div>
  );
}
```

## 最佳实践

### 1. 总是清理请求

```javascript
function fetchData(url) {
  const controller = new AbortController();

  fetch(url, { signal: controller.signal })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => {
      if (error.name !== 'AbortError') {
        console.error(error);
      }
    });

  // 返回取消函数
  return () => controller.abort();
}

// 使用
const cancelFetch = fetchData('https://api.example.com/data');

// 当不再需要时取消
cancelFetch();
```

### 2. 使用React的useEffect清理

```javascript
function DataComponent({ url }) {
  useEffect(() => {
    const controller = new AbortController();

    fetch(url, { signal: controller.signal })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => {
        if (error.name !== 'AbortError') {
          console.error(error);
        }
      });

    // 清理函数
    return () => {
      controller.abort();
    };
  }, [url]);
}
```

### 3. 集中管理请求

```javascript
class RequestManager {
  constructor() {
    this.requests = new Map();
  }

  request(url, options = {}) {
    const controller = new AbortController();
    const requestId = Math.random().toString(36).substr(2, 9);

    this.requests.set(requestId, controller);

    fetch(url, { ...options, signal: controller.signal })
      .then(response => response.json())
      .then(data => {
        this.requests.delete(requestId);
        return data;
      })
      .catch(error => {
        this.requests.delete(requestId);
        throw error;
      });

    return requestId;
  }

  cancel(requestId) {
    const controller = this.requests.get(requestId);
    if (controller) {
      controller.abort();
      this.requests.delete(requestId);
    }
  }

  cancelAll() {
    for (const [requestId, controller] of this.requests) {
      controller.abort();
    }
    this.requests.clear();
  }
}
```

### 4. 处理取消错误

```javascript
async function safeFetch(url, options = {}) {
  const controller = new AbortController();

  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Request was canceled');
      return null; // 或其他默认值
    }
    throw error;
  } finally {
    // 清理
  }
}
```

### 5. 避免内存泄漏

```javascript
// 不推荐：可能导致内存泄漏
let controller;

function fetchData() {
  controller = new AbortController();
  fetch('https://api.example.com/data', { signal: controller.signal })
    .then(response => response.json())
    .then(data => console.log(data));
}

// 推荐：使用useEffect或明确清理
function fetchData() {
  const controller = new AbortController();

  fetch('https://api.example.com/data', { signal: controller.signal })
    .then(response => response.json())
    .then(data => console.log(data));

  return () => controller.abort();
}
```

## 常见误区

### 1. 忘记清理请求

```javascript
// 错误：可能导致内存泄漏
function fetchData() {
  const controller = new AbortController();
  fetch('https://api.example.com/data', { signal: controller.signal })
    .then(response => response.json())
    .then(data => console.log(data));
}

// 正确：返回取消函数
function fetchData() {
  const controller = new AbortController();

  fetch('https://api.example.com/data', { signal: controller.signal })
    .then(response => response.json())
    .then(data => console.log(data));

  return () => controller.abort();
}
```

### 2. 重复取消

```javascript
// 错误：可能抛出错误
const controller = new AbortController();
controller.abort(); // 第一次取消
controller.abort(); // 第二次取消，会抛出错误
```

### 3. 忽略取消错误

```javascript
// 错误：不区分取消错误和其他错误
fetch('https://api.example.com/data', { signal: controller.signal })
  .then(response => response.json())
  .catch(error => console.error(error));

// 正确：区分取消错误
fetch('https://api.example.com/data', { signal: controller.signal })
  .then(response => response.json())
  .catch(error => {
    if (error.name === 'AbortError') {
      console.log('Request canceled');
    } else {
      console.error('Fetch error:', error);
    }
  });
```

### 4. 在已完成的请求上取消

```javascript
// 错误：在请求完成后取消
const controller = new AbortController();
fetch('https://api.example.com/data', { signal: controller.signal })
  .then(response => response.json())
  .then(data => {
    console.log(data);
    controller.abort(); // 无效，请求已结束
  });
```

请求取消是现代Web应用的重要功能，它可以提高应用的性能和用户体验。掌握请求取消技术可以让你的应用更加健壮和高效。