# Grid 布局

## 什么是Grid布局？

CSS Grid布局是一种二维布局系统，用于在网页上创建复杂的网格结构。它允许你将页面划分为行和列，并将内容放置在网格的特定位置。

## 基本概念

### 容器和项目

- **Grid容器**：设置为`display: grid`或`display: inline-grid`的元素
- **Grid项目**：容器内的直接子元素

```css
.container {
  display: grid; /* 启用Grid布局 */
}
```

## 主要属性

### 容器属性

#### `grid-template-columns` 和 `grid-template-rows`
定义列和行的尺寸

```css
.container {
  /* 定义3列，每列200px */
  grid-template-columns: 200px 200px 200px;

  /* 定义2行，第一行100px，第二行auto */
  grid-template-rows: 100px auto;
}
```

#### `grid-template-areas`
使用命名区域定义布局

```css
.container {
  grid-template-areas:
    "header header header"
    "sidebar main main"
    "footer footer footer";
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }
```

#### `grid-template`
`grid-template-columns`、`grid-template-rows`和`grid-template-areas`的简写

```css
.container {
  grid-template:
    "header header header" 100px
    "sidebar main main" auto
    "footer footer footer" 50px
    / 200px 1fr 200px;
}
```

#### `grid-column-gap` 和 `grid-row-gap`
定义列和行之间的间距

```css
.container {
  grid-column-gap: 20px; /* 列间距 */
  grid-row-gap: 10px;    /* 行间距 */
}
```

#### `gap`
`grid-column-gap`和`grid-row-gap`的简写

```css
.container {
  gap: 20px 10px; /* 列间距20px，行间距10px */
}
```

#### `grid-auto-columns` 和 `grid-auto-rows`
定义自动创建的列和行的尺寸

```css
.container {
  grid-auto-columns: 100px; /* 自动创建的列宽度 */
  grid-auto-rows: 50px;    /* 自动创建的行高度 */
}
```

#### `grid-auto-flow`
控制自动布局算法

```css
.container {
  grid-auto-flow: row; /* 默认，按行填充 */
  /* 或 column：按列填充 */
  /* 或 dense：紧密填充，尝试填充空白 */
}
```

#### `justify-items`
控制项目在单元格内的水平对齐方式

```css
.container {
  justify-items: stretch; /* 默认，拉伸填充 */
  /* start：左对齐 */
  /* end：右对齐 */
  /* center：居中对齐 */
  /* baseline：基线对齐 */
}
```

#### `align-items`
控制项目在单元格内的垂直对齐方式

```css
.container {
  align-items: stretch; /* 默认，拉伸填充 */
  /* start：顶部对齐 */
  /* end：底部对齐 */
  /* center：居中对齐 */
  /* baseline：基线对齐 */
}
```

#### `justify-content`
控制整个网格在容器内的水平对齐方式

```css
.container {
  justify-content: stretch; /* 默认，拉伸填充 */
  /* start：左对齐 */
  /* end：右对齐 */
  /* center：居中对齐 */
  /* space-between：两端对齐 */
  /* space-around：周围间距相等 */
  /* space-evenly：间距相等 */
}
```

#### `align-content`
控制整个网格在容器内的垂直对齐方式

```css
.container {
  align-content: stretch; /* 默认，拉伸填充 */
  /* start：顶部对齐 */
  /* end：底部对齐 */
  /* center：居中对齐 */
  /* space-between：两端对齐 */
  /* space-around：周围间距相等 */
  /* space-evenly：间距相等 */
}
```

#### `grid`
所有Grid属性的简写

```css
.container {
  grid:
    "header header header" 100px
    "sidebar main main" auto
    "footer footer footer" 50px
    / 200px 1fr 200px;
}
```

### 项目属性

#### `grid-column-start`、`grid-column-end`、`grid-row-start`、`grid-row-end`
控制项目跨越的列和行

```css
.item {
  grid-column-start: 1;   /* 从第1列开始 */
  grid-column-end: 3;     /* 到第3列结束 */
  grid-row-start: 2;      /* 从第2行开始 */
  grid-row-end: 4;        /* 到第4行结束 */
}
```

#### `grid-column` 和 `grid-row`
`grid-column-start`和`grid-column-end`的简写，`grid-row-start`和`grid-row-end`的简写

```css
.item {
  grid-column: 1 / 3;    /* 从第1列到第3列 */
  grid-row: 2 / 4;       /* 从第2行到第4行 */
}
```

#### `grid-area`
`grid-row-start`、`grid-column-start`、`grid-row-end`、`grid-column-end`的简写，或使用命名区域

```css
.item {
  grid-area: 2 / 1 / 4 / 3; /* 行开始/列开始/行结束/列结束 */

  /* 或使用命名区域 */
  grid-area: header;
}
```

#### `justify-self`
控制单个项目在单元格内的水平对齐方式（覆盖`justify-items`）

```css
.item {
  justify-self: center; /* 覆盖容器的justify-items */
}
```

#### `align-self`
控制单个项目在单元格内的垂直对齐方式（覆盖`align-items`）

```css
.item {
  align-self: center; /* 覆盖容器的align-items */
}
```

## 实用场景

### 创建响应式网格布局

```css
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

/* 在大屏幕上 */
@media (min-width: 1024px) {
  .container {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

### 创建复杂布局

```css
.layout {
  display: grid;
  grid-template:
    "header header header" 80px
    "sidebar main aside" 1fr
    "footer footer footer" 60px
    / 200px 1fr 200px;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.aside { grid-area: aside; }
.footer { grid-area: footer; }
```

### 创建图片网格

```css
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
}

.image-item {
  aspect-ratio: 1; /* 保持正方形 */
}
```

## 最佳实践

1. 使用`repeat()`函数创建重复的列或行
2. 使用`minmax()`创建响应式列
3. 使用`auto-fit`和`auto-fill`创建自适应布局
4. 使用命名区域提高代码可读性
5. 避免过度嵌套Grid布局

Grid布局是创建复杂、响应式网页布局的强大工具，掌握它对于现代前端开发至关重要。