# Iterator & Generator

## 什么是Iterator？

Iterator（迭代器）是一种对象，它提供了一种顺序访问集合中元素的方法，而不需要暴露集合的底层表示。

## 基本概念

### Iterator协议

Iterator需要实现`next()`方法，该方法返回一个包含`value`和`done`属性的对象。

```javascript
const iterator = {
  next: function() {
    return {
      value: 'some value',
      done: false
    };
  }
};
```

### Iterable协议

Iterable是可迭代的对象，需要实现`[Symbol.iterator]()`方法，该方法返回一个Iterator。

```javascript
const iterable = {
  [Symbol.iterator]: function() {
    let count = 0;
    return {
      next: function() {
        if (count < 3) {
          return { value: count++, done: false };
        }
        return { value: undefined, done: true };
      }
    };
  }
};
```

## 内置Iterator

### 数组Iterator

```javascript
const array = [1, 2, 3];
const iterator = array[Symbol.iterator]();

console.log(iterator.next()); // { value: 1, done: false }
console.log(iterator.next()); // { value: 2, done: false }
console.log(iterator.next()); // { value: 3, done: false }
console.log(iterator.next()); // { value: undefined, done: true }
```

### 字符串Iterator

```javascript
const str = 'hello';
const iterator = str[Symbol.iterator]();

console.log(iterator.next()); // { value: 'h', done: false }
console.log(iterator.next()); // { value: 'e', done: false }
// ...
```

### Map和Set Iterator

```javascript
const map = new Map([['a', 1], ['b', 2]]);
const iterator = map[Symbol.iterator]();

for (const [key, value] of map) {
  console.log(key, value);
}
```

## for...of循环

```javascript
const array = [1, 2, 3];

for (const item of array) {
  console.log(item);
}

// 等价于
const iterator = array[Symbol.iterator]();
let result = iterator.next();
while (!result.done) {
  console.log(result.value);
  result = iterator.next();
}
```

## Generator函数

### 基本语法

```javascript
function* generatorFunction() {
  yield 1;
  yield 2;
  yield 3;
}

const generator = generatorFunction();

console.log(generator.next()); // { value: 1, done: false }
console.log(generator.next()); // { value: 2, done: false }
console.log(generator.next()); // { value: 3, done: false }
console.log(generator.next()); // { value: undefined, done: true }
```

### 带参数的Generator

```javascript
function* parameterizedGenerator(initial) {
  const first = yield initial;
  const second = yield first + 1;
  return first + second;
}

const gen = parameterizedGenerator(10);
console.log(gen.next()); // { value: 10, done: false }
console.log(gen.next(20)); // { value: 21, done: false }
console.log(gen.next(30)); // { value: 50, done: true }
```

### 无限Generator

```javascript
function* infiniteGenerator() {
  let i = 0;
  while (true) {
    yield i++;
  }
}

const gen = infiniteGenerator();
console.log(gen.next().value); // 0
console.log(gen.next().value); // 1
console.log(gen.next().value); // 2
```

## Generator方法

### return()

```javascript
function* generator() {
  yield 1;
  yield 2;
  yield 3;
}

const gen = generator();
console.log(gen.next()); // { value: 1, done: false }
console.log(gen.return('finished')); // { value: 'finished', done: true }
console.log(gen.next()); // { value: undefined, done: true }
```

### throw()

```javascript
function* generator() {
  try {
    yield 1;
    yield 2;
  } catch (e) {
    console.log('Caught:', e);
    yield 3;
  }
}

const gen = generator();
console.log(gen.next()); // { value: 1, done: false }
console.log(gen.throw('error')); // 打印'Caught: error'，返回{ value: 3, done: false }
console.log(gen.next()); // { value: undefined, done: true }
```

## 实用场景

### 自定义迭代器

```javascript
const range = {
  [Symbol.iterator]: function* (start, end) {
    for (let i = start; i <= end; i++) {
      yield i;
    }
  }
};

for (const num of range[Symbol.iterator](1, 5)) {
  console.log(num); // 1, 2, 3, 4, 5
}
```

### 懒加载序列

```javascript
function* fibonacci() {
  let [a, b] = [0, 1];
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

const fib = fibonacci();
console.log(fib.next().value); // 0
console.log(fib.next().value); // 1
console.log(fib.next().value); // 1
console.log(fib.next().value); // 2
```

### 异步Generator

```javascript
async function* asyncGenerator() {
  yield await Promise.resolve(1);
  yield await Promise.resolve(2);
  yield await Promise.resolve(3);
}

(async () => {
  const gen = asyncGenerator();
  console.log(await gen.next().value); // 1
  console.log(await gen.next().value); // 2
  console.log(await gen.next().value); // 3
})();
```

### 使用Generator处理流数据

```javascript
function* processDataStream(stream) {
  for await (const chunk of stream) {
    yield processChunk(chunk);
  }
}

// 使用
for (const processed of processDataStream(dataStream)) {
  console.log(processed);
}
```

### 实现Iterator模式

```javascript
class Collection {
  constructor(items) {
    this.items = items;
  }

  [Symbol.iterator]() {
    let index = 0;
    const items = this.items;

    return {
      next: () => {
        if (index < items.length) {
          return { value: items[index++], done: false };
        }
        return { value: undefined, done: true };
      }
    };
  }
}

const collection = new Collection([1, 2, 3]);
for (const item of collection) {
  console.log(item);
}
```

## 最佳实践

### 1. 使用Generator处理大数据集

```javascript
function* largeDataSet() {
  for (let i = 0; i < 1000000; i++) {
    yield i;
  }
}

// 逐个处理，不占用大量内存
for (const item of largeDataSet()) {
  if (item > 100) break; // 只处理前100个
}
```

### 2. 使用Generator实现状态机

```javascript
function* stateMachine() {
  let state = 'init';

  while (true) {
    switch (state) {
      case 'init':
        state = yield 'initialized';
        break;
      case 'running':
        state = yield 'running...';
        break;
      case 'stopped':
        return 'stopped';
    }
  }
}

const machine = stateMachine();
console.log(machine.next().value); // 'initialized'
console.log(machine.next('running').value); // 'running...'
console.log(machine.next('stopped').value); // 'stopped'
```

### 3. 使用Generator实现异步流程控制

```javascript
async function* asyncFlow() {
  const data1 = await fetchData1();
  yield process(data1);

  const data2 = await fetchData2();
  yield process(data2);

  return combineResults(data1, data2);
}
```

### 4. 避免无限Generator导致内存泄漏

```javascript
// 不推荐：可能造成内存泄漏
function* infiniteGenerator() {
  while (true) {
    yield Math.random();
  }
}

// 推荐：提供停止条件
function* boundedGenerator(limit) {
  for (let i = 0; i < limit; i++) {
    yield i;
  }
}
```

## 常见误区

### 1. 混淆Generator和普通函数

```javascript
// 错误：忘记使用*
function generator() {
  yield 1;
}

// 正确
function* generator() {
  yield 1;
}
```

### 2. 忽略Generator的惰性求值

```javascript
// 错误：认为所有yield都会立即执行
function* generator() {
  console.log('Before yield 1');
  yield 1;
  console.log('After yield 1');
  yield 2;
}

const gen = generator();
console.log(gen.next()); // 只打印'Before yield 1'
```

### 3. 不正确的参数传递

```javascript
// 错误：next()的参数传递方式
function* generator() {
  const first = yield 1;
  const second = yield first + 1;
  return first + second;
}

const gen = generator();
gen.next(); // { value: 1, done: false }
gen.next(10); // { value: 11, done: false }
gen.next(20); // { value: 30, done: true }
```

### 4. 忽略错误处理

```javascript
// 不推荐：没有错误处理
function* generator() {
  yield someOperation();
}

// 推荐：添加错误处理
function* generator() {
  try {
    yield someOperation();
  } catch (error) {
    console.error('Operation failed:', error);
  }
}
```

Iterator和Generator是JavaScript中强大的工具，它们提供了灵活的方式来处理序列数据和异步操作。掌握它们可以让你的代码更加高效和优雅。