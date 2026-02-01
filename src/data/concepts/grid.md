## 概念

Grid（网格布局）是 CSS3 引入的二维布局系统，可以同时处理行和列，非常适合复杂的页面布局。

### 基本语法

```css
.container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;  /* 三列等宽 */
  grid-template-rows: auto auto;         /* 两行 */
  gap: 20px;                          /* 间距 */
}
```

### Grid 术语

```
┌─────────────┬─────────────┬─────────────┐
│   列线 1    │   列线 2    │   列线 3    │
├─────┬───────┼─────┬───────┼─────┬───────┤
│     │       │     │       │     │       │
│行线1│ 单元格 │     │ 单元格 │     │ 单元格 │
│     │       │     │       │     │       │
├─────┼───────┼─────┼───────┼─────┼───────┤
│     │       │     │       │     │       │
│行线2│ 单元格 │     │ 单元格 │     │ 单元格 │
│     │       │     │       │     │       │
├─────┴───────┼─────┴───────┼─────┴───────┤
│   列线 1    │   列线 2    │   列线 3    │
└─────────────┴─────────────┴─────────────┘
```

### 常用单位

| 单位 | 说明 |
|------|------|
| `fr` | 分数单位，分配剩余空间 |
| `repeat()` | 重复模式 |
| `minmax()` | 最小/最大值 |
| `auto-fit` / `auto-fill` | 自动填充 |

### 示例

```css
/* 三列，中间一列自适应 */
grid-template-columns: 200px 1fr 200px;

/* 重复模式 */
grid-template-columns: repeat(3, 1fr);

/* 自适应列 */
grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));

/* 区域命名 */
grid-template-areas:
  "header header header"
  "sidebar main main"
  "footer footer footer";
```
