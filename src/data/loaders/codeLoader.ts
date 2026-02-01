/**
 * 代码文件加载器
 * 从 code 目录加载代码文件
 */

import type { FileData } from '@/components/FileEditor'

// 使用 fetch API 加载代码文件
export async function loadCodeFile(topicId: string, type: 'html' | 'css' | 'js'): Promise<string> {
  try {
    // 使用相对路径从源目录加载
    const response = await fetch('/src/data/code/' + topicId + '/' + type + '.code')

    // 检查响应状态
    if (!response.ok) {
      console.log('[codeLoader] File not found', topicId, type, response.status)
      return ''  // 文件不存在，返回空字符串
    }

    const content = await response.text()

    // 检查内容是否为空（去除空白字符）
    const trimmedContent = content.trim()
    if (!trimmedContent) {
      console.log('[codeLoader] File is empty', topicId, type)
      return ''  // 文件内容为空，返回空字符串
    }

    console.log('[codeLoader] Loaded successfully', topicId, type, 'length:', content.length)
    return content
  } catch (error) {
    console.log('[codeLoader] Error loading', topicId, type, error)
    return ''  // 加载失败，返回空字符串
  }
}

export async function loadCodeFiles(topicId: string): Promise<FileData[]> {
  const files: FileData[] = []

  // 尝试加载 html
  const htmlContent = await loadCodeFile(topicId, 'html')
  if (htmlContent) {
    files.push({
      id: 'html',
      name: 'index.html',
      language: 'html',
      content: htmlContent
    })
  }

  // 尝试加载 css
  const cssContent = await loadCodeFile(topicId, 'css')
  if (cssContent) {
    files.push({
      id: 'css',
      name: 'style.css',
      language: 'css',
      content: cssContent
    })
  }

  // 尝试加载 js
  const jsContent = await loadCodeFile(topicId, 'js')
  if (jsContent) {
    files.push({
      id: 'js',
      name: 'script.js',
      language: 'javascript',
      content: jsContent
    })
  }

  // 如果没有文件，添加默认的空 js 文件
  if (files.length === 0) {
    console.log('[codeLoader] No files found for', topicId, 'adding default empty js file')
    files.push({
      id: 'js',
      name: 'script.js',
      language: 'javascript',
      content: ''
    })
  } else {
    console.log('[codeLoader] Loaded files for', topicId, ':', files.map(f => f.id))
  }

  return files
}

export async function loadCodeFilesForTopics(topicIds: string[]): Promise<Record<string, FileData[]>> {
  const result: Record<string, FileData[]> = {}
  await Promise.all(
    topicIds.map(async (id) => {
      result[id] = await loadCodeFiles(id)
    })
  )
  return result
}
