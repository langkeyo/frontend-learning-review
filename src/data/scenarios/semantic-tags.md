## 应用场景

### 场景 1：博客文章页面

使用语义化标签构建博客文章页面，SEO 效果更好，屏幕阅读器用户也能正确理解页面结构。

```html
<article>
  <header>
    <h1>文章标题</h1>
    <time datetime="2024-01-15">2024年1月15日</time>
  </header>
  <p>文章正文内容...</p>
  <footer>
    <p>作者：张三</p>
  </footer>
</article>
```

### 场景 2：电商产品详情页

使用 `<article>` 包裹产品信息，使用 `<aside>` 展示相关推荐，结构清晰易维护。

```html
<main>
  <article>
    <h1>商品名称</h1>
    <p>商品描述...</p>
  </article>
  <aside>
    <h3>相关推荐</h3>
    <ul>...</ul>
  </aside>
</main>
```

### 场景 3：文档网站

文档网站使用语义化标签，让导航和内容区分离。

```html
<body>
  <header>
    <nav>
      <!-- 全局导航 -->
    </nav>
  </header>
  <div class="layout">
    <aside>
      <!-- 侧边栏目录 -->
    </aside>
    <main>
      <!-- 文档内容 -->
    </main>
  </div>
</body>
```
