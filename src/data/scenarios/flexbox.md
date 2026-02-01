## 应用场景

### 场景 1：创建弹性布局

使用 Flexbox 实现简单的卡片布局。

```css
.container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.card {
  flex: 1 1 200px;  /* 最小宽度 200px，可用空间平均分配 */
}
```

### 场景 2：垂直居中

Flexbox 轻松实现水平和垂直居中。

```css
.center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}
```

### 场景 3：导航栏布局

```css
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
}
```

### 场景 4：固定底部栏

```css
.layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.content {
  flex: 1;
  overflow-y: auto;
}

.footer {
  flex-shrink: 0;
}
```

### 场景 5：头像 + 名称布局

```css
.user {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
```
