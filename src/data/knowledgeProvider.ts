/**
 * 知识点数据提供者
 * 整合所有加载器，提供统一的数据访问接口
 */

import { loadConcept } from './loaders/conceptLoader'
import { loadScenario } from './loaders/scenarioLoader'
import { loadExercise } from './loaders/exerciseLoader'
import { loadCodeFiles } from './loaders/codeLoader'
import { TOPIC_TITLES } from './index'
import type { TopicData } from './types'

/**
 * 获取单个知识点的完整数据
 */
export async function getTopicData(topicId: string): Promise<TopicData> {
  const title = TOPIC_TITLES[topicId] || topicId

  const [concept, scenario, code, exercise] = await Promise.all([
    loadConcept(topicId),
    loadScenario(topicId),
    loadCodeFiles(topicId),
    loadExercise(topicId)
  ])

  return {
    title,
    concept,
    scenario,
    code,
    exercise: exercise || undefined
  }
}

/**
 * 批量获取多个知识点的数据
 */
export async function getMultipleTopicsData(topicIds: string[]): Promise<Record<string, TopicData>> {
  const result: Record<string, TopicData> = {}
  await Promise.all(
    topicIds.map(async (id) => {
      result[id] = await getTopicData(id)
    })
  )
  return result
}

/**
 * 获取知识点的概念讲解
 */
export async function getTopicConcept(topicId: string): Promise<string> {
  return await loadConcept(topicId)
}

/**
 * 获取知识点的应用场景
 */
export async function getTopicScenario(topicId: string): Promise<string> {
  return await loadScenario(topicId)
}

/**
 * 获取知识点的代码文件
 */
export async function getTopicCode(topicId: string) {
  return await loadCodeFiles(topicId)
}

/**
 * 获取知识点的练习题
 */
export async function getTopicExercise(topicId: string) {
  return await loadExercise(topicId)
}
