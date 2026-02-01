## 应用场景

### 场景 1：移动端优先设计

使用媒体查询优先为移动设备设计。

```css
/* 默认：移动端 */
.container {
  padding: 10px;
}

/* 平板 */
@media (min-width: 768px) {
  .container {
    padding: 20px;
  }
}

/* 桌面 */
@media (min-width: 1024px) {
  .container {
    padding: 40px;
    max-width: 1200px;
  }
}
```

### 场景 2：流式图片

```css
img {
  max-width: 100%;
  height: auto;
}
```

### 场景 3：隐藏非必要元素

```css
.sidebar {
  /* 默认显示 */
}

@media (max-width: 768px) {
  .sidebar {
    display: none;  /* 移动端隐藏 */
  }
}
```

### 场景 4：Flexbox 响应式

```css
.cards {
  display: flex;
  flex-wrap: wrap;
}

.card {
  flex: 1 1 300px;
}
```

### 场景 5：rem 单位实现

```css
:root {
  --base-font-size: 16px;
}

html {
  font-size: var(--base-font-size);
}

@media (max-width: 768px) {
  :root {
    --base-font-size: 14px;
  }
}
```
