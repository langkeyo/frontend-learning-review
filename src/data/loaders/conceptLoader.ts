/**
 * 概念讲解加载器
 * 从 concepts 目录加载 markdown 文件
 */

export async function loadConcept(topicId: string): Promise<string> {
  try {
    const module = await import(`../concepts/${topicId}.md?raw`)
    return module.default as string
  } catch {
    return ''
  }
}

export async function loadMultipleConcepts(topicIds: string[]): Promise<Record<string, string>> {
  const result: Record<string, string> = {}
  await Promise.all(
    topicIds.map(async (id) => {
      result[id] = await loadConcept(id)
    })
  )
  return result
}
