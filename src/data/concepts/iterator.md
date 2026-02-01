## 概念

Iterator（迭代器）是一种接口，为各种数据结构提供统一的访问机制。Generator（生成器）是返回迭代器的函数。

### Iterator 接口

迭代器对象必须具有 `next()` 方法，返回 `{ value, done }`。

```javascript
// 自定义迭代器
const myIterator = {
  data: [1, 2, 3],
  index: 0,
  next() {
    if (this.index < this.data.length) {
      return { value: this.data[this.index++], done: false }
    }
    return { value: undefined, done: true }
  }
}

console.log(myIterator.next())  // { value: 1, done: false }
console.log(myIterator.next())  // { value: 2, done: false }
console.log(myIterator.next())  // { value: 3, done: false }
console.log(myIterator.next())  // { value: undefined, done: true }
```

### 迭代协议

#### 可迭代对象

具有 `[Symbol.iterator]` 方法的对象称为可迭代对象。

```javascript
const iterable = {
  [Symbol.iterator]() {
    let step = 0
    return {
      next() {
        step++
        if (step <= 3) {
          return { value: step, done: false }
        }
        return { value: undefined, done: true }
      }
    }
  }
}

for (const item of iterable) {
  console.log(item)  // 1, 2, 3
}
```

### Generator

Generator 是使用 `function*` 定义的函数，使用 `yield` 产生值。

```javascript
function* count() {
  yield 1
  yield 2
  yield 3
}

const gen = count()
console.log(gen.next())  // { value: 1, done: false }
console.log(gen.next())  // { value: 2, done: false }
console.log(gen.next())  // { value: 3, done: false }
console.log(gen.next())  // { value: undefined, done: true }

// 使用 for...of
for (const value of count()) {
  console.log(value)  // 1, 2, 3
}
```

### Generator 特性

```javascript
// 带参数
function* range(start, end) {
  while (start <= end) {
    yield start++
  }
}

// 返回值
function* withReturn() {
  yield 1
  yield 2
  return '完成'
}

// yield* 委托
function* combined() {
  yield* [1, 2, 3]
  yield* 'abc'
}
```

### 内置迭代器

| 数据类型 | 迭代方式 |
|----------|----------|
| Array | 按索引 |
| String | 按字符 |
| Map | 按键值对 |
| Set | 按值 |
| Arguments | 按索引 |
