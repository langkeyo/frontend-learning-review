# CSS 动画

## 什么是CSS动画？

CSS动画允许你通过CSS创建动画效果，而无需使用JavaScript或Flash。CSS动画使用`@keyframes`规则定义动画序列，然后通过CSS属性应用这些动画。

## 基本概念

### @keyframes 规则

定义动画的关键帧序列。

```css
@keyframes example {
  from { background-color: red; }
  to { background-color: yellow; }
}
```

或使用百分比：

```css
@keyframes example {
  0% { background-color: red; }
  50% { background-color: yellow; }
  100% { background-color: green; }
}
```

### animation 属性

将动画应用到元素。

```css
.element {
  animation: example 5s infinite;
}
```

## 主要属性

### animation-name
指定要应用的动画名称。

```css
.element {
  animation-name: example;
}
```

### animation-duration
指定动画的持续时间。

```css
.element {
  animation-duration: 2s; /* 2秒 */
}
```

### animation-timing-function
指定动画的速度曲线。

```css
.element {
  animation-timing-function: ease; /* 默认值 */
  /* linear：线性 */
  /* ease-in：慢速开始 */
  /* ease-out：慢速结束 */
  /* ease-in-out：慢速开始和结束 */
  /* cubic-bezier：自定义贝塞尔曲线 */
}
```

### animation-delay
指定动画开始前的延迟时间。

```css
.element {
  animation-delay: 1s; /* 延迟1秒开始 */
}
```

### animation-iteration-count
指定动画播放的次数。

```css
.element {
  animation-iteration-count: 3; /* 播放3次 */
  /* infinite：无限循环 */
}
```

### animation-direction
指定动画的方向。

```css
.element {
  animation-direction: normal; /* 默认值，正向播放 */
  /* reverse：反向播放 */
  /* alternate：正向和反向交替 */
  /* alternate-reverse：反向和正向交替 */
}
```

### animation-fill-mode
指定动画在执行前后如何应用样式。

```css
.element {
  animation-fill-mode: none; /* 默认值，不应用任何样式 */
  /* forwards：保持最后一帧的样式 */
  /* backwards：应用第一帧的样式 */
  /* both：both forwards和backwards */
}
```

### animation-play-state
指定动画的播放状态。

```css
.element {
  animation-play-state: running; /* 默认值，正在播放 */
  /* paused：暂停 */
}
```

### animation
所有动画属性的简写。

```css
.element {
  animation: example 2s ease-in 1s infinite alternate;
}
```

## 实用动画示例

### 淡入淡出动画

```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.element {
  animation: fadeIn 1s ease-in;
}
```

### 滑动动画

```css
@keyframes slideIn {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

.element {
  animation: slideIn 0.5s ease-out;
}
```

### 旋转动画

```css
@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.element {
  animation: rotate 2s linear infinite;
}
```

### 缩放动画

```css
@keyframes scale {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.element {
  animation: scale 1s ease-in-out infinite;
}
```

### 弹跳动画

```css
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-30px); }
}

.element {
  animation: bounce 1s ease-in-out infinite;
}
```

### 脉冲动画

```css
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.element {
  animation: pulse 2s ease-in-out infinite;
}
```

### 颜色变化动画

```css
@keyframes colorChange {
  0% { background-color: red; }
  33% { background-color: yellow; }
  66% { background-color: blue; }
  100% { background-color: green; }
}

.element {
  animation: colorChange 3s linear infinite;
}
```

## 高级技巧

### 动画性能优化

```css
.element {
  will-change: transform, opacity; /* 提示浏览器优化 */
  backface-visibility: hidden;    /* 防止3D变换的闪烁 */
  transform: translateZ(0);       /* 触发硬件加速 */
}
```

### 动画组合

```css
@keyframes complexAnimation {
  0% {
    transform: translateX(0) rotate(0deg) scale(1);
    opacity: 0;
  }
  50% {
    transform: translateX(100px) rotate(180deg) scale(1.2);
    opacity: 1;
  }
  100% {
    transform: translateX(0) rotate(360deg) scale(1);
    opacity: 0;
  }
}
```

### 动画事件

```javascript
const element = document.querySelector('.element');

element.addEventListener('animationstart', () => {
  console.log('动画开始');
});

element.addEventListener('animationend', () => {
  console.log('动画结束');
});

element.addEventListener('animationiteration', () => {
  console.log('动画重复');
});
```

### 动态控制动画

```javascript
// 开始动画
element.style.animationPlayState = 'running';

// 暂停动画
element.style.animationPlayState = 'paused';

// 重置动画
element.style.animation = 'none';
setTimeout(() => {
  element.style.animation = '';
}, 10);
```

## 实用场景

### 加载动画

```css
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 2s linear infinite;
}
```

### 按钮悬停效果

```css
.button {
  transition: all 0.3s ease;
}

.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
```

### 卡片悬停效果

```css
.card {
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
}
```

### 进度条动画

```css
.progress-bar {
  width: 0;
  height: 20px;
  background-color: #3498db;
  animation: progress 2s ease-out forwards;
}

@keyframes progress {
  to { width: 100%; }
}
```

## 最佳实践

1. 使用`will-change`属性优化性能
2. 避免过于复杂的动画影响性能
3. 使用`transform`和`opacity`进行动画，它们性能更好
4. 为动画添加适当的延迟和持续时间
5. 考虑无障碍访问，提供动画开关选项
6. 测试动画在不同设备上的表现

CSS动画是创建交互式和吸引人的用户界面的强大工具，掌握它对于现代前端开发至关重要。