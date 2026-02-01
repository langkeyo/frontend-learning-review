# Flexbox 布局

## 什么是Flexbox？

Flexbox（弹性盒子布局）是一种一维布局模型，用于在容器中排列项目。它提供了更高效的方式来对齐、分布空间和排序项目，即使它们的尺寸未知或动态变化。

## 基本概念

### 容器和项目

- **Flex容器**：设置为`display: flex`或`display: inline-flex`的元素
- **Flex项目**：容器内的直接子元素

```css
.container {
  display: flex; /* 启用Flexbox布局 */
}
```

## 主要属性

### 容器属性

#### `flex-direction`
控制主轴方向（项目排列方向）

- `row`（默认）：从左到右
- `row-reverse`：从右到左
- `column`：从上到下
- `column-reverse`：从下到上

```css
.container {
  flex-direction: row; /* 默认值 */
}
```

#### `flex-wrap`
控制项目是否换行

- `nowrap`（默认）：不换行
- `wrap`：换行
- `wrap-reverse`：反向换行

```css
.container {
  flex-wrap: wrap; /* 允许换行 */
}
```

#### `justify-content`
控制项目在主轴上的对齐方式

- `flex-start`（默认）：左对齐
- `flex-end`：右对齐
- `center`：居中对齐
- `space-between`：两端对齐，项目之间间距相等
- `space-around`：每个项目两侧间距相等
- `space-evenly`：项目之间间距相等

```css
.container {
  justify-content: center; /* 居中对齐 */
}
```

#### `align-items`
控制项目在交叉轴上的对齐方式

- `stretch`（默认）：拉伸填充
- `flex-start`：顶部对齐
- `flex-end`：底部对齐
- `center`：居中对齐
- `baseline`：基线对齐

```css
.container {
  align-items: center; /* 垂直居中 */
}
```

#### `align-content`
控制多行项目在交叉轴上的对齐方式（仅当有换行时生效）

- `stretch`（默认）
- `flex-start`
- `flex-end`
- `center`
- `space-between`
- `space-around`
- `space-evenly`

```css
.container {
  align-content: space-between; /* 多行项目两端对齐 */
}
```

### 项目属性

#### `order`
控制项目的排列顺序（数值越小，排列越靠前）

```css
.item {
  order: 2; /* 默认为0 */
}
```

#### `flex-grow`
控制项目的放大比例（默认为0）

```css
.item {
  flex-grow: 1; /* 允许项目放大 */
}
```

#### `flex-shrink`
控制项目的缩小比例（默认为1）

```css
.item {
  flex-shrink: 0; /* 不允许项目缩小 */
}
```

#### `flex-basis`
控制项目的初始大小（默认为`auto`）

```css
.item {
  flex-basis: 200px; /* 初始宽度为200px */
}
```

#### `flex`
`flex-grow`、`flex-shrink`和`flex-basis`的简写

```css
.item {
  flex: 1 1 200px; /* 放大1，缩小1，初始200px */
}
```

#### `align-self`
控制单个项目在交叉轴上的对齐方式（覆盖`align-items`）

```css
.item {
  align-self: flex-end; /* 覆盖容器的align-items */
}
```

## 实用场景

### 创建响应式布局

```css
.container {
  display: flex;
  flex-wrap: wrap;
}

.item {
  flex: 1 1 300px; /* 基础宽度300px，可放大缩小 */
}

/* 在小屏幕上 */
@media (max-width: 768px) {
  .item {
    flex-basis: 100%; /* 每个项目占满一行 */
  }
}
```

### 创建导航栏

```css
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-item {
  padding: 10px 20px;
}
```

### 创建卡片布局

```css
.cards {
  display: flex;
  gap: 20px; /* 项目间距 */
  flex-wrap: wrap;
}

.card {
  flex: 1 1 300px; /* 响应式卡片 */
}
```

## 最佳实践

1. 使用`flex`简写属性代替单独设置
2. 合理使用`gap`属性替代margin
3. 考虑使用`flex-wrap`处理响应式布局
4. 使用`align-items`和`justify-content`进行对齐
5. 避免过度嵌套Flexbox布局

Flexbox是现代CSS布局的基础，掌握它对于创建灵活、响应式的网页布局至关重要。