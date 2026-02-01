## 应用场景

### 场景 1：遍历数组

使用 for...of 遍历数组元素。

```javascript
const numbers = [1, 2, 3, 4, 5]

for (const num of numbers) {
  console.log(num)
}
```

### 场景 2：遍历对象

使用 for...in 遍历对象属性。

```javascript
const obj = { a: 1, b: 2, c: 3 }

for (const key in obj) {
  console.log(key, obj[key])
}
```

### 场景 3：创建可迭代对象

使用 `[Symbol.iterator]` 方法使对象可迭代。

```javascript
const range = {
  start: 1,
  end: 5,
  [Symbol.iterator]() {
    let current = this.start
    return {
      next() {
        if (current <= this.end) {
          return { value: current++, done: false }
        }
        return { done: true }
      }
    }
  }
}

for (const num of range) {
  console.log(num)
}
```

### 场景 4：Generator 函数基础

使用 `function*` 创建生成器。

```javascript
function* generateNumbers() {
  yield 1
  yield 2
  yield 3
}

for (const num of generateNumbers()) {
  console.log(num)
}
```

### 场景 5：无限序列 Generator

```javascript
function* infiniteSequence() {
  let i = 0
  while (true) {
    yield i++
  }
}

const generator = infiniteSequence()
console.log(generator.next().value)  // 0
console.log(generator.next().value)  // 1
```
