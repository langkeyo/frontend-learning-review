import React, { useState, lazy, Suspense, useEffect, useMemo, useRef } from 'react'
import LoadingSpinner from '@/components/LoadingSpinner'
import ErrorBoundary from '@/components/ErrorBoundary'
import FileEditor from '@/components/FileEditor'
import CodeExecutor from '@/components/CodeExecutor'
import type { ExecutionResult } from '@/components/CodeExecutor'
import type { FileData } from '@/components/FileEditor'
import { CATEGORIES } from '@/data'
import { getTopicCode, getTopicExercise } from '@/data/knowledgeProvider'
import { markTopicCompleted, isTopicCompleted } from '@/hooks/useProgress'

// 动态导入组件
const KnowledgeTree = lazy(() => import('@/components/KnowledgeTree'))
const DocumentViewer = lazy(() => import('@/components/DocumentViewer'))

// 获取所有知识点数量
const getTotalTopicCount = (): number => {
  let count = 0
  CATEGORIES.forEach(cat => {
    count += cat.children.length
  })
  return count
}

const TOTAL_TOPICS = getTotalTopicCount()

/**
 * 主应用组件
 */
const App: React.FC = () => {
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null)
  const [activeFileId, setActiveFileId] = useState<string>('js')
  const [files, setFiles] = useState<FileData[]>([])
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(new Set())
  const hasReceivedMessageRef = useRef(false)  // 跟踪是否已收到消息

  // 计算进度统计
  const progressStats = useMemo(() => {
    const count = completedTopics.size
    return {
      completed: count,
      total: TOTAL_TOPICS,
      percentage: TOTAL_TOPICS > 0 ? Math.round((count / TOTAL_TOPICS) * 100) : 0
    }
  }, [completedTopics])

  // 初始化时加载进度
  useEffect(() => {
    const allTopicIds: string[] = []
    CATEGORIES.forEach(cat => {
      cat.children.forEach(topic => {
        allTopicIds.push(topic.id)
      })
    })

    const completed = new Set<string>()
    allTopicIds.forEach(id => {
      if (isTopicCompleted(id)) {
        completed.add(id)
      }
    })
    setCompletedTopics(completed)
  }, [])

  // 当选择知识点时，加载对应的代码文件

  // 当选择知识点时，加载对应的代码文件
  useEffect(() => {
    if (!selectedTopicId) {
      setFiles([])
      return
    }

    getTopicCode(selectedTopicId)
      .then(codeFiles => {
        console.log('[App] Loaded code files for topic:', selectedTopicId, 'files:', codeFiles.map(f => ({ id: f.id, name: f.name, contentLength: f.content.length })))
        setFiles(codeFiles)
        // 等待 files 状态更新后再设置 activeFileId
        setTimeout(() => {
          if (codeFiles.length > 0) {
            const newActiveId = codeFiles[0]?.id || 'js'
            setActiveFileId(newActiveId)
          }
        }, 0)
        setExecutionResult(null)
      })
      .catch(error => {
        console.error('[App] Failed to load code files:', error)
      })
  }, [selectedTopicId])

  const handleTopicSelect = (topicId: string) => {
    setSelectedTopicId(topicId)
    setActiveFileId('js')
    setExecutionResult(null)
  }

  const handleFileChange = (fileId: string, content: string) => {
    setFiles(prev => prev.map(file => {
      if (file.id === fileId) {
        // 只有当内容真正改变时才设置 isModified
        const hasContentChanged = file.content !== content
        return { ...file, content, isModified: hasContentChanged ? true : file.isModified }
      }
      return file
    }))
  }

  const handleActiveFileChange = (fileId: string) => {
    setActiveFileId(fileId)
  }

  const handleResetFiles = () => {
    if (selectedTopicId) {
      getTopicCode(selectedTopicId)
        .then(codeFiles => setFiles(codeFiles))
        .catch(console.error)
    }
  }

  const handleSave = () => {
    setFiles(prev => prev.map(file => ({
      ...file,
      isModified: false
    })))
  }

  const handleLoadExerciseCode = async () => {
    if (!selectedTopicId) return

    try {
      const exercise = await getTopicExercise(selectedTopicId)
      if (!exercise) {
        console.log('[App] No exercise found for topic:', selectedTopicId)
        return
      }

      console.log('[App] Loading exercise code for:', selectedTopicId)

      // 更新文件内容为练习题起始代码
      setFiles(prev => prev.map(file => {
        if (file.id === 'js' && exercise.starterCode) {
          return { ...file, content: exercise.starterCode, isModified: true }
        }
        if (file.id === 'html' && exercise.starterCodeHtml) {
          return { ...file, content: exercise.starterCodeHtml, isModified: true }
        }
        if (file.id === 'css' && exercise.starterCodeCss) {
          return { ...file, content: exercise.starterCodeCss, isModified: true }
        }
        return file
      }))

      setExecutionResult(null)
    } catch (error) {
      console.error('[App] Failed to load exercise code:', error)
    }
  }

  const handleMarkCompleted = () => {
    if (!selectedTopicId) return

    const newCompleted = new Set(completedTopics)
    if (newCompleted.has(selectedTopicId)) {
      newCompleted.delete(selectedTopicId)
    } else {
      newCompleted.add(selectedTopicId)
      markTopicCompleted(selectedTopicId)
    }
    setCompletedTopics(newCompleted)
  }

  const isCurrentTopicCompleted = selectedTopicId ? completedTopics.has(selectedTopicId) : false

  // 练习题验证函数
  const handleVerifyExercise = async (): Promise<{ passed: boolean; message: string }> => {
    if (!selectedTopicId) {
      return { passed: false, message: '请先选择一个知识点' }
    }

    try {
      // 获取练习题的预期输出
      const exercise = await getTopicExercise(selectedTopicId)
      if (!exercise || !exercise.expectedOutput) {
        return { passed: false, message: '该练习题暂未设置验证条件' }
      }

      // 获取当前编辑器中的代码
      const jsFile = files.find(f => f.id === 'js')
      const htmlFile = files.find(f => f.id === 'html')
      const cssFile = files.find(f => f.id === 'css')

      const htmlContent = htmlFile?.content || ''
      const cssContent = cssFile?.content || ''
      const jsContent = jsFile?.content || ''

      // 使用 Promise 包装执行结果，方便等待
      return new Promise((resolve) => {
        const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>${cssContent}</style>
</head>
<body>
  ${htmlContent}
  <script>
    window.testOutput = [];
    window.originalLog = console.log;
    console.log = (...args) => {
      window.testOutput.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
      window.originalLog.apply(console, args);
    };

    window.onerror = (msg, url, line, col, error) => {
      window.testOutput.push('ERROR: ' + msg);
    };

    try {
      ${jsContent}
    } catch (e) {
      window.testOutput.push('ERROR: ' + (e instanceof Error ? e.message : String(e)));
    }

    // 将结果发送回父窗口
    setTimeout(() => {
      window.parent.postMessage({
        type: 'exercise-verify',
        output: window.testOutput.join('\\n')
      }, '*');
    }, 100);
  <\/script>
</body>
</html>`

        // 创建隐藏的 iframe 执行代码
        const iframe = document.createElement('iframe')
        iframe.style.display = 'none'
        document.body.appendChild(iframe)

        const handleMessage = (event: MessageEvent) => {
          if (event.data && event.data.type === 'exercise-verify') {
            const actualOutput = event.data.output || ''
            const expectedOutput = exercise.expectedOutput || ''

            // 清理输出（去除多余空格）
            const cleanActual = actualOutput.trim()
            const cleanExpected = expectedOutput.trim()

            // 验证结果
            const passed = cleanActual === cleanExpected

            // 清理
            window.removeEventListener('message', handleMessage)
            if (document.body.contains(iframe)) {
              document.body.removeChild(iframe)
            }

            resolve({
              passed,
              message: passed
                ? '✅ 验证通过！你的代码输出了正确的结果。'
                : `❌ 验证失败。\n预期输出：${expectedOutput}\n实际输出：${actualOutput}`
            })
          }
        }

        window.addEventListener('message', handleMessage)

        // 在 iframe 中执行
        const doc = iframe.contentDocument || (iframe.contentWindow as any).document
        doc.open()
        doc.write(fullHtml)
        doc.close()

        // 超时处理
        setTimeout(() => {
          window.removeEventListener('message', handleMessage)
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe)
          }
          resolve({ passed: false, message: '验证超时，代码可能没有正常执行' })
        }, 5000)
      })
    } catch (error) {
      return { passed: false, message: `验证出错：${error}` }
    }
  }

  const handleRunCode = async (openInNewWindow: boolean = false) => {
    console.log('[handleRunCode] Selected topic:', selectedTopicId)
    console.log('[handleRunCode] Files loaded:', files.map(f => ({ id: f.id, name: f.name, contentLength: f.content.length })))

    if (!selectedTopicId) {
      setExecutionResult({ error: '请先选择一个知识点' })
      return
    }

    const jsFile = files.find(f => f.id === 'js')
    const htmlFile = files.find(f => f.id === 'html')
    const cssFile = files.find(f => f.id === 'css')

    console.log('[handleRunCode] jsFile:', jsFile ? { id: jsFile.id, contentLength: jsFile.content.length } : 'not found')
    console.log('[handleRunCode] htmlFile:', htmlFile ? { id: htmlFile.id, contentLength: htmlFile.content.length } : 'not found')
    console.log('[handleRunCode] cssFile:', cssFile ? { id: cssFile.id, contentLength: cssFile.content.length } : 'not found')

    try {
      // 构建完整的 HTML 文档
      const htmlContent = htmlFile?.content || ''
      const cssContent = cssFile?.content || ''
      const jsContent = jsFile?.content || ''

      console.log('[handleRunCode] Executing code, jsContent length:', jsContent.length)

      // 新窗口打开模式
      if (openInNewWindow) {
        const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>${cssContent}</style>
</head>
<body>
  ${htmlContent}
  <script>
    // 捕获控制台输出
    window.output = [];
    window.originalLog = console.log;
    console.log = (...args) => {
      window.output.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
      window.originalLog.apply(console, args);
    };

    // 捕获错误
    window.onerror = (msg, url, line, col, error) => {
      window.output.push('错误: ' + msg);
    };

    try {
      ${jsContent}
    } catch (e) {
      window.output.push('错误: ' + (e instanceof Error ? e.message : String(e)));
    }

    // 显示控制台输出
    setTimeout(() => {
      const outputDiv = document.createElement('div');
      outputDiv.style.cssText = 'position: fixed; bottom: 0; left: 0; right: 0; max-height: 200px; overflow-y: auto; background: #1e1e1e; color: #d4d4d4; padding: 10px; font-family: monospace; font-size: 12px; white-space: pre-wrap; border-top: 1px solid #333; z-index: 1000;';
      outputDiv.textContent = window.output.length > 0 ? window.output.join('\\n') : '代码执行完成，无输出';
      document.body.appendChild(outputDiv);
    }, 100);
  <\/script>
</body>
</html>`

        // 打开新窗口并写入 HTML
        const newWindow = window.open('', '_blank')
        if (newWindow) {
          newWindow.document.write(fullHtml)
          newWindow.document.close()
        } else {
          setExecutionResult({ error: '无法打开新窗口，请检查浏览器弹窗设置' })
        }
        return
      }

      // 内嵌 iframe 模式（原有逻辑）
      const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>${cssContent}</style>
</head>
<body>
  ${htmlContent}
  <script>
    // 捕获控制台输出
    window.output = [];
    window.originalLog = console.log;
    console.log = (...args) => {
      window.output.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
      window.originalLog.apply(console, args);
    };

    // 捕获错误
    window.onerror = (msg, url, line, col, error) => {
      window.output.push('错误: ' + msg);
    };

    try {
      ${jsContent}
    } catch (e) {
      window.output.push('错误: ' + (e instanceof Error ? e.message : String(e)));
    }

    // 将输出发送到父窗口
    setTimeout(() => {
      window.parent.postMessage({ type: 'code-output', output: window.output.join('\\n') }, '*');
    }, 100);
  <\/script>
</body>
</html>`

      // 创建临时 iframe 执行代码
      const iframe = document.createElement('iframe')
      iframe.style.display = 'none'
      iframe.id = 'code-execution-iframe'

      document.body.appendChild(iframe)

      // 监听来自 iframe 的消息
      const handleMessage = (event: MessageEvent) => {
        if (event.data && event.data.type === 'code-output') {
          hasReceivedMessageRef.current = true  // 标记已收到消息
          setExecutionResult({
            output: event.data.output || '代码执行完成，无输出',
            html: htmlContent,
            css: cssContent,
            js: jsContent
          })
          // 清理监听器和 iframe
          window.removeEventListener('message', handleMessage)
          setTimeout(() => {
            if (document.body.contains(iframe)) {
              document.body.removeChild(iframe)
            }
          }, 1000)
        }
      }

      window.addEventListener('message', handleMessage)

      // 在 iframe 中执行
      const doc = iframe.contentDocument || (iframe.contentWindow as any).document
      doc.open()
      doc.write(fullHtml)
      doc.close()

      // 设置超时
      setTimeout(() => {
        window.removeEventListener('message', handleMessage)
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe)
        }
        // 如果没有收到消息，显示超时
        if (!hasReceivedMessageRef.current) {
          setExecutionResult({ output: '代码执行完成（超时）' })
        }
      }, 3000)

    } catch (e) {
      setExecutionResult({ error: e instanceof Error ? e.message : String(e) })
    }
  }

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <ErrorBoundary>
      <div className="flex h-screen w-screen bg-white dark:bg-gray-900 flex-col">
        {/* 顶部导航栏 */}
        <header className="h-12 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              FrontendMaster
            </h1>
            {/* 进度条 */}
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all duration-300"
                  style={{ width: progressStats.percentage + '%' }}
                />
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {progressStats.completed}/{progressStats.total} ({progressStats.percentage}%)
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* 标记完成按钮 */}
            {selectedTopicId && (
              <button
                onClick={handleMarkCompleted}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  isCurrentTopicCompleted
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-gray-300 text-gray-700 dark:bg-gray-600 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
              >
                {isCurrentTopicCompleted ? '✓ 已完成' : '标记完成'}
              </button>
            )}
            {/* 主题切换 */}
            <button
              onClick={handleThemeToggle}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label="Toggle theme"
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </header>

        {/* 主内容区 */}
        <div className="flex flex-1 overflow-hidden">
          {/* 左侧：知识树导航 */}
          <div className="w-64 bg-gray-50 dark:bg-gray-850 border-r border-gray-200 dark:border-gray-700 overflow-y-auto shrink-0">
            <Suspense fallback={<LoadingSpinner />}>
              <KnowledgeTree
                data={CATEGORIES}
                selectedTopicId={selectedTopicId}
                onTopicSelect={handleTopicSelect}
                completedTopics={completedTopics}
              />
            </Suspense>
          </div>

          {/* 中间：文档区 */}
          <div className="flex-1 overflow-y-auto">
            <Suspense fallback={<LoadingSpinner />}>
              <DocumentViewer
                topicId={selectedTopicId}
                onLoadExerciseCode={handleLoadExerciseCode}
                onVerifyExercise={handleVerifyExercise}
              />
            </Suspense>
          </div>

          {/* 右侧：代码编辑器 + 执行结果 */}
          <div className="w-[500px] bg-gray-50 dark:bg-gray-850 border-l border-gray-200 dark:border-gray-700 flex flex-col shrink-0">
            {selectedTopicId && files.length > 0 ? (
              <>
                {/* 编辑器 */}
                <div className="flex-1 min-h-0">
                  <FileEditor
                    files={files}
                    activeFileId={activeFileId}
                    onFileChange={handleFileChange}
                    onActiveFileChange={handleActiveFileChange}
                    onResetFiles={handleResetFiles}
                    onFileSave={handleSave}
                    theme={isDarkMode ? 'vs-dark' : 'vs'}
                  />
                </div>

                {/* 执行按钮 */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
                  <button
                    onClick={() => handleRunCode(false)}
                    className="flex-1 p-2 rounded bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 cursor-not-allowed transition-colors text-sm"
                  >
                    ▶️ 运行代码
                  </button>
                  <button
                    onClick={() => handleRunCode(true)}
                    className="flex-1 p-2 rounded bg-gray-600 text-white hover:bg-gray-700 disabled:opacity-50 cursor-not-allowed transition-colors text-sm"
                  >
                    🌐 新窗口运行
                  </button>
                </div>

                {/* 执行结果 */}
                <div className="h-48 border-t border-gray-200 dark:border-gray-700 flex flex-col">
                  <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">执行结果</h3>
                  </div>
                  <div className="flex-1 p-4 overflow-hidden">
                    <CodeExecutor result={executionResult} />
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <div className="text-4xl mb-4">💻</div>
                  <p>选择一个知识点开始练习</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default App
