/**
 * 知识点相关类型定义
 */

import type { Exercise } from './loaders/exerciseLoader'
import type { FileData } from '@/components/FileEditor'

export interface KnowledgePoint {
  id: string
  title: string
  categoryId: string
  hasCode?: boolean
  hasExercise?: boolean
}

export interface KnowledgeCategory {
  id: string
  title: string
  children: KnowledgeItem[]
}

export interface KnowledgeItem {
  id: string
  title: string
  hasCode?: boolean
  hasExercise?: boolean
}

export interface TopicData {
  title: string
  concept: string
  scenario: string
  code: FileData[]
  exercise?: Exercise
}
