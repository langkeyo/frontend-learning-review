# JavaScript函数概念

## 什么是函数？

函数是一段可重复使用的代码块，用于执行特定任务。函数可以接受输入参数，执行操作，并返回结果。

## 函数声明

### 函数声明

```javascript
function greet(name) {
  return `你好, ${name}!`;
}

// 调用函数
console.log(greet("张三")); // 输出: 你好, 张三!
```

### 函数表达式

```javascript
const add = function(a, b) {
  return a + b;
};

// 调用函数
console.log(add(5, 3)); // 输出: 8
```

### 箭头函数（ES6+）

```javascript
// 基本箭头函数
const multiply = (a, b) => a * b;

// 多行箭头函数
const complexCalc = (a, b) => {
  const result = a * b;
  return result + 10;
};

// 无参数箭头函数
const sayHello = () => "Hello!";

// 单参数箭头函数（可省略括号）
const square = x => x * x;
```

### 立即执行函数表达式（IIFE）

```javascript
(function() {
  console.log("立即执行");
})();

(() => {
  console.log("箭头函数立即执行");
})();
```

## 函数参数

### 默认参数

```javascript
function greet(name = "访客") {
  return `你好, ${name}!`;
}

console.log(greet()); // 输出: 你好, 访客!
console.log(greet("张三")); // 输出: 你好, 张三!
```

### 剩余参数

```javascript
function sum(...numbers) {
  return numbers.reduce((total, num) => total + num, 0);
}

console.log(sum(1, 2, 3, 4)); // 输出: 10
```

### 解构参数

```javascript
function displayUser({ name, age, city }) {
  return `${name}，${age}岁，来自${city}`;
}

const user = { name: "张三", age: 30, city: "北京" };
console.log(displayUser(user)); // 输出: 张三，30岁，来自北京
```

### 参数验证

```javascript
function safeDivide(a, b) {
  if (b === 0) {
    throw new Error("除数不能为零");
  }
  return a / b;
}

try {
  console.log(safeDivide(10, 2)); // 输出: 5
  console.log(safeDivide(10, 0)); // 抛出错误
} catch (error) {
  console.error(error.message);
}
```

## 函数作用域

### 全局作用域

在函数外部声明的变量具有全局作用域：

```javascript
let globalVar = "全局变量";

function test() {
  console.log(globalVar); // 可访问
}
```

### 函数作用域

在函数内部声明的变量只在该函数内可见：

```javascript
function test() {
  let localVar = "局部变量";
  console.log(localVar); // 可访问
}
console.log(localVar); // 报错：localVar未定义
```

### 闭包

闭包允许函数访问外部作用域的变量：

```javascript
function createCounter() {
  let count = 0;
  return function() {
    count++;
    return count;
  };
}

const counter = createCounter();
console.log(counter()); // 输出: 1
console.log(counter()); // 输出: 2
```

## 高阶函数

### 接受其他函数作为参数

```javascript
function repeat(operation, times) {
  for (let i = 0; i < times; i++) {
    operation();
  }
}

repeat(() => console.log("Hello"), 3);
// 输出:
// Hello
// Hello
// Hello
```

### 返回其他函数

```javascript
function createMultiplier(multiplier) {
  return function(number) {
    return number * multiplier;
  };
}

const double = createMultiplier(2);
console.log(double(5)); // 输出: 10
```

## 常用高阶函数

### map

```javascript
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(num => num * 2);
console.log(doubled); // 输出: [2, 4, 6, 8, 10]
```

### filter

```javascript
const evenNumbers = numbers.filter(num => num % 2 === 0);
console.log(evenNumbers); // 输出: [2, 4]
```

### reduce

```javascript
const sum = numbers.reduce((total, num) => total + num, 0);
console.log(sum); // 输出: 15
```

### compose

```javascript
const compose = (f, g) => x => f(g(x));

const addOne = x => x + 1;
const double = x => x * 2;
const addOneThenDouble = compose(double, addOne);

console.log(addOneThenDouble(5)); // 输出: 12
```

## 函数方法

### call和apply

```javascript
function greet(greeting, punctuation) {
  console.log(`${greeting}, ${this.name}${punctuation}`);
}

const person = { name: "张三" };

greet.call(person, "你好", "!"); // 输出: 你好, 张三!
greet.apply(person, ["你好", "!"]); // 输出: 你好, 张三!
```

### bind

```javascript
const boundGreet = greet.bind(person, "你好");
boundGreet("!"); // 输出: 你好, 张三!
```

## 函数属性

### length属性

```javascript
function sum(a, b, c) {
  return a + b + c;
}

console.log(sum.length); // 输出: 3（参数数量）
```

### name属性

```javascript
console.log(sum.name); // 输出: "sum"
```

## 函数提升

函数声明会被提升到作用域顶部：

```javascript
hoistedFunction(); // 可以正常调用

function hoistedFunction() {
  console.log("函数已被提升");
}

// 函数表达式不会被提升
// nonHoisted(); // 报错：nonHoisted is not a function
// const nonHoisted = function() {
//   console.log("不会被提升");
// };
```

## 函数最佳实践

1. **使用有意义的名称**：函数名应反映其功能
2. **保持函数短小**：每个函数只做一件事
3. **使用适当的参数数量**：避免过多参数
4. **添加文档注释**：说明函数的用途和参数
5. **使用箭头函数**：在适当的地方使用ES6+语法
6. **避免副作用**：函数应尽量是纯函数

## 函数类型

### 纯函数

```javascript
function add(a, b) {
  return a + b;
}

// 相同输入总是产生相同输出
console.log(add(2, 3)); // 输出: 5
console.log(add(2, 3)); // 输出: 5
```

### 不纯函数

```javascript
let count = 0;

function increment() {
  count++;
  return count;
}

// 相同输入可能产生不同输出
console.log(increment()); // 输出: 1
console.log(increment()); // 输出: 2
```

掌握函数是JavaScript编程的核心概念，理解它们对于编写可维护和可重用的代码至关重要。