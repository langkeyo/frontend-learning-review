## 概念

响应式设计是指网页能够根据不同设备的屏幕尺寸和分辨率，自动调整布局和样式，提供最佳的用户体验。

### 核心技术

#### 1. 媒体查询 (Media Query)

```css
/* 默认样式：移动端优先 */
.container {
  padding: 10px;
}

/* 平板设备 */
@media (min-width: 768px) {
  .container {
    padding: 20px;
  }
}

/* 桌面设备 */
@media (min-width: 1024px) {
  .container {
    padding: 40px;
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

#### 2. 弹性单位

```css
.container {
  /* 相对单位 */
  width: 90%;           /* 百分比 */
  font-size: 1rem;      /* 根元素字体大小 */
  padding: 2em;        /* 当前元素字体大小 */
  margin: 5vw;         /* 视口宽度 */
}

/* Flexbox */
.row {
  display: flex;
  flex-wrap: wrap;
}
.item {
  flex: 1 1 200px;     /* 放大、缩小、基准 */
}

/* Grid */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}
```

#### 3. 响应式图片

```css
img {
  max-width: 100%;
  height: auto;
}

/* 使用 srcset */
<img
  src="small.jpg"
  srcset="small.jpg 500w, medium.jpg 1000w, large.jpg 2000w"
  sizes="(max-width: 768px) 100vw, 50vw"
  alt="响应式图片"
/>
```

### 断点建议

| 设备类型 | 宽度范围 | 断点 |
|----------|----------|-------|
| 手机 | < 576px | 576px |
| 平板 | 576px - 992px | 768px, 992px |
| 桌面 | 992px - 1200px | 1024px |
| 大屏 | > 1200px | 1200px, 1440px |

### 设计原则

1. **移动端优先**：先设计移动端样式，再增强桌面端
2. **内容优先**：确保核心内容在所有设备上可用
3. **触摸友好**：按钮和链接大小适合手指点击（至少 44x44px）
4. **性能优化**：压缩图片、减少资源加载
