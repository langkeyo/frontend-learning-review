# JavaScript变量应用场景

## 变量在表单处理中的应用

### 场景描述
创建一个用户注册表单，使用变量存储和验证用户输入。

### 实现步骤

1. **HTML结构**
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>用户注册表单</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>用户注册</h1>
    </header>

    <main>
        <form id="registration-form">
            <div class="form-group">
                <label for="username">用户名：</label>
                <input type="text" id="username" name="username" required minlength="3" maxlength="20">
                <span class="error" id="username-error"></span>
            </div>

            <div class="form-group">
                <label for="email">邮箱：</label>
                <input type="email" id="email" name="email" required>
                <span class="error" id="email-error"></span>
            </div>

            <div class="form-group">
                <label for="password">密码：</label>
                <input type="password" id="password" name="password" required minlength="6">
                <span class="error" id="password-error"></span>
            </div>

            <div class="form-group">
                <label for="confirm-password">确认密码：</label>
                <input type="password" id="confirm-password" name="confirm-password" required>
                <span class="error" id="confirm-password-error"></span>
            </div>

            <div class="form-group">
                <label for="age">年龄：</label>
                <input type="number" id="age" name="age" min="18" max="120">
                <span class="error" id="age-error"></span>
            </div>

            <button type="submit">注册</button>
        </form>

        <div id="registration-result"></div>
    </main>

    <footer>
        <p>&copy; 2024 用户注册表单</p>
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

form {
    background: white;
    border-radius: 8px;
    padding: 25px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
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
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    width: 100%;
}

button:hover {
    background-color: #357abd;
}

#registration-result {
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
    const ageInput = document.getElementById('age');
    const usernameError = document.getElementById('username-error');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    const confirmPasswordError = document.getElementById('confirm-password-error');
    const ageError = document.getElementById('age-error');
    const resultDiv = document.getElementById('registration-result');

    // 实时验证
    usernameInput.addEventListener('input', validateUsername);
    emailInput.addEventListener('input', validateEmail);
    passwordInput.addEventListener('input', validatePassword);
    confirmPasswordInput.addEventListener('input', validateConfirmPassword);
    ageInput.addEventListener('input', validateAge);

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const isUsernameValid = validateUsername();
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        const isConfirmPasswordValid = validateConfirmPassword();
        const isAgeValid = validateAge();

        if (isUsernameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid && isAgeValid) {
            // 表单提交逻辑
            const userData = {
                username: usernameInput.value.trim(),
                email: emailInput.value.trim(),
                password: passwordInput.value,
                age: ageInput.value ? parseInt(ageInput.value) : null
            };

            console.log('注册数据:', userData);

            // 显示成功消息
            resultDiv.textContent = `注册成功！欢迎, ${userData.username}!`;
            resultDiv.className = 'success';
            resultDiv.style.display = 'block';

            // 重置表单
            form.reset();
        }
    });

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
        if (value.length < 6) {
            passwordError.textContent = '密码至少需要6个字符';
            passwordError.style.display = 'block';
            return false;
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
            passwordError.textContent = '密码需要包含大小写字母和数字';
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

    function validateAge() {
        const value = ageInput.value;
        if (value && (isNaN(value) || value < 18 || value > 120)) {
            ageError.textContent = '年龄必须在18-120之间';
            ageError.style.display = 'block';
            return false;
        } else {
            ageError.style.display = 'none';
            return true;
        }
    }
});
```

## 变量在数据计算中的应用

### 场景描述
创建一个简单的计算器应用，使用变量进行数学运算。

### 实现步骤

1. **HTML结构**
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>简单计算器</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>简单计算器</h1>
    </header>

    <main>
        <div class="calculator">
            <input type="number" id="num1" placeholder="第一个数字">
            <select id="operation">
                <option value="add">+</option>
                <option value="subtract">-</option>
                <option value="multiply">*</option>
                <option value="divide">/</option>
            </select>
            <input type="number" id="num2" placeholder="第二个数字">
            <button id="calculate">计算</button>

            <div id="result">
                <p>结果: <span id="result-value">0</span></p>
            </div>
        </div>
    </main>

    <footer>
        <p>&copy; 2024 简单计算器</p>
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
    max-width: 400px;
    margin: 0 auto;
}

.calculator {
    background: white;
    border-radius: 8px;
    padding: 25px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.calculator input {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
}

.calculator select {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
}

.calculator button {
    width: 100%;
    padding: 10px;
    background-color: #4a90e2;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1.1em;
}

.calculator button:hover {
    background-color: #357abd;
}

#result {
    margin-top: 20px;
    padding: 15px;
    background: #f8f9fa;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    text-align: center;
    font-size: 1.2em;
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
    const num1Input = document.getElementById('num1');
    const num2Input = document.getElementById('num2');
    const operationSelect = document.getElementById('operation');
    const calculateBtn = document.getElementById('calculate');
    const resultValue = document.getElementById('result-value');

    calculateBtn.addEventListener('click', () => {
        const num1 = parseFloat(num1Input.value);
        const num2 = parseFloat(num2Input.value);
        const operation = operationSelect.value;

        let result;

        // 使用变量进行计算
        switch (operation) {
            case 'add':
                result = num1 + num2;
                break;
            case 'subtract':
                result = num1 - num2;
                break;
            case 'multiply':
                result = num1 * num2;
                break;
            case 'divide':
                if (num2 === 0) {
                    resultValue.textContent = '错误: 除数不能为零';
                    resultValue.parentElement.style.color = '#e74c3c';
                    return;
                }
                result = num1 / num2;
                break;
            default:
                result = 0;
        }

        // 显示结果
        resultValue.textContent = result;
        resultValue.parentElement.style.color = '#2d3748';
    });

    // 添加键盘事件
    num1Input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            calculateBtn.click();
        }
    });

    num2Input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            calculateBtn.click();
        }
    });

    // 添加实时计算
    function calculateRealTime() {
        const num1 = parseFloat(num1Input.value);
        const num2 = parseFloat(num2Input.value);
        const operation = operationSelect.value;

        if (isNaN(num1) || isNaN(num2)) {
            resultValue.textContent = '0';
            return;
        }

        let result;

        switch (operation) {
            case 'add':
                result = num1 + num2;
                break;
            case 'subtract':
                result = num1 - num2;
                break;
            case 'multiply':
                result = num1 * num2;
                break;
            case 'divide':
                if (num2 === 0) {
                    resultValue.textContent = '错误';
                    resultValue.parentElement.style.color = '#e74c3c';
                    return;
                }
                result = num1 / num2;
                break;
            default:
                result = 0;
        }

        resultValue.textContent = result;
        resultValue.parentElement.style.color = '#2d3748';
    }

    num1Input.addEventListener('input', calculateRealTime);
    num2Input.addEventListener('input', calculateRealTime);
    operationSelect.addEventListener('change', calculateRealTime);
});
```

## 变量在游戏开发中的应用

### 场景描述
创建一个简单的猜数字游戏，使用变量跟踪游戏状态。

### 实现步骤

1. **HTML结构**
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>猜数字游戏</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>猜数字游戏</h1>
    </header>

    <main>
        <div class="game-container">
            <div class="game-info">
                <p>我已经想好了一个1-100之间的数字，你来猜猜看！</p>
                <p>你已经猜了 <span id="attempts">0</span> 次</p>
            </div>

            <div class="input-group">
                <input type="number" id="guess" min="1" max="100" placeholder="输入你的猜测">
                <button id="submit-guess">提交</button>
            </div>

            <div id="feedback"></div>

            <button id="new-game">新游戏</button>
        </div>
    </main>

    <footer>
        <p>&copy; 2024 猜数字游戏</p>
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
    max-width: 500px;
    margin: 0 auto;
}

.game-container {
    background: white;
    border-radius: 8px;
    padding: 25px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.game-info {
    margin-bottom: 20px;
}

.game-info p {
    margin: 10px 0;
}

.input-group {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

.input-group input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.input-group button {
    padding: 10px 20px;
    background-color: #4a90e2;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.input-group button:hover {
    background-color: #357abd;
}

#feedback {
    margin: 20px 0;
    padding: 15px;
    border-radius: 8px;
    text-align: center;
    font-weight: bold;
    min-height: 50px;
}

.success {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
}

.too-high {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
}

.too-low {
    background-color: #fff3cd;
    color: #856404;
    border: 1px solid #ffeeba;
}

#new-game {
    width: 100%;
    padding: 10px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1.1em;
}

#new-game:hover {
    background-color: #218838;
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
    const guessInput = document.getElementById('guess');
    const submitBtn = document.getElementById('submit-guess');
    const newGameBtn = document.getElementById('new-game');
    const attemptsSpan = document.getElementById('attempts');
    const feedbackDiv = document.getElementById('feedback');

    // 游戏变量
    let targetNumber;
    let attempts;
    let gameActive;

    // 初始化游戏
    function initGame() {
        targetNumber = Math.floor(Math.random() * 100) + 1;
        attempts = 0;
        gameActive = true;
        attemptsSpan.textContent = attempts;
        feedbackDiv.textContent = '';
        feedbackDiv.className = '';
        guessInput.value = '';
        guessInput.disabled = false;
        submitBtn.disabled = false;
        newGameBtn.style.display = 'none';
    }

    // 开始新游戏
    initGame();

    // 提交猜测
    submitBtn.addEventListener('click', () => {
        if (!gameActive) return;

        const guess = parseInt(guessInput.value);

        if (isNaN(guess) || guess < 1 || guess > 100) {
            feedbackDiv.textContent = '请输入1-100之间的数字';
            feedbackDiv.className = 'too-low';
            return;
        }

        // 增加尝试次数
        attempts++;
        attemptsSpan.textContent = attempts;

        // 比较猜测
        if (guess === targetNumber) {
            feedbackDiv.textContent = `恭喜！你猜对了！数字是 ${targetNumber}。`;
            feedbackDiv.className = 'success';
            endGame();
        } else if (guess > targetNumber) {
            feedbackDiv.textContent = '太高了！再试一次。';
            feedbackDiv.className = 'too-high';
        } else {
            feedbackDiv.textContent = '太低了！再试一次。';
            feedbackDiv.className = 'too-low';
        }

        // 清空输入
        guessInput.value = '';
        guessInput.focus();
    });

    // 新游戏
    newGameBtn.addEventListener('click', initGame);

    // 键盘事件
    guessInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && gameActive) {
            submitBtn.click();
        }
    });

    // 结束游戏
    function endGame() {
        gameActive = false;
        guessInput.disabled = true;
        submitBtn.disabled = true;
        newGameBtn.style.display = 'block';
    }
});
```

## 变量在数据存储中的应用

### 场景描述
创建一个简单的待办事项列表，使用变量存储和操作任务数据。

### 实现步骤

1. **HTML结构**
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>待办事项列表</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>待办事项列表</h1>
    </header>

    <main>
        <div class="todo-container">
            <div class="input-group">
                <input type="text" id="new-task" placeholder="添加新任务...">
                <button id="add-task">添加</button>
            </div>

            <div id="task-list">
                <!-- 任务将在这里动态添加 -->
            </div>

            <div class="stats">
                <p>总任务数: <span id="total-tasks">0</span></p>
                <p>已完成: <span id="completed-tasks">0</span></p>
                <p>未完成: <span id="incomplete-tasks">0</span></p>
            </div>
        </div>
    </main>

    <footer>
        <p>&copy; 2024 待办事项列表</p>
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

.todo-container {
    background: white;
    border-radius: 8px;
    padding: 25px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.input-group {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

.input-group input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.input-group button {
    padding: 10px 20px;
    background-color: #4a90e2;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.input-group button:hover {
    background-color: #357abd;
}

#task-list {
    margin-bottom: 20px;
}

.task-item {
    display: flex;
    align-items: center;
    padding: 10px;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    margin-bottom: 10px;
    background: #f8f9fa;
}

.task-item.completed {
    background: #e8f5e9;
    text-decoration: line-through;
    color: #666;
}

.task-item input[type="checkbox"] {
    margin-right: 10px;
}

.task-item span {
    flex: 1;
}

.task-item button {
    background: none;
    border: none;
    color: #e74c3c;
    cursor: pointer;
    padding: 5px;
}

.task-item button:hover {
    background: #fadbd8;
    border-radius: 4px;
}

.stats {
    display: flex;
    justify-content: space-around;
    background: #f8f9fa;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 15px;
    text-align: center;
}

.stats p {
    margin: 0;
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
    const newTaskInput = document.getElementById('new-task');
    const addTaskBtn = document.getElementById('add-task');
    const taskList = document.getElementById('task-list');
    const totalTasksSpan = document.getElementById('total-tasks');
    const completedTasksSpan = document.getElementById('completed-tasks');
    const incompleteTasksSpan = document.getElementById('incomplete-tasks');

    // 任务数组
    let tasks = [];

    // 添加任务
    function addTask() {
        const taskText = newTaskInput.value.trim();

        if (taskText === '') {
            return;
        }

        // 创建新任务对象
        const task = {
            id: Date.now(),
            text: taskText,
            completed: false
        };

        // 添加到数组
        tasks.push(task);

        // 渲染任务
        renderTask(task);

        // 更新统计
        updateStats();

        // 清空输入
        newTaskInput.value = '';
        newTaskInput.focus();
    }

    // 渲染单个任务
    function renderTask(task) {
        const taskItem = document.createElement('div');
        taskItem.className = 'task-item';
        if (task.completed) {
            taskItem.classList.add('completed');
        }
        taskItem.dataset.id = task.id;

        taskItem.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''}>
            <span>${task.text}</span>
            <button>Delete</button>
        `;

        // 添加事件监听器
        const checkbox = taskItem.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', () => {
            toggleTask(task.id);
        });

        const deleteBtn = taskItem.querySelector('button');
        deleteBtn.addEventListener('click', () => {
            deleteTask(task.id);
        });

        // 添加到列表
        taskList.appendChild(taskItem);
    }

    // 切换任务状态
    function toggleTask(id) {
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            const taskItem = document.querySelector(`[data-id="${id}"]`);
            if (task.completed) {
                taskItem.classList.add('completed');
            } else {
                taskItem.classList.remove('completed');
            }
            updateStats();
        }
    }

    // 删除任务
    function deleteTask(id) {
        tasks = tasks.filter(t => t.id !== id);
        const taskItem = document.querySelector(`[data-id="${id}"]`);
        if (taskItem) {
            taskItem.remove();
        }
        updateStats();
    }

    // 更新统计
    function updateStats() {
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const incomplete = total - completed;

        totalTasksSpan.textContent = total;
        completedTasksSpan.textContent = completed;
        incompleteTasksSpan.textContent = incomplete;
    }

    // 事件监听器
    addTaskBtn.addEventListener('click', addTask);
    newTaskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // 初始化一些示例任务
    const sampleTasks = [
        { id: 1, text: '学习JavaScript变量', completed: true },
        { id: 2, text: '完成项目练习', completed: false },
        { id: 3, text: '复习响应式设计', completed: false }
    ];

    sampleTasks.forEach(task => {
        tasks.push(task);
        renderTask(task);
    });

    updateStats();
});
```

## 变量应用场景总结

JavaScript变量是编程的基础，通过以上应用场景，你可以：

1. **表单处理**：使用变量存储和验证用户输入
2. **数据计算**：使用变量进行数学运算和逻辑判断
3. **游戏开发**：使用变量跟踪游戏状态
4. **数据存储**：使用变量存储和操作数据集合

掌握这些应用场景后，你将能够使用变量创建各种交互式应用。