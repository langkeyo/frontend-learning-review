# JavaScript函数应用场景

## 函数在数据处理中的应用

### 场景描述
创建一个数据过滤和排序应用，使用函数处理数组数据。

### 实现步骤

1. **HTML结构**
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>数据过滤器</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>数据过滤器</h1>
    </header>

    <main>
        <div class="controls">
            <div class="filter-group">
                <label for="search">搜索:</label>
                <input type="text" id="search" placeholder="输入关键词...">
            </div>

            <div class="filter-group">
                <label for="category">分类:</label>
                <select id="category">
                    <option value="all">全部</option>
                    <option value="frontend">前端</option>
                    <option value="backend">后端</option>
                    <option value="database">数据库</option>
                </select>
            </div>

            <div class="filter-group">
                <label for="sort">排序:</label>
                <select id="sort">
                    <option value="name">按名称</option>
                    <option value="price">按价格</option>
                    <option value="rating">按评分</option>
                </select>
            </div>
        </div>

        <div id="data-container">
            <!-- 数据将在这里动态显示 -->
        </div>

        <div class="stats">
            <p>总项目数: <span id="total-items">0</span></p>
            <p>显示项目数: <span id="visible-items">0</span></p>
        </div>
    </main>

    <footer>
        <p>&copy; 2024 数据过滤器</p>
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
    max-width: 800px;
    margin: 0 auto;
}

.controls {
    background: white;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    align-items: center;
}

.filter-group {
    display: flex;
    align-items: center;
    gap: 10px;
}

.filter-group label {
    font-weight: bold;
}

.filter-group input,
.filter-group select {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

#data-container {
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    min-height: 300px;
}

.data-item {
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 15px;
    background: #f8f9fa;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.data-item h3 {
    margin: 0;
    color: #2d3748;
}

.data-item .item-details {
    display: flex;
    gap: 20px;
}

.data-item .item-details span {
    display: block;
}

.data-item .item-details .price {
    color: #e74c3c;
    font-weight: bold;
}

.data-item .item-details .rating {
    color: #f39c12;
}

.stats {
    background: #f8f9fa;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 15px;
    margin-top: 20px;
    display: flex;
    justify-content: space-around;
}

.stats p {
    margin: 0;
    font-weight: bold;
}

footer {
    text-align: center;
    margin-top: 30px;
    padding: 15px;
    background: #e2e8f0;
    border-radius: 8px;
    color: #4a5568;
}
```

3. **JavaScript交互**
```javascript
document.addEventListener('DOMContentLoaded', () => {
    // 示例数据
    const rawData = [
        { id: 1, name: 'JavaScript高级编程', category: 'frontend', price: 89.99, rating: 4.5 },
        { id: 2, name: 'Node.js实战', category: 'backend', price: 79.99, rating: 4.2 },
        { id: 3, name: 'MongoDB指南', category: 'database', price: 69.99, rating: 4.0 },
        { id: 4, name: 'React开发', category: 'frontend', price: 99.99, rating: 4.8 },
        { id: 5, name: 'Python数据分析', category: 'backend', price: 74.99, rating: 4.3 },
        { id: 6, name: 'MySQL优化', category: 'database', price: 64.99, rating: 3.9 },
        { id: 7, name: 'Vue.js入门', category: 'frontend', price: 59.99, rating: 4.1 },
        { id: 8, name: 'Django框架', category: 'backend', price: 84.99, rating: 4.4 },
        { id: 9, name: 'Redis实战', category: 'database', price: 54.99, rating: 4.2 },
        { id: 10, name: 'TypeScript教程', category: 'frontend', price: 69.99, rating: 4.6 }
    ];

    // DOM元素
    const searchInput = document.getElementById('search');
    const categorySelect = document.getElementById('category');
    const sortSelect = document.getElementById('sort');
    const dataContainer = document.getElementById('data-container');
    const totalItemsSpan = document.getElementById('total-items');
    const visibleItemsSpan = document.getElementById('visible-items');

    // 当前显示的数据
    let currentData = [...rawData];

    // 渲染数据
    function renderData(data) {
        dataContainer.innerHTML = '';

        data.forEach(item => {
            const dataItem = document.createElement('div');
            dataItem.className = 'data-item';
            dataItem.innerHTML = `
                <h3>${item.name}</h3>
                <div class="item-details">
                    <span>分类: ${item.category}</span>
                    <span class="price">¥${item.price}</span>
                    <span class="rating">⭐ ${item.rating}</span>
                </div>
            `;
            dataContainer.appendChild(dataItem);
        });

        // 更新统计
        totalItemsSpan.textContent = rawData.length;
        visibleItemsSpan.textContent = data.length;
    }

    // 过滤函数
    function filterData() {
        const searchTerm = searchInput.value.toLowerCase();
        const category = categorySelect.value;
        const sortOption = sortSelect.value;

        // 过滤数据
        let filteredData = rawData.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm);
            const matchesCategory = category === 'all' || item.category === category;
            return matchesSearch && matchesCategory;
        });

        // 排序数据
        filteredData = sortData(filteredData, sortOption);

        // 更新当前数据
        currentData = filteredData;

        // 渲染数据
        renderData(filteredData);
    }

    // 排序函数
    function sortData(data, option) {
        const sortedData = [...data];

        switch (option) {
            case 'name':
                sortedData.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'price':
                sortedData.sort((a, b) => a.price - b.price);
                break;
            case 'rating':
                sortedData.sort((a, b) => b.rating - a.rating);
                break;
            default:
                break;
        }

        return sortedData;
    }

    // 事件监听器
    searchInput.addEventListener('input', filterData);
    categorySelect.addEventListener('change', filterData);
    sortSelect.addEventListener('change', filterData);

    // 初始化渲染
    renderData(rawData);
});
```

## 函数在动画效果中的应用

### 场景描述
创建一个带有动画效果的图片画廊，使用函数实现平滑的过渡效果。

### 实现步骤

1. **HTML结构**
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>动画图片画廊</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>动画图片画廊</h1>
    </header>

    <main>
        <div class="gallery">
            <div class="gallery-item">
                <img src="image1.jpg" alt="图片1">
                <div class="gallery-overlay">
                    <h3>图片1标题</h3>
                    <p>图片1描述</p>
                </div>
            </div>

            <div class="gallery-item">
                <img src="image2.jpg" alt="图片2">
                <div class="gallery-overlay">
                    <h3>图片2标题</h3>
                    <p>图片2描述</p>
                </div>
            </div>

            <div class="gallery-item">
                <img src="image3.jpg" alt="图片3">
                <div class="gallery-overlay">
                    <h3>图片3标题</h3>
                    <p>图片3描述</p>
                </div>
            </div>

            <div class="gallery-item">
                <img src="image4.jpg" alt="图片4">
                <div class="gallery-overlay">
                    <h3>图片4标题</h3>
                    <p>图片4描述</p>
                </div>
            </div>

            <div class="gallery-item">
                <img src="image5.jpg" alt="图片5">
                <div class="gallery-overlay">
                    <h3>图片5标题</h3>
                    <p>图片5描述</p>
                </div>
            </div>
        </div>

        <div class="controls">
            <button id="prev-btn">上一张</button>
            <button id="next-btn">下一张</button>
            <button id="random-btn">随机</button>
            <button id="shuffle-btn">洗牌</button>
        </div>
    </main>

    <footer>
        <p>&copy; 2024 动画图片画廊</p>
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

.gallery {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 20px;
}

.gallery-item {
    position: relative;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    transition: transform 0.3s ease;
}

.gallery-item:hover {
    transform: translateY(-5px);
}

.gallery-item img {
    width: 100%;
    height: auto;
    display: block;
}

.gallery-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,0.7);
    color: white;
    padding: 20px;
    transform: translateY(100%);
    transition: transform 0.3s ease;
}

.gallery-item:hover .gallery-overlay {
    transform: translateY(0);
}

.gallery-overlay h3 {
    margin: 0 0 10px;
    font-size: 1.2em;
}

.gallery-overlay p {
    margin: 0;
    font-size: 0.9em;
}

.controls {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-top: 20px;
}

.controls button {
    padding: 10px 20px;
    background-color: #4a90e2;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.controls button:hover {
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
```

3. **JavaScript交互**
```javascript
document.addEventListener('DOMContentLoaded', () => {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const randomBtn = document.getElementById('random-btn');
    const shuffleBtn = document.getElementById('shuffle-btn');

    let currentIndex = 0;

    // 显示指定索引的图片
    function showItem(index) {
        galleryItems.forEach((item, i) => {
            item.style.display = i === index ? 'block' : 'none';
        });
    }

    // 下一张
    function nextItem() {
        currentIndex = (currentIndex + 1) % galleryItems.length;
        showItem(currentIndex);
    }

    // 上一张
    function prevItem() {
        currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
        showItem(currentIndex);
    }

    // 随机显示
    function randomItem() {
        currentIndex = Math.floor(Math.random() * galleryItems.length);
        showItem(currentIndex);
    }

    // 洗牌显示
    function shuffleItems() {
        const items = Array.from(galleryItems);
        for (let i = items.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [items[i], items[j]] = [items[j], items[i]];
        }

        galleryItems.forEach((item, index) => {
            if (items[index]) {
                item.style.order = index;
            }
        });
    }

    // 事件监听器
    prevBtn.addEventListener('click', prevItem);
    nextBtn.addEventListener('click', nextItem);
    randomBtn.addEventListener('click', randomItem);
    shuffleBtn.addEventListener('click', shuffleItems);

    // 初始化显示
    showItem(currentIndex);

    // 添加键盘导航
    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'ArrowLeft':
                prevItem();
                break;
            case 'ArrowRight':
                nextItem();
                break;
            case 'r':
            case 'R':
                randomItem();
                break;
        }
    });
});
```

## 函数在表单验证中的应用

### 场景描述
创建一个复杂的注册表单，使用函数进行多层次的表单验证。

### 实现步骤

1. **HTML结构**
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>复杂表单验证</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>复杂表单验证</h1>
    </header>

    <main>
        <form id="registration-form">
            <div class="form-section">
                <h2>基本信息</h2>

                <div class="form-group">
                    <label for="username">用户名：</label>
                    <input type="text" id="username" name="username" required>
                    <span class="error" id="username-error"></span>
                </div>

                <div class="form-group">
                    <label for="email">邮箱：</label>
                    <input type="email" id="email" name="email" required>
                    <span class="error" id="email-error"></span>
                </div>

                <div class="form-group">
                    <label for="password">密码：</label>
                    <input type="password" id="password" name="password" required>
                    <span class="error" id="password-error"></span>
                </div>

                <div class="form-group">
                    <label for="confirm-password">确认密码：</label>
                    <input type="password" id="confirm-password" name="confirm-password" required>
                    <span class="error" id="confirm-password-error"></span>
                </div>
            </div>

            <div class="form-section">
                <h2>个人信息</h2>

                <div class="form-group">
                    <label for="fullname">全名：</label>
                    <input type="text" id="fullname" name="fullname" required>
                    <span class="error" id="fullname-error"></span>
                </div>

                <div class="form-group">
                    <label for="birthdate">出生日期：</label>
                    <input type="date" id="birthdate" name="birthdate" required>
                    <span class="error" id="birthdate-error"></span>
                </div>

                <div class="form-group">
                    <label for="phone">电话：</label>
                    <input type="tel" id="phone" name="phone" pattern="[0-9]{11}" required>
                    <span class="error" id="phone-error"></span>
                </div>
            </div>

            <div class="form-section">
                <h2>地址信息</h2>

                <div class="form-group">
                    <label for="address">地址：</label>
                    <input type="text" id="address" name="address" required>
                    <span class="error" id="address-error"></span>
                </div>

                <div class="form-group">
                    <label for="city">城市：</label>
                    <input type="text" id="city" name="city" required>
                    <span class="error" id="city-error"></span>
                </div>

                <div class="form-group">
                    <label for="zipcode">邮编：</label>
                    <input type="text" id="zipcode" name="zipcode" pattern="[0-9]{6}" required>
                    <span class="error" id="zipcode-error"></span>
                </div>
            </div>

            <button type="submit">注册</button>
        </form>

        <div id="form-result"></div>
    </main>

    <footer>
        <p>&copy; 2024 复杂表单验证</p>
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
    max-width: 800px;
    margin: 0 auto;
}

form {
    background: white;
    border-radius: 8px;
    padding: 25px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.form-section {
    margin-bottom: 25px;
    padding-bottom: 20px;
    border-bottom: 1px solid #e2e8f0;
}

.form-section:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
}

.form-section h2 {
    color: #4a5568;
    margin-bottom: 15px;
}

.form-group {
    margin-bottom: 15px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

.form-group input {
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
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1.1em;
}

button:hover {
    background-color: #357abd;
}

#form-result {
    margin-top: 20px;
    padding: 15px;
    border-radius: 8px;
    text-align: center;
    display: none;
}

.success {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
}

.error-message {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
}

footer {
    text-align: center;
    margin-top: 30px;
    padding: 15px;
    background: #e2e8f0;
    border-radius: 8px;
    color: #4a5568;
}
```

3. **JavaScript交互**
```javascript
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registration-form');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const fullnameInput = document.getElementById('fullname');
    const birthdateInput = document.getElementById('birthdate');
    const phoneInput = document.getElementById('phone');
    const addressInput = document.getElementById('address');
    const cityInput = document.getElementById('city');
    const zipcodeInput = document.getElementById('zipcode');
    const resultDiv = document.getElementById('form-result');

    // 错误元素
    const usernameError = document.getElementById('username-error');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    const confirmPasswordError = document.getElementById('confirm-password-error');
    const fullnameError = document.getElementById('fullname-error');
    const birthdateError = document.getElementById('birthdate-error');
    const phoneError = document.getElementById('phone-error');
    const addressError = document.getElementById('address-error');
    const cityError = document.getElementById('city-error');
    const zipcodeError = document.getElementById('zipcode-error');

    // 验证函数
    function validateUsername() {
        const value = usernameInput.value.trim();
        if (value.length < 3) {
            usernameError.textContent = '用户名至少需要3个字符';
            usernameError.style.display = 'block';
            return false;
        } else if (value.length > 20) {
            usernameError.textContent = '用户名不能超过20个字符';
            usernameError.style.display = 'block';
            return false;
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            usernameError.textContent = '用户名只能包含字母、数字和下划线';
            usernameError.style.display = 'block';
            return false;
        } else {
            usernameError.style.display = 'none';
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

    function validatePassword() {
        const value = passwordInput.value;
        if (value.length < 8) {
            passwordError.textContent = '密码至少需要8个字符';
            passwordError.style.display = 'block';
            return false;
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(value)) {
            passwordError.textContent = '密码需要包含大小写字母、数字和特殊字符';
            passwordError.style.display = 'block';
            return false;
        } else {
            passwordError.style.display = 'none';
            return true;
        }
    }

    function validateConfirmPassword() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (confirmPassword !== password) {
            confirmPasswordError.textContent = '密码不匹配';
            confirmPasswordError.style.display = 'block';
            return false;
        } else {
            confirmPasswordError.style.display = 'none';
            return true;
        }
    }

    function validateFullname() {
        const value = fullnameInput.value.trim();
        if (value.length < 2) {
            fullnameError.textContent = '全名至少需要2个字符';
            fullnameError.style.display = 'block';
            return false;
        } else if (value.length > 50) {
            fullnameError.textContent = '全名不能超过50个字符';
            fullnameError.style.display = 'block';
            return false;
        } else {
            fullnameError.style.display = 'none';
            return true;
        }
    }

    function validateBirthdate() {
        const value = birthdateInput.value;
        if (!value) {
            birthdateError.textContent = '请选择出生日期';
            birthdateError.style.display = 'block';
            return false;
        }

        const birthDate = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (age < 18) {
            birthdateError.textContent = '您必须年满18岁';
            birthdateError.style.display = 'block';
            return false;
        } else {
            birthdateError.style.display = 'none';
            return true;
        }
    }

    function validatePhone() {
        const value = phoneInput.value.trim();
        const phoneRegex = /^[0-9]{11}$/;

        if (!phoneRegex.test(value)) {
            phoneError.textContent = '请输入11位数字的电话号码';
            phoneError.style.display = 'block';
            return false;
        } else {
            phoneError.style.display = 'none';
            return true;
        }
    }

    function validateAddress() {
        const value = addressInput.value.trim();
        if (value.length < 5) {
            addressError.textContent = '地址至少需要5个字符';
            addressError.style.display = 'block';
            return false;
        } else {
            addressError.style.display = 'none';
            return true;
        }
    }

    function validateCity() {
        const value = cityInput.value.trim();
        if (value.length < 2) {
            cityError.textContent = '城市名称至少需要2个字符';
            cityError.style.display = 'block';
            return false;
        } else {
            cityError.style.display = 'none';
            return true;
        }
    }

    function validateZipcode() {
        const value = zipcodeInput.value.trim();
        const zipcodeRegex = /^[0-9]{6}$/;

        if (!zipcodeRegex.test(value)) {
            zipcodeError.textContent = '请输入6位数字的邮编';
            zipcodeError.style.display = 'block';
            return false;
        } else {
            zipcodeError.style.display = 'none';
            return true;
        }
    }

    // 实时验证
    usernameInput.addEventListener('input', validateUsername);
    emailInput.addEventListener('input', validateEmail);
    passwordInput.addEventListener('input', validatePassword);
    confirmPasswordInput.addEventListener('input', validateConfirmPassword);
    fullnameInput.addEventListener('input', validateFullname);
    birthdateInput.addEventListener('change', validateBirthdate);
    phoneInput.addEventListener('input', validatePhone);
    addressInput.addEventListener('input', validateAddress);
    cityInput.addEventListener('input', validateCity);
    zipcodeInput.addEventListener('input', validateZipcode);

    // 表单提交
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const isUsernameValid = validateUsername();
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        const isConfirmPasswordValid = validateConfirmPassword();
        const isFullnameValid = validateFullname();
        const isBirthdateValid = validateBirthdate();
        const isPhoneValid = validatePhone();
        const isAddressValid = validateAddress();
        const isCityValid = validateCity();
        const isZipcodeValid = validateZipcode();

        if (isUsernameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid &&
            isFullnameValid && isBirthdateValid && isPhoneValid && isAddressValid &&
            isCityValid && isZipcodeValid) {
            // 表单提交逻辑
            const userData = {
                username: usernameInput.value.trim(),
                email: emailInput.value.trim(),
                password: passwordInput.value,
                fullname: fullnameInput.value.trim(),
                birthdate: birthdateInput.value,
                phone: phoneInput.value.trim(),
                address: addressInput.value.trim(),
                city: cityInput.value.trim(),
                zipcode: zipcodeInput.value.trim()
            };

            console.log('注册数据:', userData);

            // 显示成功消息
            resultDiv.textContent = '注册成功！欢迎加入我们的平台。';
            resultDiv.className = 'success';
            resultDiv.style.display = 'block';

            // 重置表单
            form.reset();
        } else {
            // 显示错误消息
            resultDiv.textContent = '请修正表单中的错误后再提交。';
            resultDiv.className = 'error-message';
            resultDiv.style.display = 'block';
        }
    });
});
```

## 函数在API调用中的应用

### 场景描述
创建一个天气应用，使用函数调用外部API并处理返回的数据。

### 实现步骤

1. **HTML结构**
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>天气应用</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>天气应用</h1>
    </header>

    <main>
        <div class="search-container">
            <input type="text" id="city-input" placeholder="输入城市名称...">
            <button id="search-btn">搜索</button>
        </div>

        <div id="weather-result">
            <!-- 天气数据将在这里显示 -->
        </div>
    </main>

    <footer>
        <p>&copy; 2024 天气应用</p>
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
    max-width: 600px;
    margin: 0 auto;
}

.search-container {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

.search-container input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.search-container button {
    padding: 10px 20px;
    background-color: #4a90e2;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.search-container button:hover {
    background-color: #357abd;
}

#weather-result {
    background: white;
    border-radius: 8px;
    padding: 25px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    min-height: 200px;
    text-align: center;
}

.weather-card {
    background: #f8f9fa;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
}

.weather-card h2 {
    margin: 0 0 15px;
    color: #2d3748;
}

.weather-info {
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;
}

.weather-info div {
    text-align: center;
}

.weather-info .temperature {
    font-size: 2.5em;
    font-weight: bold;
    color: #e74c3c;
}

.weather-info .condition {
    font-size: 1.2em;
    color: #4a5568;
}

.weather-info .details {
    font-size: 0.9em;
    color: #718096;
}

.weather-forecast {
    display: flex;
    justify-content: space-between;
    gap: 10px;
}

.forecast-item {
    flex: 1;
    background: #edf2f7;
    border: 1px solid #cbd5e0;
    border-radius: 8px;
    padding: 10px;
    text-align: center;
}

.forecast-item .date {
    font-weight: bold;
    margin-bottom: 5px;
}

.forecast-item .temp {
    color: #e74c3c;
    font-size: 1.2em;
}

.forecast-item .condition {
    font-size: 0.9em;
    color: #4a5568;
}

.loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
    color: #718096;
}

.error {
    color: #e74c3c;
    padding: 20px;
    background: #fdf2f2;
    border: 1px solid #feb2b2;
    border-radius: 8px;
    margin-top: 20px;
}

footer {
    text-align: center;
    margin-top: 30px;
    padding: 15px;
    background: #e2e8f0;
    border-radius: 8px;
    color: #4a5568;
}
```

3. **JavaScript交互**
```javascript
document.addEventListener('DOMContentLoaded', () => {
    const cityInput = document.getElementById('city-input');
    const searchBtn = document.getElementById('search-btn');
    const weatherResult = document.getElementById('weather-result');

    // 模拟API调用
    async function fetchWeather(city) {
        // 模拟API延迟
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 模拟天气数据
        const weatherData = {
            city: city,
            temperature: Math.floor(Math.random() * 30) + 10,
            condition: ['晴朗', '多云', '小雨', '大雨', '雪'][Math.floor(Math.random() * 5)],
            humidity: Math.floor(Math.random() * 50) + 30,
            windSpeed: Math.floor(Math.random() * 20) + 5,
            forecast: [
                { date: '明天', temp: Math.floor(Math.random() * 30) + 10, condition: '晴朗' },
                { date: '后天', temp: Math.floor(Math.random() * 30) + 10, condition: '多云' },
                { date: '大后天', temp: Math.floor(Math.random() * 30) + 10, condition: '小雨' }
            ]
        };

        return weatherData;
    }

    // 显示加载状态
    function showLoading() {
        weatherResult.innerHTML = '<div class="loading">加载中...</div>';
    }

    // 显示错误状态
    function showError(message) {
        weatherResult.innerHTML = `<div class="error">${message}</div>`;
    }

    // 显示天气数据
    function showWeather(data) {
        weatherResult.innerHTML = `
            <div class="weather-card">
                <h2>${data.city} - 当前天气</h2>
                <div class="weather-info">
                    <div class="temperature">${data.temperature}°C</div>
                    <div class="condition">${data.condition}</div>
                    <div class="details">
                        <p>湿度: ${data.humidity}%</p>
                        <p>风速: ${data.windSpeed} km/h</p>
                    </div>
                </div>
                <h3>未来天气预报</h3>
                <div class="weather-forecast">
                    ${data.forecast.map(day => `
                        <div class="forecast-item">
                            <div class="date">${day.date}</div>
                            <div class="temp">${day.temp}°C</div>
                            <div class="condition">${day.condition}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // 搜索天气
    async function searchWeather() {
        const city = cityInput.value.trim();

        if (city === '') {
            showError('请输入城市名称');
            return;
        }

        try {
            showLoading();
            const weatherData = await fetchWeather(city);
            showWeather(weatherData);
        } catch (error) {
            showError('获取天气数据失败，请稍后再试');
            console.error('天气API错误:', error);
        }
    }

    // 事件监听器
    searchBtn.addEventListener('click', searchWeather);
    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchWeather();
        }
    });

    // 初始化显示
    showLoading();
});
```

## 函数应用场景总结

JavaScript函数是编程的核心，通过以上应用场景，你可以：

1. **数据处理**：使用函数过滤、排序和操作数组数据
2. **动画效果**：使用函数创建平滑的过渡和动画
3. **表单验证**：使用函数进行复杂的表单验证逻辑
4. **API调用**：使用函数处理异步API请求和数据

掌握这些应用场景后，你将能够使用函数创建各种功能丰富的Web应用。