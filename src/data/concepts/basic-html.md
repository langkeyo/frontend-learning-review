# HTML基础概念

## 什么是HTML？

HTML（HyperText Markup Language）是构建网页的标准标记语言。它描述了一个网页的结构，由一系列的元素组成，这些元素告诉浏览器如何显示内容。

## HTML文档结构

一个基本的HTML文档包含以下结构：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>页面标题</title>
</head>
<body>
    <!-- 页面内容 -->
</body>
</html>
```

## 常用HTML元素

### 文档结构元素
- `<!DOCTYPE html>`: 声明文档类型
- `<html>`: 根元素
- `<head>`: 包含元数据（如标题、字符集等）
- `<body>`: 包含可见的页面内容

### 文本内容元素
- `<h1>` - `<h6>`: 标题
- `<p>`: 段落
- `<a>`: 链接
- `<img>`: 图片
- `<div>`: 块级容器
- `<span>`: 行内容器

### 列表元素
- `<ul>`: 无序列表
- `<ol>`: 有序列表
- `<li>`: 列表项
- `<dl>`: 描述列表
- `<dt>`: 描述术语
- `<dd>`: 描述详情

### 表格元素
- `<table>`: 表格
- `<tr>`: 表格行
- `<th>`: 表头单元格
- `<td>`: 表格单元格

### 表单元素
- `<form>`: 表单
- `<input>`: 输入字段
- `<button>`: 按钮
- `<select>`: 下拉选择
- `<textarea>`: 多行文本

## HTML属性

HTML元素可以通过属性添加额外信息：

```html
<a href="https://example.com" target="_blank">链接</a>
<img src="image.jpg" alt="描述文字" width="200">
```

常见属性包括：
- `href`: 链接地址
- `src`: 资源路径
- `alt`: 替代文本
- `class`: CSS类名
- `id`: 唯一标识符
- `style`: 内联样式
- `title`: 工具提示

## 语义化HTML

语义化HTML使用有意义的标签来描述内容，提高可访问性和SEO：

```html
<header>网站头部</header>
<nav>导航栏</nav>
<main>主要内容</main>
<article>文章</article>
<section>章节</section>
<footer>页脚</footer>
```

## HTML5新特性

HTML5引入了许多新元素和API：

- 语义化元素（如`<header>`、`<nav>`、`<main>`）
- 多媒体元素（`<audio>`、`<video>`）
- Canvas绘图
- 地理定位
- 本地存储
- Web Workers

## 最佳实践

1. 始终使用正确的文档类型声明
2. 指定字符集（UTF-8）
3. 使用语义化标签
4. 为图片提供替代文本
5. 确保良好的可访问性
6. 保持代码整洁和格式化

通过掌握这些HTML基础知识，你将能够创建结构良好、语义清晰的网页。