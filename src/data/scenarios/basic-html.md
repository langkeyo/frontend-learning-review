# HTML基础应用场景

## 网页结构搭建

### 场景描述
创建一个简单的个人博客页面，包含头部、导航、主要内容区和页脚。

### 实现步骤

1. **创建HTML结构**
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>我的个人博客</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>我的博客</h1>
        <nav>
            <ul>
                <li><a href="#home">首页</a></li>
                <li><a href="#about">关于我</a></li>
                <li><a href="#posts">文章</a></li>
                <li><a href="#contact">联系</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <section id="home">
            <h2>欢迎来到我的博客</h2>
            <p>这里分享我的技术心得和学习经验。</p>
        </section>

        <section id="about">
            <h2>关于我</h2>
            <p>我是一名前端开发者，热爱技术分享。</p>
        </section>

        <section id="posts">
            <h2>最新文章</h2>
            <article>
                <h3>HTML基础教程</h3>
                <p>学习HTML是前端开发的第一步...</p>
            </article>
            <article>
                <h3>CSS样式指南</h3>
                <p>掌握CSS样式是美化网页的关键...</p>
            </article>
        </section>

        <section id="contact">
            <h2>联系我</h2>
            <p>邮箱：example@email.com</p>
        </section>
        <form>
            <label for="name">姓名：</label>
            <input type="text" id="name" name="name" required>

            <label for="email">邮箱：</label>
            <input type="email" id="email" name="email" required>

            <label for="message">留言：</label>
            <textarea id="message" name="message" rows="5" required></textarea>

            <button type="submit">发送</button>
        </form>
    </main>

    <footer>
        <p>&copy; 2024 我的个人博客</p>
    </footer>
</body>
</html>
```

2. **添加基本样式**
```css
body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    margin: 0;
    padding: 20px;
}

header {
    background-color: #4a90e2;
    color: white;
    padding: 20px;
    border-radius: 5px;
    margin-bottom: 20px;
}

nav ul {
    list-style: none;
    padding: 0;
}

nav ul li {
    display: inline;
    margin-right: 20px;
}

nav ul li a {
    color: white;
    text-decoration: none;
}

main {
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

section {
    margin-bottom: 30px;
}

h1, h2 {
    color: #2c3e50;
}

pre {
    background-color: #f8f8f8;
    padding: 15px;
    border-radius: 5px;
    overflow-x: auto;
}

footer {
    text-align: center;
    margin-top: 30px;
    padding: 10px;
    background-color: #eee;
    border-radius: 5px;
}

/* 响应式设计基础 */
@media (max-width: 768px) {
    body {
        padding: 10px;
    }

    header {
        padding: 15px;
    }

    nav ul li {
        display: block;
        margin: 5px 0;
    }
}
```

3. **添加交互效果**
```javascript
// DOM元素选择
const header = document.querySelector('header');
const navLinks = document.querySelectorAll('nav a');

// 添加交互效果
header.addEventListener('mouseenter', () => {
    header.style.backgroundColor = '#357abd';
});

header.addEventListener('mouseleave', () => {
    header.style.backgroundColor = '#4a90e2';
});

// 导航链接点击效果
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        // 模拟页面滚动到对应部分
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 页面加载完成事件
document.addEventListener('DOMContentLoaded', () => {
    console.log('HTML基础页面已加载');

    // 检查浏览器支持
    if ('serviceWorker' in navigator) {
        console.log('Service Worker 支持可用');
    }
});

// 简单的函数示例
function greet(name) {
    return `你好, ${name}! 欢迎学习HTML基础。`;
}

console.log(greet('学习者'));
```

## 表单处理

### 场景描述
创建一个联系表单，收集用户信息并验证输入。

### 实现步骤

1. **HTML表单**
```html
<form id="contact-form">
    <div class="form-group">
        <label for="name">姓名：</label>
        <input type="text" id="name" name="name" required minlength="2" maxlength="50">
        <span class="error" id="name-error"></span>
    </div>

    <div class="form-group">
        <label for="email">邮箱：</label>
        <input type="email" id="email" name="email" required>
        <span class="error" id="email-error"></span>
    </div>

    <div class="form-group">
        <label for="message">留言：</label>
        <textarea id="message" name="message" rows="5" required minlength="10"></textarea>
        <span class="error" id="message-error"></span>
    </div>

    <button type="submit">发送</button>
</form>
```

2. **CSS样式**
```css
.form-group {
    margin-bottom: 15px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

.form-group input,
.form-group textarea {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
}

.error {
    color: #e74c3c;
    font-size: 0.9em;
    margin-top: 5px;
    display: none;
}

button {
    background-color: #4a90e2;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:hover {
    background-color: #357abd;
}
```

3. **JavaScript验证**
```javascript
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');

    // 实时验证
    nameInput.addEventListener('input', validateName);
    emailInput.addEventListener('input', validateEmail);
    messageInput.addEventListener('input', validateMessage);

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isMessageValid = validateMessage();

        if (isNameValid && isEmailValid && isMessageValid) {
            // 表单提交逻辑
            console.log('表单提交成功');
            alert('感谢您的留言！');
            form.reset();
        }
    });

    function validateName() {
        const value = nameInput.value.trim();
        if (value.length < 2) {
            nameError.textContent = '姓名至少需要2个字符';
            nameError.style.display = 'block';
            return false;
        } else if (value.length > 50) {
            nameError.textContent = '姓名不能超过50个字符';
            nameError.style.display = 'block';
            return false;
        } else {
            nameError.style.display = 'none';
            return true;
        }
    }

    function validateEmail() {
        const value = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(value)) {
            emailError.textContent = '请输入有效的邮箱地址';
            emailError.style.display = 'block';
            return false;
        } else {
            emailError.style.display = 'none';
            return true;
        }
    }

    function validateMessage() {
        const value = messageInput.value.trim();
        if (value.length < 10) {
            messageError.textContent = '留言至少需要10个字符';
            messageError.style.display = 'block';
            return false;
        } else {
            messageError.style.display = 'none';
            return true;
        }
    }
});
```

## 列表和表格

### 场景描述
创建一个产品列表页面，展示产品信息和价格。

### 实现步骤

1. **HTML结构**
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>产品列表</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>产品列表</h1>
    </header>

    <main>
        <section id="product-list">
            <h2>热门产品</h2>

            <div class="product-grid">
                <div class="product-card">
                    <img src="product1.jpg" alt="产品1">
                    <h3>产品名称1</h3>
                    <p>产品描述：这是第一个产品的详细描述...</p>
                    <span class="price">¥99.00</span>
                    <button class="add-to-cart">加入购物车</button>
                </div>

                <div class="product-card">
                    <img src="product2.jpg" alt="产品2">
                    <h3>产品名称2</h3>
                    <p>产品描述：这是第二个产品的详细描述...</p>
                    <span class="price">¥149.00</span>
                    <button class="add-to-cart">加入购物车</button>
                </div>

                <div class="product-card">
                    <img src="product3.jpg" alt="产品3">
                    <h3>产品名称3</h3>
                    <p>产品描述：这是第三个产品的详细描述...</p>
                    <span class="price">¥199.00</span>
                    <button class="add-to-cart">加入购物车</button>
                </div>
            </div>
        </section>
    </main>

    <footer>
        <p>&copy; 2024 产品列表页面</p>
    </footer>
</body>
</html>
```

2. **CSS样式**
```css
body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    margin: 0;
    padding: 20px;
}

header {
    background-color: #4a90e2;
    color: white;
    padding: 20px;
    border-radius: 5px;
    margin-bottom: 20px;
}

header h1 {
    margin: 0;
}

main {
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
}

.product-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 15px;
    text-align: center;
}

.product-card img {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
    margin-bottom: 10px;
}

.product-card h3 {
    margin: 10px 0 5px;
    color: #2c3e50;
}

.product-card p {
    color: #666;
    margin: 0 0 10px;
    font-size: 0.9em;
}

.price {
    display: block;
    font-size: 1.2em;
    font-weight: bold;
    color: #e74c3c;
    margin: 10px 0;
}

.add-to-cart {
    background-color: #27ae60;
    color: white;
    border: none;
    padding: 8px 15px;
    border-radius: 4px;
    cursor: pointer;
}

.add-to-cart:hover {
    background-color: #2ecc71;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .product-grid {
        grid-template-columns: 1fr;
    }
}
```

3. **JavaScript交互**
```javascript
document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartCount = document.createElement('div');
    cartCount.id = 'cart-count';
    cartCount.style.position = 'fixed';
    cartCount.style.top = '20px';
    cartCount.style.right = '20px';
    cartCount.style.background = '#4a90e2';
    cartCount.style.color = 'white';
    cartCount.style.padding = '10px 15px';
    cartCount.style.borderRadius = '4px';
    cartCount.style.display = 'none';
    document.body.appendChild(cartCount);

    let cartItems = 0;

    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            cartItems++;
            cartCount.textContent = `购物车: ${cartItems} 件商品`;
            cartCount.style.display = 'block';

            // 添加动画效果
            button.textContent = '已添加 ✓';
            button.style.backgroundColor = '#27ae60';

            setTimeout(() => {
                button.textContent = '加入购物车';
                button.style.backgroundColor = '';
            }, 1000);
        });
    });
});
```

## 图片 gallery

### 场景描述
创建一个图片展示页面，支持响应式布局和lightbox效果。

### 实现步骤

1. **HTML结构**
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>图片 Gallery</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>图片 Gallery</h1>
    </header>

    <main>
        <section id="image-gallery">
            <div class="gallery-grid">
                <div class="gallery-item">
                    <img src="image1.jpg" alt="图片1" class="gallery-image">
                    <div class="gallery-overlay">
                        <div class="gallery-caption">图片1描述</div>
                    </div>
                </div>

                <div class="gallery-item">
                    <img src="image2.jpg" alt="图片2" class="gallery-image">
                    <div class="gallery-overlay">
                        <div class="gallery-caption">图片2描述</div>
                    </div>
                </div>

                <div class="gallery-item">
                    <img src="image3.jpg" alt="图片3" class="gallery-image">
                    <div class="gallery-overlay">
                        <div class="gallery-caption">图片3描述</div>
                    </div>
                </div>

                <div class="gallery-item">
                    <img src="image4.jpg" alt="图片4" class="gallery-image">
                    <div class="gallery-overlay">
                        <div class="gallery-caption">图片4描述</div>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <footer>
        <p>&copy; 2024 图片 Gallery</p>
    </footer>
</body>
</html>
```

2. **CSS样式**
```css
body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    margin: 0;
    padding: 20px;
}

header {
    background-color: #4a90e2;
    color: white;
    padding: 20px;
    border-radius: 5px;
    margin-bottom: 20px;
}

header h1 {
    margin: 0;
}

main {
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
}

.gallery-item {
    position: relative;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.gallery-image {
    width: 100%;
    height: auto;
    display: block;
    transition: transform 0.3s ease;
}

.gallery-item:hover .gallery-image {
    transform: scale(1.05);
}

.gallery-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,0.7);
    color: white;
    padding: 15px;
    transform: translateY(100%);
    transition: transform 0.3s ease;
}

.gallery-item:hover .gallery-overlay {
    transform: translateY(0);
}

.gallery-caption {
    margin: 0;
    font-size: 1em;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .gallery-grid {
        grid-template-columns: 1fr;
    }
}
```

3. **JavaScript交互**
```javascript
document.addEventListener('DOMContentLoaded', () => {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const overlay = document.createElement('div');
    overlay.id = 'lightbox-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.9)';
    overlay.style.display = 'none';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '1000';
    document.body.appendChild(overlay);

    const lightboxImage = document.createElement('img');
    lightboxImage.id = 'lightbox-image';
    lightboxImage.style.maxWidth = '90%';
    lightboxImage.style.maxHeight = '90%';
    overlay.appendChild(lightboxImage);

    const closeBtn = document.createElement('button');
    closeBtn.id = 'close-lightbox';
    closeBtn.textContent = '×';
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '20px';
    closeBtn.style.right = '20px';
    closeBtn.style.background = 'none';
    closeBtn.style.border = 'none';
    closeBtn.style.color = 'white';
    closeBtn.style.fontSize = '2em';
    closeBtn.style.cursor = 'pointer';
    overlay.appendChild(closeBtn);

    galleryItems.forEach(item => {
        const image = item.querySelector('.gallery-image');

        image.addEventListener('click', () => {
            lightboxImage.src = image.src;
            overlay.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    });

    closeBtn.addEventListener('click', () => {
        overlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
});
```

## 实际应用场景总结

HTML基础是前端开发的基石，掌握这些知识后，你可以：

1. **创建结构良好的网页**：使用语义化标签构建清晰的页面结构
2. **实现交互功能**：通过JavaScript添加动态效果和用户交互
3. **设计响应式布局**：确保网站在各种设备上都能良好显示
4. **处理用户输入**：创建表单并验证用户输入
5. **展示数据**：使用列表和表格组织信息
6. **创建视觉效果**：通过CSS和JavaScript实现丰富的用户界面

通过实践这些应用场景，你将能够构建功能完整、用户体验良好的网页应用。