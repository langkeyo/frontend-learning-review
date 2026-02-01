## 概念

ES6 模块化是 JavaScript 官方的模块系统，提供了独立的模块作用域和导出/导入机制。

### 基本语法

#### 导出 (Export)

```javascript
// 命名导出
export const name = '张三'
export const age = 25

export function greet() {
  console.log('Hello')
}

export class Person {
  constructor(name) {
    this.name = name
  }
}

// 集中导出
const name = '张三'
const age = 25

export { name, age }

// 重命名导出
export { name as userName }

// 默认导出
export default function() {
  console.log('Default export')
}

// 或
const defaultFunc = () => {}
export default defaultFunc
```

#### 导入 (Import)

```javascript
// 命名导入
import { name, age } from './module.js'

// 重命名导入
import { name as userName } from './module.js'

// 导入所有
import * as module from './module.js'
console.log(module.name, module.age)

// 默认导入
import myFunc from './module.js'

// 混合导入
import myFunc, { name, age } from './module.js'

// 仅执行（不导入任何东西）
import './module.js'
```

### 模块特点

1. **自动严格模式**：模块自动处于严格模式
2. **独立作用域**：模块的变量不会污染全局
3. **单例执行**：模块只执行一次，后续导入使用缓存
4. **静态分析**：导入/导出语句必须在顶层

### 动态导入

使用 `import()` 动态加载模块，返回 Promise。

```javascript
// 按需加载
button.addEventListener('click', async () => {
  const module = await import('./heavy-module.js')
  module.doSomething()
})

// 条件加载
if (condition) {
  const module = await import('./module-a.js')
} else {
  const module = await import('./module-b.js')
}

// 路由懒加载
const routes = {
  home: () => import('./pages/Home.js'),
  about: () => import('./pages/About.js')
}
```

### 循环依赖

模块之间的循环引用需要注意：

```javascript
// a.js
import { b } from './b.js'
export const a = 'A'

// b.js
import { a } from './a.js'  // a 是 undefined
export const b = 'B'
```

解决方案：延迟引用或在函数内部导入。
