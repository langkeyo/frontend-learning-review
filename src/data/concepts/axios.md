# Axios概念

## 什么是Axios？

Axios是一个基于Promise的HTTP客户端，可以用于浏览器和Node.js。它提供了简洁的API来发起HTTP请求，并具有以下特点：

- 从浏览器创建XMLHttpRequests
- 从Node.js创建http请求
- 支持Promise API
- 自动转换JSON数据
- 客户端支持防止XSRF

## 安装和基本使用

### 安装

```bash
npm install axios
# 或
yarn add axios
```

### 基本使用

```javascript
import axios from 'axios';

// GET请求
axios.get('https://api.example.com/data')
  .then(response => console.log(response.data))
  .catch(error => console.error(error));

// POST请求
axios.post('https://api.example.com/users', {
  name: "张三",
  email: "zhangsan@example.com"
})
.then(response => console.log('创建成功:', response.data))
.catch(error => console.error('POST请求失败:', error));
```

## Axios的核心特性

### 请求配置

Axios允许通过配置对象自定义请求：

```javascript
axios({
  method: 'post',
  url: 'https://api.example.com/users',
  data: {
    name: "张三",
    email: "zhangsan@example.com"
  },
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 5000, // 超时时间（毫秒）
  withCredentials: true, // 跨域时是否携带cookie
  responseType: 'json' // 响应类型
})
.then(response => console.log(response.data))
.catch(error => console.error(error));
```

### 请求方法别名

Axios提供了常用的HTTP方法别名：

```javascript
// GET请求
axios.get('/user/123');

// POST请求
axios.post('/user', { name: "张三" });

// PUT请求
axios.put('/user/123', { name: "李四" });

// DELETE请求
axios.delete('/user/123');

// HEAD请求
axios.head('/user/123');

// OPTIONS请求
axios.options('/user/123');

// PATCH请求
axios.patch('/user/123', { name: "王五" });
```

### 并发请求

```javascript
function getUser() {
  return axios.get('/user/123');
}

function getPermissions() {
  return axios.get('/user/123/permissions');
}

axios.all([getUser(), getPermissions()])
  .then(axios.spread((user, permissions) => {
    console.log('用户:', user.data);
    console.log('权限:', permissions.data);
  }))
  .catch(error => console.error(error));
```

## 请求配置选项

### URL参数

```javascript
axios.get('/user', {
  params: {
    ID: 123,
    sort: 'name'
  }
});
```

### 请求头

```javascript
axios.get('/user', {
  headers: {
    'Authorization': 'Bearer your-token',
    'X-Custom-Header': 'custom-value'
  }
});
```

### 响应数据转换

```javascript
axios.post('/user', { name: "张三" }, {
  transformRequest: [function (data) {
    // 转换请求数据
    return JSON.stringify(data);
  }],
  transformResponse: [function (data) {
    // 转换响应数据
    return JSON.parse(data);
  }]
});
```

### 超时设置

```javascript
axios.get('/user/123', {
  timeout: 5000 // 5秒超时
});
```

## 响应结构

Axios返回的响应对象包含以下属性：

```javascript
{
  data: {}, // 服务器返回的数据
  status: 200, // HTTP状态码
  statusText: 'OK', // 状态文本
  headers: {}, // 响应头
  config: {}, // 请求配置
  request: {} // 原始请求
}
```

## 错误处理

### 基本错误处理

```javascript
axios.get('/user/123')
  .then(response => console.log(response.data))
  .catch(error => {
    if (error.response) {
      // 请求已发出，但服务器响应的状态码不在 2xx 范围内
      console.error('响应错误:', error.response.status);
      console.error('响应数据:', error.response.data);
      console.error('响应头:', error.response.headers);
    } else if (error.request) {
      // 请求已经成功发出，但没有收到响应
      console.error('请求错误:', error.request);
    } else {
      // 在设置请求时触发了错误
      console.error('设置错误:', error.message);
    }
  });
```

### 全局错误处理

```javascript
axios.interceptors.response.use(
  response => response,
  error => {
    // 全局错误处理
    console.error('全局错误:', error);
    return Promise.reject(error);
  }
);
```

## 拦截器

### 请求拦截器

```javascript
axios.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    config.headers.Authorization = `Bearer ${getToken()}`;
    return config;
  },
  error => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);
```

### 响应拦截器

```javascript
axios.interceptors.response.use(
  response => {
    // 对响应数据做点什么
    return response.data;
  },
  error => {
    // 对响应错误做点什么
    if (error.response) {
      console.error('响应错误:', error.response.status);
    } else if (error.request) {
      console.error('请求错误:', error.request);
    } else {
      console.error('设置错误:', error.message);
    }
    return Promise.reject(error);
  }
);
```

## 取消请求

```javascript
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

axios.get('/user/123', {
  cancelToken: source.token
})
.then(response => console.log(response.data))
.catch(thrown => {
  if (axios.isCancel(thrown)) {
    console.log('请求已取消', thrown.message);
  } else {
    console.error('请求失败:', thrown);
  }
});

// 取消请求
source.cancel('操作被用户取消');
```

## 并发请求

```javascript
function getUserAccount() {
  return axios.get('/user/123');
}

function getUserPermissions() {
  return axios.get('/user/123/permissions');
}

axios.all([getUserAccount(), getUserPermissions()])
  .then(axios.spread((acct, perms) => {
    console.log('账户信息:', acct.data);
    console.log('权限信息:', perms.data);
  }));
```

## 创建实例

可以创建自定义配置的Axios实例：

```javascript
const instance = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 1000,
  headers: {'X-Custom-Header': 'custom-value'}
});

// 使用实例
instance.get('/user/123')
  .then(response => console.log(response.data));
```

## 配置默认值

可以设置全局默认配置：

```javascript
// 设置全局默认配置
axios.defaults.baseURL = 'https://api.example.com';
axios.defaults.headers.common['Authorization'] = `Bearer ${getToken()}`;
axios.defaults.headers.post['Content-Type'] = 'application/json';

// 创建实例时覆盖默认配置
const instance = axios.create({
  baseURL: 'https://other-api.example.com'
});
```

## 请求取消

```javascript
const controller = new AbortController();

axios.get('/user/123', {
  signal: controller.signal
})
.then(response => console.log(response.data))
.catch(error => {
  if (axios.isCancel(error)) {
    console.log('请求已取消');
  } else {
    console.error('请求失败:', error);
  }
});

// 取消请求
controller.abort();
```

## 拦截器的高级用法

### 请求重试

```javascript
axios.interceptors.response.use(
  response => response,
  error => {
    const config = error.config;
    // 如果没有重试次数或已经重试过
    if (!config || !config.retry) {
      return Promise.reject(error);
    }

    // 设置重试次数
    config.__retryCount = config.__retryCount || 0;
    if (config.__retryCount >= config.retry) {
      return Promise.reject(error);
    }

    // 增加重试次数
    config.__retryCount += 1;

    // 延迟重试
    const backoff = new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, config.retryDelay || 1000);
    });

    return backoff.then(() => axios(config));
  }
);

// 使用
axios.get('/user/123', {
  retry: 3,
  retryDelay: 1000
});
```

## Axios与Fetch对比

| 特性 | Axios | Fetch |
|------|-------|-------|
| Promise | 内置支持 | 内置支持 |
| 拦截器 | 支持 | 不支持 |
| 自动转换JSON | 支持 | 需要手动处理 |
| 请求取消 | 支持 | 支持 |
| 超时设置 | 支持 | 需要手动实现 |
| 并发请求 | 支持 | 支持 |
| 错误处理 | 更清晰 | 需要检查状态码 |
| 请求/响应转换 | 支持 | 不支持 |
| XSRF保护 | 支持 | 不支持 |

## 最佳实践

1. **使用实例**：为不同的API创建不同的Axios实例
2. **设置超时**：避免长时间等待
3. **错误处理**：区分不同类型的错误
4. **使用拦截器**：统一处理请求和响应
5. **取消请求**：提供用户取消选项
6. **重试机制**：处理临时性错误
7. **安全考虑**：使用HTTPS，验证SSL证书
8. **日志记录**：记录请求和响应信息

## 兼容性

Axios在现代浏览器和Node.js中都能良好工作，但在旧版浏览器中可能需要polyfill：

```html
<!-- 引入Axios -->
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
```

掌握Axios是现代前端开发的重要技能，能够让你更高效地进行网络请求。