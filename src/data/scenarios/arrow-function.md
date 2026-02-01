## 应用场景

### 场景 1：数组操作

箭头函数配合数组方法使代码更简洁。

```javascript
// 传统写法
users.map(function(user) {
  return user.name
})

// 箭头函数
users.map(user => user.name)

// 更简洁
users.map(({ name }) => name)
```

### 场景 2：Promise 处理

箭头函数非常适合链式调用。

```javascript
fetch('/api/users')
  .then(response => response.json())
  .then(users => users.filter(user => user.age > 18))
  .then(users => users.map(user => user.name))
```

### 场景 3：React 回调

在 React 中箭头函数是处理事件的推荐方式。

```javascript
// 保持 this 绑定
function Button({ onClick }) {
  return <button onClick={() => onClick()}>Click</button>
}

// 避免重复创建函数（如果不需要传递参数）
function Button({ onClick }) {
  return <button onClick={onClick}>Click</button>
}
```

### 场景 4：排序和过滤

```javascript
// 按年龄排序
users.sort((a, b) => a.age - b.age)

// 过滤成年人
const adults = users.filter(user => user.age >= 18)

// 查找第一个满足条件的
const found = users.find(user => user.id === 1)
```

### 注意事项

```javascript
// ❌ 错误：不要在对象方法中使用箭头函数
const obj = {
  value: 1,
  getValue: () => this.value  // this 不指向 obj
}

// ✅ 正确：使用简写方法
const obj = {
  value: 1,
  getValue() {
    return this.value
  }
}
```
