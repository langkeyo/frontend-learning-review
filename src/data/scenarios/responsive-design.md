# 响应式设计应用场景

## 移动优先网站设计

### 场景描述
创建一个响应式网站，在不同设备上都能良好显示，从移动设备开始设计，然后逐步增强到更大的屏幕。

### 实现步骤

1. **HTML结构**
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>响应式网站</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>响应式网站示例</h1>
        <button class="menu-toggle">菜单</button>
        <nav class="main-nav">
            <ul>
                <li><a href="#home">首页</a></li>
                <li><a href="#about">关于</a></li>
                <li><a href="#services">服务</a></li>
                <li><a href="#contact">联系</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <section id="home">
            <h2>欢迎来到我们的网站</h2>
            <p>这是一个响应式设计的示例网站，可以在各种设备上良好显示。</p>
        </section>

        <section id="about">
            <h2>关于我们</h2>
            <p>我们是一家专注于响应式设计的公司，致力于为用户提供最佳体验。</p>
        </section>

        <section id="services">
            <h2>我们的服务</h2>
            <div class="service-grid">
                <div class="service-card">
                    <h3>响应式设计</h3>
                    <p>创建在各种设备上都能良好显示的网站。</p>
                </div>
                <div class="service-card">
                    <h3>移动优化</h3>
                    <p>优化移动设备上的用户体验。</p>
                </div>
                <div class="service-card">
                    <h3>性能优化</h3>
                    <p>提高网站加载速度和性能。</p>
                </div>
            </div>
        </section>

        <section id="contact">
            <h2>联系我们</h2>
            <form id="contact-form">
                <div class="form-group">
                    <label for="name">姓名：</label>
                    <input type="text" id="name" name="name" required>
                </div>
                <div class="form-group">
                    <label for="email">邮箱：</label>
                    <input type="email" id="email" name="email" required>
                </div>
                <div class="form-group">
                    <label for="message">留言：</label>
                    <textarea id="message" name="message" rows="4" required></textarea>
                </div>
                <button type="submit">发送</button>
            </form>
        </section>
    </main>

    <footer>
        <p>&copy; 2024 响应式网站示例</p>
    </footer>
</body>
</html>
```

2. **CSS样式（移动优先）**
```css
/* 基础重置 */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Arial', sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f5f5f5;
    padding: 15px;
}

header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
    position: relative;
}

header h1 {
    margin: 0;
    font-size: 1.5rem;
}

.menu-toggle {
    display: block;
    background: none;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    position: absolute;
    top: 10px;
    right: 10px;
}

.main-nav {
    display: none;
    margin-top: 15px;
}

.main-nav ul {
    list-style: none;
}

.main-nav li {
    margin-bottom: 10px;
}

.main-nav a {
    color: white;
    text-decoration: none;
    padding: 8px 15px;
    display: block;
    border-radius: 4px;
}

.main-nav a:hover {
    background: rgba(255,255,255,0.2);
}

main {
    max-width: 1200px;
    margin: 0 auto;
}

section {
    background: white;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

section h2 {
    color: #4a5568;
    margin-bottom: 15px;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 10px;
}

.service-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 15px;
}

.service-card {
    background: #f8f9fa;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 15px;
    text-align: center;
}

.service-card h3 {
    color: #2d3748;
    margin-bottom: 10px;
}

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

button {
    background-color: #4a90e2;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    width: 100%;
}

button:hover {
    background-color: #357abd;
}

footer {
    text-align: center;
    margin-top: 30px;
    padding: 15px;
    background: #e2e8f0;
    border-radius: 8px;
    color: #4a5568;
}

/* 平板设备样式（768px以上） */
@media (min-width: 768px) {
    body {
        padding: 20px;
    }

    header {
        padding: 20px;
    }

    .menu-toggle {
        display: none;
    }

    .main-nav {
        display: block;
    }

    .main-nav ul {
        display: flex;
        gap: 20px;
    }

    .service-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

/* 桌面设备样式（1024px以上） */
@media (min-width: 1024px) {
    body {
        padding: 30px;
    }

    header {
        padding: 25px;
    }

    header h1 {
        font-size: 1.8rem;
    }

    .service-grid {
        grid-template-columns: repeat(3, 1fr);
    }

    section {
        padding: 25px;
    }
}
```

3. **JavaScript交互**
```javascript
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    menuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('active');
    });

    // 响应式图片处理
    function handleResponsiveImages() {
        const images = document.querySelectorAll('img');

        images.forEach(img => {
            // 检查图片是否已经有srcset属性
            if (!img.hasAttribute('srcset')) {
                // 为没有srcset的图片添加响应式属性
                const src = img.getAttribute('src');
                const width = img.naturalWidth || 300; // 默认宽度
                const height = img.naturalHeight || 200; // 默认高度

                // 创建不同分辨率的URL（这里使用占位符）
                const srcset = `${src} ${width}w, ${src}?w=2x ${width * 2}w`;
                img.setAttribute('srcset', srcset);

                // 添加sizes属性
                img.setAttribute('sizes', '(max-width: 600px) 100vw, 50vw');
            }
        });
    }

    // 检测设备类型
    function detectDeviceType() {
        const userAgent = navigator.userAgent;
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
        const isTablet = /Tablet|iPad/i.test(userAgent);

        return {
            isMobile,
            isTablet,
            isDesktop: !isMobile && !isTablet
        };
    }

    // 调整布局根据设备类型
    function adjustLayoutForDevice() {
        const device = detectDeviceType();
        const serviceGrid = document.querySelector('.service-grid');

        if (device.isMobile) {
            // 移动设备优化
            if (serviceGrid) {
                serviceGrid.style.gridTemplateColumns = '1fr';
            }
        } else if (device.isTablet) {
            // 平板优化
            if (serviceGrid) {
                serviceGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
            }
        } else {
            // 桌面优化
            if (serviceGrid) {
                serviceGrid.style.gridTemplateColumns = 'repeat(3, 1fr)';
            }
        }
    }

    // 初始化响应式功能
    handleResponsiveImages();
    adjustLayoutForDevice();

    // 监听窗口大小变化
    window.addEventListener('resize', () => {
        adjustLayoutForDevice();
    });

    // 检查浏览器支持
    if ('ResizeObserver' in window) {
        console.log('ResizeObserver 支持可用');
    }

    if ('IntersectionObserver' in window) {
        console.log('IntersectionObserver 支持可用');
    }
});
```

## 弹性布局应用

### 场景描述
使用Flexbox创建一个灵活的布局，能够适应不同屏幕尺寸。

### 实现步骤

1. **HTML结构**
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>弹性布局示例</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>弹性布局示例</h1>
    </header>

    <main>
        <section id="flex-container">
            <div class="flex-item">项目1</div>
            <div class="flex-item">项目2</div>
            <div class="flex-item">项目3</div>
            <div class="flex-item">项目4</div>
            <div class="flex-item">项目5</div>
        </section>

        <section id="flex-controls">
            <button id="justify-start">开始对齐</button>
            <button id="justify-center">居中对齐</button>
            <button id="justify-end">结束对齐</button>
            <button id="justify-space-between">两端对齐</button>
            <button id="justify-space-around">环绕对齐</button>
        </section>
    </main>

    <footer>
        <p>&copy; 2024 弹性布局示例</p>
    </footer>
</body>
</html>
```

2. **CSS样式**
```css
body {
    font-family: 'Arial', sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f5f5f5;
    padding: 20px;
}

header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
}

header h1 {
    margin: 0;
}

main {
    max-width: 1200px;
    margin: 0 auto;
}

section {
    background: white;
    border-radius: 8px;
    padding: 25px;
    margin-bottom: 20px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

#flex-container {
    display: flex;
    gap: 15px;
    margin-bottom: 20px;
    min-height: 200px;
    border: 2px dashed #ddd;
    padding: 15px;
}

.flex-item {
    background: #e2e8f0;
    border: 1px solid #cbd5e0;
    border-radius: 8px;
    padding: 20px;
    text-align: center;
    flex: 1;
    transition: all 0.3s ease;
}

.flex-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

#flex-controls {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

#flex-controls button {
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    background-color: #4a90e2;
    color: white;
    transition: background-color 0.3s;
}

#flex-controls button:hover {
    background-color: #357abd;
}

footer {
    text-align: center;
    margin-top: 30px;
    padding: 15px;
    background: #e2e8f0;
    border-radius: 8px;
    color: #4a5568;
}

/* 响应式设计 */
@media (max-width: 768px) {
    body {
        padding: 15px;
    }

    #flex-container {
        flex-direction: column;
    }

    .flex-item {
        margin-bottom: 10px;
    }

    #flex-controls {
        flex-direction: column;
    }
}
```

3. **JavaScript交互**
```javascript
document.addEventListener('DOMContentLoaded', () => {
    const flexContainer = document.getElementById('flex-container');
    const justifyStartBtn = document.getElementById('justify-start');
    const justifyCenterBtn = document.getElementById('justify-center');
    const justifyEndBtn = document.getElementById('justify-end');
    const justifySpaceBetweenBtn = document.getElementById('justify-space-between');
    const justifySpaceAroundBtn = document.getElementById('justify-space-around');

    justifyStartBtn.addEventListener('click', () => {
        flexContainer.style.justifyContent = 'flex-start';
    });

    justifyCenterBtn.addEventListener('click', () => {
        flexContainer.style.justifyContent = 'center';
    });

    justifyEndBtn.addEventListener('click', () => {
        flexContainer.style.justifyContent = 'flex-end';
    });

    justifySpaceBetweenBtn.addEventListener('click', () => {
        flexContainer.style.justifyContent = 'space-between';
    });

    justifySpaceAroundBtn.addEventListener('click', () => {
        flexContainer.style.justifyContent = 'space-around';
    });

    // 添加动态内容
    const addItem = () => {
        const newItem = document.createElement('div');
        newItem.className = 'flex-item';
        newItem.textContent = `项目${flexContainer.children.length + 1}`;
        flexContainer.appendChild(newItem);
    };

    // 初始化时添加一些项目
    for (let i = 0; i < 5; i++) {
        addItem();
    }

    // 监听窗口大小变化
    window.addEventListener('resize', () => {
        const width = window.innerWidth;
        if (width < 768) {
            flexContainer.style.flexDirection = 'column';
        } else {
            flexContainer.style.flexDirection = 'row';
        }
    });
});
```

## Grid布局应用

### 场景描述
使用CSS Grid创建一个复杂的网格布局，展示产品或内容。

### 实现步骤

1. **HTML结构**
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Grid布局示例</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>Grid布局示例</h1>
    </header>

    <main>
        <section id="grid-container">
            <div class="grid-item">项目1</div>
            <div class="grid-item">项目2</div>
            <div class="grid-item">项目3</div>
            <div class="grid-item">项目4</div>
            <div class="grid-item">项目5</div>
            <div class="grid-item">项目6</div>
            <div class="grid-item">项目7</div>
            <div class="grid-item">项目8</div>
            <div class="grid-item">项目9</div>
        </section>

        <section id="grid-controls">
            <button id="grid-auto">自动布局</button>
            <button id="grid-fixed">固定列</button>
            <button id="grid-responsive">响应式布局</button>
        </section>
    </main>

    <footer>
        <p>&copy; 2024 Grid布局示例</p>
    </footer>
</body>
</html>
```

2. **CSS样式**
```css
body {
    font-family: 'Arial', sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f5f5f5;
    padding: 20px;
}

header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
}

header h1 {
    margin: 0;
}

main {
    max-width: 1200px;
    margin: 0 auto;
}

section {
    background: white;
    border-radius: 8px;
    padding: 25px;
    margin-bottom: 20px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

#grid-container {
    display: grid;
    gap: 15px;
    margin-bottom: 20px;
    min-height: 300px;
    border: 2px dashed #ddd;
    padding: 15px;
}

.grid-item {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 8px;
    padding: 20px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2em;
    transition: all 0.3s ease;
}

.grid-item:hover {
    transform: scale(1.05);
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

#grid-controls {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

#grid-controls button {
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    background-color: #4a90e2;
    color: white;
    transition: background-color 0.3s;
}

#grid-controls button:hover {
    background-color: #357abd;
}

footer {
    text-align: center;
    margin-top: 30px;
    padding: 15px;
    background: #e2e8f0;
    border-radius: 8px;
    color: #4a5568;
}

/* 自动布局 */
#grid-auto .grid-item {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}

/* 固定列布局 */
#grid-fixed .grid-item {
    grid-template-columns: repeat(3, 1fr);
}

/* 响应式布局 */
#grid-responsive .grid-item {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

/* 响应式设计 */
@media (max-width: 768px) {
    body {
        padding: 15px;
    }

    #grid-container {
        grid-template-columns: 1fr;
    }

    #grid-controls {
        flex-direction: column;
    }
}
```

3. **JavaScript交互**
```javascript
document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('grid-container');
    const autoBtn = document.getElementById('grid-auto');
    const fixedBtn = document.getElementById('grid-fixed');
    const responsiveBtn = document.getElementById('grid-responsive');

    autoBtn.addEventListener('click', () => {
        gridContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))';
    });

    fixedBtn.addEventListener('click', () => {
        gridContainer.style.gridTemplateColumns = 'repeat(3, 1fr)';
    });

    responsiveBtn.addEventListener('click', () => {
        gridContainer.style.gridTemplateColumns = 'repeat(auto-fit, minmax(250px, 1fr))';
    });

    // 添加动态内容
    const addItem = () => {
        const newItem = document.createElement('div');
        newItem.className = 'grid-item';
        newItem.textContent = `项目${gridContainer.children.length + 1}`;
        gridContainer.appendChild(newItem);
    };

    // 初始化时添加一些项目
    for (let i = 0; i < 9; i++) {
        addItem();
    }

    // 监听窗口大小变化
    window.addEventListener('resize', () => {
        const width = window.innerWidth;
        if (width < 768) {
            gridContainer.style.gridTemplateColumns = '1fr';
        } else {
            // 恢复当前布局
            const currentStyle = gridContainer.style.gridTemplateColumns;
            if (currentStyle.includes('auto-fill') || currentStyle.includes('auto-fit')) {
                // 保持响应式布局
            } else if (currentStyle.includes('repeat(3, 1fr)')) {
                // 保持固定列布局
            }
        }
    });
});
```

## 媒体查询应用

### 场景描述
使用媒体查询创建一个根据屏幕尺寸变化而调整的网站。

### 实现步骤

1. **HTML结构**
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>媒体查询示例</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>媒体查询示例</h1>
    </header>

    <main>
        <section id="media-demo">
            <div class="media-box small">小屏幕</div>
            <div class="media-box medium">中屏幕</div>
            <div class="media-box large">大屏幕</div>
        </section>

        <section id="media-info">
            <h2>当前屏幕信息</h2>
            <div id="screen-width">宽度: <span>0</span>px</div>
            <div id="screen-height">高度: <span>0</span>px</div>
            <div id="device-type">设备类型: <span>未知</span></div>
        </section>
    </main>

    <footer>
        <p>&copy; 2024 媒体查询示例</p>
    </footer>
</body>
</html>
```

2. **CSS样式**
```css
body {
    font-family: 'Arial', sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f5f5f5;
    padding: 20px;
}

header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
}

header h1 {
    margin: 0;
}

main {
    max-width: 1200px;
    margin: 0 auto;
}

section {
    background: white;
    border-radius: 8px;
    padding: 25px;
    margin-bottom: 20px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

#media-demo {
    display: flex;
    gap: 15px;
    margin-bottom: 20px;
}

.media-box {
    flex: 1;
    padding: 20px;
    text-align: center;
    border-radius: 8px;
    color: white;
    font-weight: bold;
}

.small {
    background-color: #e74c3c;
}

.medium {
    background-color: #f39c12;
}

.large {
    background-color: #27ae60;
}

#media-info {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
}

#media-info div {
    background: #f8f9fa;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 15px;
    text-align: center;
}

#media-info span {
    font-weight: bold;
    color: #4a90e2;
}

footer {
    text-align: center;
    margin-top: 30px;
    padding: 15px;
    background: #e2e8f0;
    border-radius: 8px;
    color: #4a5568;
}

/* 小屏幕（0-767px） */
@media (max-width: 767px) {
    body {
        padding: 10px;
    }

    header {
        padding: 15px;
    }

    header h1 {
        font-size: 1.3rem;
    }

    #media-demo {
        flex-direction: column;
    }

    .media-box {
        margin-bottom: 10px;
    }

    #media-info {
        grid-template-columns: 1fr;
    }
}

/* 中屏幕（768-1023px） */
@media (min-width: 768px) and (max-width: 1023px) {
    body {
        padding: 15px;
    }

    header {
        padding: 20px;
    }

    header h1 {
        font-size: 1.5rem;
    }

    .media-box {
        padding: 25px;
    }
}

/* 大屏幕（1024px以上） */
@media (min-width: 1024px) {
    body {
        padding: 30px;
    }

    header {
        padding: 25px;
    }

    header h1 {
        font-size: 1.8rem;
    }

    .media-box {
        padding: 30px;
        font-size: 1.2em;
    }

    #media-info {
        grid-template-columns: repeat(3, 1fr);
    }
}
```

3. **JavaScript交互**
```javascript
document.addEventListener('DOMContentLoaded', () => {
    const screenWidth = document.querySelector('#screen-width span');
    const screenHeight = document.querySelector('#screen-height span');
    const deviceType = document.querySelector('#device-type span');

    // 更新屏幕信息
    function updateScreenInfo() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        screenWidth.textContent = width;
        screenHeight.textContent = height;

        // 检测设备类型
        if (width < 768) {
            deviceType.textContent = '手机';
        } else if (width < 1024) {
            deviceType.textContent = '平板';
        } else {
            deviceType.textContent = '桌面';
        }
    }

    // 初始化屏幕信息
    updateScreenInfo();

    // 监听窗口大小变化
    window.addEventListener('resize', updateScreenInfo);

    // 检测设备方向
    function detectOrientation() {
        if (window.matchMedia("(orientation: portrait)").matches) {
            console.log('竖屏模式');
        } else {
            console.log('横屏模式');
        }
    }

    // 初始化方向检测
    detectOrientation();

    // 监听方向变化
    window.matchMedia("(orientation: portrait)").addEventListener('change', detectOrientation);
    window.matchMedia("(orientation: landscape)").addEventListener('change', detectOrientation);

    // 检查浏览器支持
    if ('MediaQueryList' in window) {
        console.log('MediaQueryList 支持可用');
    }
});
```

## 响应式图片应用

### 场景描述
创建一个响应式图片展示页面，使用不同的图片源适应不同的屏幕尺寸。

### 实现步骤

1. **HTML结构**
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>响应式图片示例</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>响应式图片示例</h1>
    </header>

    <main>
        <section id="image-gallery">
            <h2>响应式图片展示</h2>

            <div class="image-container">
                <img
                    src="small.jpg"
                    srcset="small.jpg 480w, medium.jpg 800w, large.jpg 1200w"
                    sizes="(max-width: 600px) 480px, (max-width: 1000px) 800px, 1200px"
                    alt="响应式图片">
            </div>

            <div class="image-info">
                <p>当前使用的图片: <span id="current-image">small.jpg</span></p>
                <p>图片宽度: <span id="image-width">0</span>px</p>
                <p>图片高度: <span id="image-height">0</span>px</p>
            </div>
        </section>
    </main>

    <footer>
        <p>&copy; 2024 响应式图片示例</p>
    </footer>
</body>
</html>
```

2. **CSS样式**
```css
body {
    font-family: 'Arial', sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f5f5f5;
    padding: 20px;
}

header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
}

header h1 {
    margin: 0;
}

main {
    max-width: 1200px;
    margin: 0 auto;
}

section {
    background: white;
    border-radius: 8px;
    padding: 25px;
    margin-bottom: 20px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.image-container {
    margin-bottom: 20px;
    text-align: center;
}

.image-container img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.image-info {
    background: #f8f9fa;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 15px;
    text-align: center;
}

.image-info p {
    margin: 10px 0;
}

.image-info span {
    font-weight: bold;
    color: #4a90e2;
}

footer {
    text-align: center;
    margin-top: 30px;
    padding: 15px;
    background: #e2e8f0;
    border-radius: 8px;
    color: #4a5568;
}

/* 响应式设计 */
@media (max-width: 768px) {
    body {
        padding: 15px;
    }

    header {
        padding: 15px;
    }

    header h1 {
        font-size: 1.3rem;
    }

    section {
        padding: 20px;
    }
}
```

3. **JavaScript交互**
```javascript
document.addEventListener('DOMContentLoaded', () => {
    const currentImage = document.getElementById('current-image');
    const imageWidth = document.getElementById('image-width');
    const imageHeight = document.getElementById('image-height');
    const image = document.querySelector('.image-container img');

    // 获取当前使用的图片
    function getCurrentImage() {
        const srcset = image.getAttribute('srcset');
        const sizes = image.getAttribute('sizes');

        // 简单的解析逻辑（实际应用中可能需要更复杂的解析）
        const currentSize = window.innerWidth;

        if (currentSize <= 600) {
            currentImage.textContent = 'small.jpg';
        } else if (currentSize <= 1000) {
            currentImage.textContent = 'medium.jpg';
        } else {
            currentImage.textContent = 'large.jpg';
        }
    }

    // 获取图片实际尺寸
    function getImageDimensions() {
        if (image.complete) {
            imageWidth.textContent = image.naturalWidth;
            imageHeight.textContent = image.naturalHeight;
        } else {
            image.addEventListener('load', () => {
                imageWidth.textContent = image.naturalWidth;
                imageHeight.textContent = image.naturalHeight;
            });
        }
    }

    // 初始化
    getCurrentImage();
    getImageDimensions();

    // 监听窗口大小变化
    window.addEventListener('resize', () => {
        getCurrentImage();
    });

    // 检查浏览器支持
    if ('HTMLPictureElement' in window) {
        console.log('picture元素支持可用');
    }

    if ('srcset' in HTMLImageElement.prototype) {
        console.log('srcset属性支持可用');
    }
});
```

## 响应式设计最佳实践总结

响应式设计是现代前端开发的重要技能，通过以上应用场景，你可以：

1. **采用移动优先策略**：先为移动设备设计，然后逐步增强
2. **使用弹性布局**：Flexbox和Grid提供灵活的布局选项
3. **媒体查询**：根据屏幕尺寸调整样式
4. **响应式图片**：优化图片加载，提高性能
5. **测试和优化**：确保在各种设备上都能良好显示

掌握这些技术后，你将能够创建在各种设备上都能提供优秀用户体验的网站。