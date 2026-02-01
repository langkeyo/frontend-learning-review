/**
 * 应用场景加载器
 * 从 scenarios 目录加载 markdown 文件
 */

export async function loadScenario(topicId: string): Promise<string> {
  try {
    const module = await import(`../scenarios/${topicId}.md?raw`)
    return module.default as string
  } catch {
    return ''
  }
}

export async function loadMultipleScenarios(topicIds: string[]): Promise<Record<string, string>> {
  const result: Record<string, string> = {}
  await Promise.all(
    topicIds.map(async (id) => {
      result[id] = await loadScenario(id)
    })
  )
  return result
}
