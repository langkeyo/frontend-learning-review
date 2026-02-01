/**
 * 知识点数据索引
 * 提供分类树和知识点元数据
 */

import type { KnowledgeCategory } from './types'

// 知识点分类树
export const CATEGORIES: KnowledgeCategory[] = [
  {
    id: 'html-css',
    title: 'HTML & CSS',
    children: [
      { id: 'semantic-tags', title: '语义化标签', hasCode: true, hasExercise: true },
      { id: 'flexbox', title: 'Flexbox 布局', hasCode: true, hasExercise: true },
      { id: 'grid', title: 'Grid 布局', hasCode: true, hasExercise: true },
      { id: 'responsive', title: '响应式设计', hasCode: true, hasExercise: true },
      { id: 'animation', title: 'CSS 动画', hasCode: true, hasExercise: true }
    ]
  },
  {
    id: 'javascript',
    title: 'JavaScript ES6+',
    children: [
      { id: 'arrow-function', title: '箭头函数', hasCode: true, hasExercise: true },
      { id: 'destructuring', title: '解构赋值', hasCode: true, hasExercise: true },
      { id: 'promise', title: 'Promise & Async/Await', hasCode: true, hasExercise: true },
      { id: 'iterator', title: 'Iterator & Generator', hasCode: true, hasExercise: true },
      { id: 'module', title: '模块化', hasCode: true, hasExercise: true }
    ]
  },
  {
    id: 'network',
    title: '网络请求',
    children: [
      { id: 'fetch', title: 'Fetch API', hasCode: true, hasExercise: true },
      { id: 'cors', title: '跨域处理 (CORS)', hasCode: true, hasExercise: true },
      { id: 'cancel', title: '请求取消', hasCode: true, hasExercise: true },
      { id: 'retry', title: '超时和重试', hasCode: true, hasExercise: true }
    ]
  }
]

// 知识点标题映射
export const TOPIC_TITLES: Record<string, string> = {}

// 从分类树中收集所有知识点
function collectTopics(categories: KnowledgeCategory[]) {
  for (const category of categories) {
    for (const item of category.children) {
      TOPIC_TITLES[item.id] = item.title
    }
  }
}

collectTopics(CATEGORIES)

// 获取所有知识点ID
export const ALL_TOPIC_IDS = Object.keys(TOPIC_TITLES)
