# JavaScript变量概念

## 什么是变量？

变量是存储数据的容器，可以在程序中引用和操作。在JavaScript中，变量可以存储各种类型的数据，包括数字、字符串、对象等。

## 变量声明

JavaScript中有三种声明变量的方式：

### var声明（旧方式）

```javascript
var name = "张三";
var age = 25;
```

特点：
- 函数作用域
- 变量提升
- 可以重复声明

### let声明（ES6+）

```javascript
let name = "张三";
let age = 25;
```

特点：
- 块级作用域
- 不存在变量提升
- 不能重复声明同一作用域内的变量

### const声明（ES6+）

```javascript
const PI = 3.14159;
const MAX_ATTEMPTS = 3;
```

特点：
- 块级作用域
- 必须初始化
- 值不能重新赋值（但对象属性可以修改）

## 数据类型

JavaScript有七种基本数据类型：

### 原始类型

1. **String（字符串）**
   ```javascript
   let greeting = "你好，世界！";
   let singleQuote = '单引号字符串';
   let template = `模板字符串 ${greeting}`;
   ```

2. **Number（数字）**
   ```javascript
   let integer = 42;
   let float = 3.14;
   let scientific = 1.23e5; // 科学计数法
   let binary = 0b1010; // 二进制
   let octal = 0o755; // 八进制
   let hex = 0xFF; // 十六进制
   ```

3. **Boolean（布尔值）**
   ```javascript
   let isActive = true;
   let isComplete = false;
   ```

4. **Undefined（未定义）**
   ```javascript
   let uninitialized;
   console.log(uninitialized); // undefined
   ```

5. **Null（空值）**
   ```javascript
   let empty = null;
   ```

6. **Symbol（符号）**
   ```javascript
   let sym = Symbol("unique");
   let anotherSym = Symbol("unique"); // 与sym不同
   ```

7. **BigInt（大整数）**
   ```javascript
   let big = 9007199254740991n;
   let anotherBig = BigInt("9007199254740991");
   ```

### 引用类型

- **Object（对象）**
- **Array（数组）**
- **Function（函数）**
- **Date（日期）**
- **RegExp（正则表达式）**

## 变量作用域

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

### 块级作用域

使用let和const声明的变量在块级作用域内可见：

```javascript
if (true) {
  let blockVar = "块级变量";
  console.log(blockVar); // 可访问
}
console.log(blockVar); // 报错：blockVar未定义
```

## 变量提升

JavaScript中的变量声明会被提升到作用域顶部：

```javascript
console.log(hoistedVar); // 输出: undefined
var hoistedVar = "已提升的变量";

// 函数声明也会被提升
hoistedFunction(); // 可以正常调用

function hoistedFunction() {
  console.log("函数已被提升");
}

// let和const不会提升（暂时性死区）
// console.log(notHoisted); // 报错：Cannot access 'notHoisted' before initialization
// let notHoisted = "不会被提升";
```

## 常量

使用const声明的变量是常量，值不能重新赋值：

```javascript
const PI = 3.14159;
// PI = 3.14; // 报错：Assignment to constant variable.

// 但对象属性可以修改
const user = { name: "张三" };
user.name = "李四"; // 合法
// user = { name: "王五" }; // 报错
```

## 变量命名规则

1. 必须以字母、下划线（_）或美元符号（$）开头
2. 后续字符可以是字母、数字、下划线或美元符号
3. 区分大小写
4. 不能使用JavaScript保留字作为变量名

## 最佳实践

1. **优先使用let和const**：避免使用var
2. **使用有意义的名称**：变量名应反映其用途
3. **使用驼峰命名法**：如`userName`、`totalPrice`
4. **避免全局变量**：尽量使用局部变量
5. **初始化变量**：声明时赋初始值
6. **使用const默认**：除非需要重新赋值才使用let

## 变量类型检查

使用`typeof`操作符检查变量类型：

```javascript
let str = "Hello";
let num = 42;
let bool = true;
let undef = undefined;
let nul = null;
let sym = Symbol("id");
let bigInt = 9007199254740991n;

console.log(typeof str); // "string"
console.log(typeof num); // "number"
console.log(typeof bool); // "boolean"
console.log(typeof undef); // "undefined"
console.log(typeof nul); // "object" (历史遗留问题)
console.log(typeof sym); // "symbol"
console.log(typeof bigInt); // "bigint"
```

## 变量转换

JavaScript会自动进行类型转换：

```javascript
let num = 42;
let str = "The answer is: " + num; // "The answer is: 42"

let bool = true;
let numFromBool = +bool; // 1
let strFromBool = "" + bool; // "true"
```

掌握变量是JavaScript编程的基础，理解它们对于编写正确的代码至关重要。