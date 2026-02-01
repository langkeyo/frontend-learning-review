## 概念

解构赋值是 ES6 引入的语法，允许从数组或对象中提取值并赋给变量。

### 数组解构

```javascript
// 基本用法
const [a, b, c] = [1, 2, 3]
console.log(a, b, c)  // 1 2 3

// 跳过元素
const [first, , third] = [1, 2, 3, 4]
console.log(first, third)  // 1 3

// 剩余元素
const [head, ...tail] = [1, 2, 3, 4]
console.log(head, tail)  // 1 [2, 3, 4]

// 默认值
const [x = 1, y = 2] = [3]
console.log(x, y)  // 3 2
```

### 对象解构

```javascript
// 基本用法
const { name, age } = { name: '张三', age: 25 }
console.log(name, age)  // 张三 25

// 重命名
const { name: userName, age: userAge } = { name: '张三', age: 25 }
console.log(userName, userAge)  // 张三 25

// 默认值
const { name = '默认名', city = '北京' } = { name: '李四' }
console.log(name, city)  // 李四 北京

// 剩余属性
const { first, ...rest } = { first: 1, second: 2, third: 3 }
console.log(first, rest)  // 1 { second: 2, third: 3 }
```

### 嵌套解构

```javascript
const user = {
  name: '张三',
  address: {
    city: '北京',
    district: '朝阳区'
  }
}

const { name, address: { city } } = user
console.log(name, city)  // 张三 北京
```

### 函数参数解构

```javascript
// 对象解构
function greet({ name, age }) {
  console.log(`${name} 今年 ${age} 岁`)
}
greet({ name: '张三', age: 25 })

// 数组解构
function sum([a, b, c]) {
  return a + b + c
}
sum([1, 2, 3])  // 6

// 默认值
function createUser({ name = '匿名', age = 18 } = {}) {
  return { name, age }
}
createUser()  // { name: '匿名', age: 18 }
```
