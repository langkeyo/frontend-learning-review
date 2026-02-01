/**
 * 练习题加载器
 * 从 exercises 目录加载 json 文件
 */

export interface Exercise {
  description: string
  starterCode?: string
  expectedOutput?: string
  hint?: string
  solution?: string
  starterCodeHtml?: string
  starterCodeCss?: string
}

export async function loadExercise(topicId: string): Promise<Exercise | null> {
  try {
    const module = await import(`../exercises/${topicId}.json`)
    return module.default as Exercise
  } catch {
    return null
  }
}

export async function loadMultipleExercises(topicIds: string[]): Promise<Record<string, Exercise | null>> {
  const result: Record<string, Exercise | null> = {}
  await Promise.all(
    topicIds.map(async (id) => {
      result[id] = await loadExercise(id)
    })
  )
  return result
}
