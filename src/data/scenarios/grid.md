## 应用场景

### 场景 1：网格布局

使用 Grid 创建典型的博客布局。

```css
.grid-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
}
```

### 场景 2：卡片网格

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}
```

### 场景 3：复杂的 Dashboard

```css
.dashboard {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar content"
    "footer footer";
  grid-template-columns: 250px 1fr;
  grid-template-rows: 60px 1fr 50px;
  gap: 20px;
}
```

### 场景 4：响应式 Grid

```css
@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
```

### 场景 5：命名网格线

```css
.grid {
  display: grid;
  grid-template-columns: [100px 1fr] 200px;
  grid-template-rows: [auto 50px];
  gap: 10px;
}
```
