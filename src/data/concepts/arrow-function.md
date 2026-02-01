## 概念

箭头函数是 ES6 引入的一种新的函数定义语法，提供了更简洁的函数书写方式。

### 基本语法

```javascript
// 传统函数
function add(a, b) {
  return a + b
}

// 箭头函数
const add = (a, b) => a + b
```

### 语法规则

1. **单参数**：可以省略括号
```javascript
const square = x => x * x
```

2. **无参数**：需要空括号
```javascript
const greet = () => 'Hello'
```

3. **多行语句**：需要花括号和 return
```javascript
const calculate = (a, b) => {
  const result = a + b
  return result * 2
}
```

### 重要区别

| 特性 | 传统函数 | 箭头函数 |
|------|----------|----------|
| `this` 绑定 | 动态绑定 | 继承外层作用域 |
| `arguments` 对象 | 存在 | 不存在 |
| `new` 调用 | 可以 | 不可以 |
| 构造函数 | 可以 | 不可以 |

### 常见陷阱

```javascript
// 错误示例：作为对象方法使用
const obj = {
  value: 1,
  getValue: () => this.value  // this 指向外层，不是 obj
}

// 正确示例：使用传统函数
const obj = {
  value: 1,
  getValue() {
    return this.value
  }
}
```
