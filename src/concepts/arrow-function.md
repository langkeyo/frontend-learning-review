# 箭头函数

## 什么是箭头函数？

箭头函数是ES6引入的一种更简洁的函数定义语法。它们提供了更简洁的语法，并且不绑定自己的`this`、`arguments`、`super`或`new.target`。

## 基本语法

### 基本形式

```javascript
// 传统函数
const traditional = function(param) {
  return param * 2;
};

// 箭头函数
const arrow = (param) => param * 2;
```

### 单参数省略括号

```javascript
// 可以省略括号
const double = x => x * 2;
```

### 多参数需要括号

```javascript
const add = (a, b) => a + b;
```

### 无参数需要括号

```javascript
const sayHello = () => console.log('Hello!');
```

### 多行函数需要花括号和return

```javascript
const complex = (a, b) => {
  const sum = a + b;
  const product = a * b;
  return { sum, product };
};
```

## 主要特性

### 1. 更简洁的语法

```javascript
// 传统
const numbers = [1, 2, 3, 4];
const doubled = numbers.map(function(n) {
  return n * 2;
});

// 箭头函数
const doubled = numbers.map(n => n * 2);
```

### 2. 不绑定自己的this

```javascript
function TraditionalClass() {
  this.value = 42;
  setTimeout(function() {
    console.log(this.value); // undefined，因为this指向setTimeout的回调函数
  }, 100);
}

const ArrowClass = () => {
  this.value = 42;
  setTimeout(() => {
    console.log(this.value); // 42，因为箭头函数不绑定自己的this
  }, 100);
};
```

### 3. 不绑定arguments对象

```javascript
function traditionalFunc() {
  console.log(arguments); // 正常输出arguments对象
}

const arrowFunc = () => {
  console.log(arguments); // ReferenceError: arguments is not defined
};

// 使用rest参数代替
const arrowFuncWithRest = (...args) => {
  console.log(args); // 正常输出数组
};
```

### 4. 不能用作构造函数

```javascript
const Person = (name) => {
  this.name = name;
};

// 不能使用new调用
// const person = new Person('Alice'); // TypeError: Person is not a constructor
```

### 5. 没有prototype属性

```javascript
const arrow = () => {};
console.log(arrow.prototype); // undefined
```

## 实用场景

### 数组方法回调

```javascript
const numbers = [1, 2, 3, 4, 5];

// 过滤偶数
const evens = numbers.filter(n => n % 2 === 0);

// 映射为平方
const squares = numbers.map(n => n * n);

// 求和
const sum = numbers.reduce((acc, n) => acc + n, 0);
```

### 对象方法

```javascript
const person = {
  name: 'Alice',
  greet: () => {
    console.log(`Hello, I'm ${this.name}`); // 注意：这里的this指向全局对象
  },

  greetCorrect: function() {
    console.log(`Hello, I'm ${this.name}`); // 正确的this绑定
  }
};
```

### 事件处理

```javascript
const button = document.getElementById('myButton');

button.addEventListener('click', () => {
  console.log('Button clicked!');
  // this指向全局对象，不是按钮元素
});
```

### 立即执行函数表达式（IIFE）

```javascript
(() => {
  console.log('This is an IIFE with arrow function');
})();
```

### Promise链

```javascript
fetch('/api/data')
  .then(response => response.json())
  .then(data => processData(data))
  .catch(error => console.error(error));
```

## 最佳实践

### 1. 何时使用箭头函数

- 在数组方法（map、filter、reduce等）中使用
- 在Promise链中使用
- 在需要保持父级作用域的this时使用
- 在短小的函数中使用

### 2. 何时避免使用箭头函数

- 在需要绑定this的方法中（如对象方法）
- 在构造函数中
- 在需要访问arguments对象时

### 3. 使用rest参数代替arguments

```javascript
// 不推荐
const sum = () => {
  let total = 0;
  for (let i = 0; i < arguments.length; i++) {
    total += arguments[i];
  }
  return total;
};

// 推荐
const sum = (...numbers) => {
  return numbers.reduce((acc, n) => acc + n, 0);
};
```

### 4. 保持可读性

```javascript
// 复杂逻辑使用传统函数
const complexCalculation = function(a, b, c) {
  // 复杂的计算逻辑
  return result;
};

// 简单逻辑使用箭头函数
const simpleOperation = (a, b) => a + b;
```

## 常见误区

### 1. this绑定问题

```javascript
const button = document.getElementById('myButton');

button.addEventListener('click', () => {
  console.log(this); // 指向全局对象，不是按钮
});

// 正确做法
button.addEventListener('click', function() {
  console.log(this); // 指向按钮元素
});
```

### 2. 返回对象字面量

```javascript
// 错误：被解释为函数体
const getPerson = name => { name: name };

// 正确：使用括号包裹对象
const getPerson = name => ({ name: name });
```

### 3. 隐式返回

```javascript
// 错误：返回undefined
const getValue = () => {
  const value = 42;
};

// 正确：显式返回
const getValue = () => {
  const value = 42;
  return value;
};

// 或者使用隐式返回
const getValue = () => 42;
```

箭头函数是ES6的重要特性，掌握它们可以让你编写更简洁、更易读的JavaScript代码。它们在函数式编程和现代JavaScript开发中特别有用。