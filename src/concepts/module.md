# 模块化

## 什么是模块化？

模块化是将代码组织成独立的、可重用的单元的过程。每个模块包含相关的功能，可以独立开发、测试和维护。

## ES6模块语法

### 导出（Export）

#### 命名导出

```javascript
// math.js
export function add(a, b) {
  return a + b;
}

export const PI = 3.14159;

export class Circle {
  constructor(radius) {
    this.radius = radius;
  }

  area() {
    return PI * this.radius * this.radius;
  }
}
```

#### 默认导出

```javascript
// logger.js
export default function log(message) {
  console.log(`[LOG] ${message}`);
}
```

#### 混合导出

```javascript
// utils.js
export function helper1() { /* ... */ }
export function helper2() { /* ... */ }

export default function mainHelper() { /* ... */ }
```

### 导入（Import）

#### 命名导入

```javascript
// main.js
import { add, PI, Circle } from './math.js';

console.log(add(2, 3)); // 5
console.log(PI); // 3.14159

const circle = new Circle(5);
console.log(circle.area()); // 78.53975
```

#### 默认导入

```javascript
// main.js
import logger from './logger.js';

logger('Hello, world!'); // [LOG] Hello, world!
```

#### 混合导入

```javascript
// main.js
import defaultHelper, { helper1, helper2 } from './utils.js';
```

#### 重命名导入

```javascript
// main.js
import { add as sum, PI as pi } from './math.js';

console.log(sum(2, 3)); // 5
console.log(pi); // 3.14159
```

#### 导入所有

```javascript
// main.js
import * as MathModule from './math.js';

console.log(MathModule.add(2, 3)); // 5
console.log(MathModule.PI); // 3.14159
```

## 模块特性

### 严格模式

模块代码自动在严格模式下运行。

```javascript
// 模块中的this是undefined，而不是window
console.log(this); // undefined
```

### 单例模式

每个模块只被导入一次，无论被导入多少次。

```javascript
// module.js
console.log('Module loaded');

// main1.js
import './module.js'; // 打印'Module loaded'

// main2.js
import './module.js'; // 不会再次打印
```

### 静态分析

导入和导出在编译时解析，不能在运行时动态导入。

```javascript
// 错误：动态导入路径
import dynamicPath from `${variable}/module.js`;

// 正确：使用import()
const module = await import(dynamicPath);
```

## 实用场景

### 组织大型应用

```javascript
// app.js
import { initializeApp } from './core/app.js';
import { setupRoutes } from './routing/routes.js';
import { configureStore } from './store/store.js';

initializeApp();
setupRoutes();
configureStore();
```

### 工具函数库

```javascript
// utils/math.js
export function add(a, b) { return a + b; }
export function subtract(a, b) { return a - b; }

// utils/string.js
export function capitalize(str) { return str.charAt(0).toUpperCase() + str.slice(1); }

// main.js
import { add, subtract } from './utils/math.js';
import { capitalize } from './utils/string.js';
```

### 组件化开发

```javascript
// components/Button.js
export default function Button({ children, onClick }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}

// components/Modal.js
export function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
```

### 类型定义

```javascript
// types/user.js
export interface User {
  id: number;
  name: string;
  email: string;
}

// services/userService.js
import { User } from '../types/user.js';

export function getUser(id: number): Promise<User> {
  // 实现获取用户的逻辑
}
```

### 常量定义

```javascript
// constants/config.js
export const API_URL = 'https://api.example.com';
export const MAX_RETRIES = 3;
export const TIMEOUT = 5000;
```

## 高级用法

### 条件导出

```javascript
// module.js
let featureFlag = true;

export function enableFeature() {
  featureFlag = true;
}

export function disableFeature() {
  featureFlag = false;
}

export function getFeature() {
  return featureFlag;
}

// 根据条件导出
if (featureFlag) {
  export { someFeatureFunction } from './features.js';
}
```

### 重新导出

```javascript
// index.js
export { default as Button } from './Button.js';
export { Modal } from './Modal.js';
export { UserService } from './services/UserService.js';
```

### 动态导入

```javascript
// main.js
async function loadModule() {
  const module = await import('./dynamicModule.js');
  module.default(); // 调用默认导出
}

// 按需加载
button.addEventListener('click', loadModule);
```

### 模块联邦（Module Federation）

```javascript
// 在Webpack中配置模块联邦
const { remotes } = await import('@module-federation/node');

const remoteModule = await remotes.get('remoteApp').get('./Module');
```

## 最佳实践

### 1. 保持模块小而专注

```javascript
// 不推荐：大而全的模块
// utils.js - 包含数学、字符串、日期等多种工具函数

// 推荐：小而专注的模块
// utils/math.js - 只包含数学工具函数
// utils/string.js - 只包含字符串工具函数
// utils/date.js - 只包含日期工具函数
```

### 2. 使用有意义的模块名

```javascript
// 不推荐
// a.js, b.js, c.js

// 推荐
// user-auth.js, data-fetcher.js, form-validator.js
```

### 3. 避免循环依赖

```javascript
// moduleA.js
import { funcB } from './moduleB.js';
export function funcA() { /* ... */ }

// moduleB.js
import { funcA } from './moduleA.js'; // 循环依赖
export function funcB() { /* ... */ }

// 解决方案：重构代码，消除循环依赖
```

### 4. 使用 barrel 文件（index文件）

```javascript
// components/index.js
export { default as Button } from './Button.js';
export { Modal } from './Modal.js';
export { TextInput } from './TextInput.js';

// 使用
import { Button, Modal, TextInput } from './components';
```

### 5. 为模块添加文档

```javascript
/**
 * 数学工具函数模块
 * 提供基本的数学运算功能
 */
export function add(a, b) {
  return a + b;
}
```

### 6. 使用类型定义模块

```javascript
// types/index.d.ts
export interface User {
  id: number;
  name: string;
}

// 使用
import { User } from './types';
```

## 常见误区

### 1. 忽略模块的副作用

```javascript
// 有副作用的模块
export function initialize() {
  console.log('Initializing module');
  // 设置全局状态等
}

// 在导入时执行副作用
import './module-with-side-effects.js';
```

### 2. 过度模块化

```javascript
// 不推荐：每个函数都单独一个模块
// add.js, subtract.js, multiply.js, divide.js

// 推荐：相关的功能放在一个模块中
// math.js
export function add(a, b) { return a + b; }
export function subtract(a, b) { return a - b; }
export function multiply(a, b) { return a * b; }
export function divide(a, b) { return a / b; }
```

### 3. 忽略模块加载性能

```javascript
// 不推荐：导入大量不必要的模块
import * as Utils from './utils'; // 导入所有工具函数

// 推荐：只导入需要的函数
import { add, multiply } from './utils';
```

### 4. 混淆默认导出和命名导出

```javascript
// 不推荐
import Button from './Button.js'; // 假设Button是默认导出
import { Button } from './Button.js'; // 假设Button是命名导出

// 正确做法：查看模块的导出方式
```

### 5. 忽略模块的严格模式

```javascript
// 模块中的this是undefined
function func() {
  console.log(this); // undefined
}

func.call({}); // 仍然打印undefined
```

模块化是现代JavaScript开发的基础，掌握它可以让你的代码更加组织良好、可维护和可重用。ES6模块提供了标准化的模块系统，使得JavaScript应用能够更好地进行代码组织和依赖管理。