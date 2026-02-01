# 语义化标签

## 什么是语义化标签？

语义化标签是指使用具有明确含义的HTML标签来描述内容的结构和意义，而不是仅仅使用通用的`<div>`和`<span>`标签。语义化标签让HTML文档更具可读性，对搜索引擎优化（SEO）和 accessibility（无障碍访问）都有重要意义。

## 常见的语义化标签

### 文档结构标签

- `<header>` - 页面头部
- `<nav>` - 导航栏
- `<main>` - 主内容区域
- `<article>` - 独立的文章内容
- `<section>` - 文档中的节
- `<aside>` - 侧边栏内容
- `<footer>` - 页面底部

### 文本内容标签

- `<h1>` - `<h6>` - 标题级别
- `<p>` - 段落
- `<blockquote>` - 引用
- `<pre>` - 预格式化文本
- `<code>` - 代码片段
- `<figure>` - 图形内容（如图表、图片等）
- `<figcaption>` - 图形内容的说明

### 列表标签

- `<ul>` - 无序列表
- `<ol>` - 有序列表
- `<li>` - 列表项
- `<dl>` - 描述列表
- `<dt>` - 描述列表的术语
- `<dd>` - 描述列表的描述

### 表单标签

- `<form>` - 表单
- `<input>` - 输入字段
- `<textarea>` - 多行文本输入
- `<button>` - 按钮
- `<label>` - 标签
- `<fieldset>` - 表单分组
- `<legend>` - 分组标题

### 多媒体标签

- `<img>` - 图片
- `<audio>` - 音频
- `<video>` - 视频
- `<iframe>` - 内嵌框架

## 为什么使用语义化标签？

1. **可读性**：代码更容易理解和维护
2. **SEO优化**：搜索引擎能更好地理解页面内容
3. **无障碍访问**：屏幕阅读器能更好地解析页面
4. **CSS选择器**：更容易通过CSS选择器进行样式控制
5. **JavaScript操作**：更容易通过JavaScript操作DOM元素

## 示例代码

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>语义化标签示例</title>
</head>
<body>
    <header>
        <h1>网站标题</h1>
        <nav>
            <ul>
                <li><a href="#">首页</a></li>
                <li><a href="#">关于我们</a></li>
                <li><a href="#">联系我们</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <article>
            <h2>文章标题</h2>
            <p>这是一段文章内容...</p>
            <section>
                <h3>章节标题</h3>
                <p>这是章节内容...</p>
            </section>
        </article>

        <aside>
            <h3>侧边栏</h3>
            <p>侧边栏内容...</p>
        </aside>
    </main>

    <footer>
        <p>版权信息 © 2024</p>
    </footer>
</body>
</html>
```

## 最佳实践

1. 使用合适的标签来描述内容的真实含义
2. 避免过度使用`<div>`和`<span>`
3. 为图片添加`alt`属性
4. 为表单元素添加适当的`label`标签
5. 使用`lang`属性指定文档语言

语义化标签是现代HTML开发的基础，掌握它们对于编写高质量、可维护的网页代码至关重要。