## 概念

CSS 动画使用 `@keyframes` 规则定义动画关键帧，通过 `animation` 属性应用到元素上。

### 基本语法

```css
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.element {
  animation: fadeIn 1s ease-in-out;
}
```

### animation 属性

| 属性 | 说明 | 默认值 |
|------|------|--------|
| `animation-name` | 动画名称 | none |
| `animation-duration` | 持续时间 | 0s |
| `animation-timing-function` | 速度曲线 | ease |
| `animation-delay` | 延迟时间 | 0s |
| `animation-iteration-count` | 重复次数 | 1 |
| `animation-direction` | 运行方向 | normal |
| `animation-fill-mode` | 填充模式 | none |
| `animation-play-state` | 播放状态 | running |

### 关键帧写法

```css
/* 百分比写法 */
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

/* from/to 写法 */
@keyframes slideIn {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}
```

### 速度曲线

| 值 | 说明 |
|-----|------|
| `linear` | 匀速 |
| `ease` | 开始慢、中间快、结束慢 |
| `ease-in` | 开始慢 |
| `ease-out` | 结束慢 |
| `ease-in-out` | 开始和结束都慢 |
| `cubic-bezier()` | 自定义曲线 |

### 常用动画示例

```css
/* 旋转 */
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 缩放 */
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

/* 震动 */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}
```
