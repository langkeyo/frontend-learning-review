/**
 * 学习进度管理 Hook
 * 使用 localStorage 持久化学习进度
 */

export interface ProgressData {
  completedTopics: string[]
  lastUpdated: number
}

const STORAGE_KEY = 'frontend-master-progress'

// 获取进度数据
export function getProgressData(): ProgressData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('[useProgress] Failed to load progress:', error)
  }
  return { completedTopics: [], lastUpdated: Date.now() }
}

// 保存进度数据
export function saveProgressData(data: ProgressData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('[useProgress] Failed to save progress:', error)
  }
}

// 标记知识点为已完成
export function markTopicCompleted(topicId: string): void {
  const progress = getProgressData()
  if (!progress.completedTopics.includes(topicId)) {
    progress.completedTopics.push(topicId)
    progress.lastUpdated = Date.now()
    saveProgressData(progress)
  }
}

// 取消标记知识点
export function unmarkTopicCompleted(topicId: string): void {
  const progress = getProgressData()
  progress.completedTopics = progress.completedTopics.filter(id => id !== topicId)
  progress.lastUpdated = Date.now()
  saveProgressData(progress)
}

// 检查知识点是否已完成
export function isTopicCompleted(topicId: string): boolean {
  const progress = getProgressData()
  return progress.completedTopics.includes(topicId)
}

// 清除所有进度
export function clearProgress(): void {
  localStorage.removeItem(STORAGE_KEY)
}

// 获取完成数量和总数量
export function getProgressStats(totalTopics: number): {
  completed: number
  total: number
  percentage: number
} {
  const progress = getProgressData()
  const completed = progress.completedTopics.length
  return {
    completed,
    total: totalTopics,
    percentage: totalTopics > 0 ? Math.round((completed / totalTopics) * 100) : 0
  }
}
