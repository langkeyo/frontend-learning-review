## 应用场景

### 场景 1：基础导出和导入

```javascript
// math.js
export function add(a, b) {
  return a + b
}

export function multiply(a, b) {
  return a * b
}
```

```javascript
// main.js
import { add, multiply } from './math.js'

console.log(add(2, 3))      // 5
console.log(multiply(4, 5))  // 20
```

### 场景 2：默认导出

```javascript
// config.js
export default {
  apiUrl: 'https://api.example.com',
  timeout: 5000
}
```

```javascript
// main.js
import config from './config.js'

console.log(config.apiUrl)
```

### 场景 3：命名导出

```javascript
export const API_URL = 'https://api.example.com'
export const TIMEOUT = 5000
export function fetchData() { /* ... */ }
```

### 场景 4：动态导入

```javascript
async function loadModule() {
  const module = await import('./heavy-module.js')
  module.doSomething()
}
```

### 场景 5：导出类

```javascript
export class User {
  constructor(name) {
    this.name = name
  }

  sayHello() {
    console.log(`Hello, ${this.name}`)
  }
}
```
