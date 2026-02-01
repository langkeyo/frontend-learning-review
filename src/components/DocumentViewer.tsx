import React, { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { getTopicData } from '@/data/knowledgeProvider'
// 导入代码高亮样式
import 'highlight.js/styles/github-dark.css'

interface DocumentViewerProps {
  topicId: string | null
  onLoadExerciseCode?: () => void
  onVerifyExercise?: () => Promise<{ passed: boolean; message: string }>
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ topicId, onLoadExerciseCode, onVerifyExercise }) => {
  const [topicData, setTopicData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [showExercise, setShowExercise] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [verifyResult, setVerifyResult] = useState<{ passed: boolean; message: string } | null>(null)

  useEffect(() => {
    if (!topicId) {
      setTopicData(null)
      return
    }

    setLoading(true)
    getTopicData(topicId)
      .then(data => {
        setTopicData(data)
        setShowExercise(false)
        setShowHint(false)
        setShowSolution(false)
        setVerifyResult(null)
      })
      .catch(console.error)
      .finally(() => {
        setLoading(false)
      })
  }, [topicId])

  const handleVerify = async () => {
    if (!onVerifyExercise) return

    setIsVerifying(true)
    setVerifyResult(null)

    try {
      const result = await onVerifyExercise()
      setVerifyResult(result)

      // 如果验证通过，自动标记为已完成
      if (result.passed) {
        // 可以在这里触发完成回调
      }
    } catch (error) {
      setVerifyResult({
        passed: false,
        message: `验证出错：${error instanceof Error ? error.message : String(error)}`
      })
    } finally {
      setIsVerifying(false)
    }
  }

  if (!topicId) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <div className="text-4xl mb-4">📚</div>
          <p>请从左侧选择一个知识点开始学习</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">加载中...</div>
      </div>
    )
  }

  if (!topicData) {
    return (
      <div className="text-gray-500">
        <p>该知识点内容正在完善中...</p>
      </div>
    )
  }

  const { title, concept, scenario, exercise } = topicData

  // 自定义 Markdown 渲染组件
  const MarkdownRenderer = ({ content }: { content: string }) => (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      components={{
        // 标题样式
        h1: ({ children }) => <h1 className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-gray-100">{children}</h1>,
        h2: ({ children }) => <h2 className="text-xl font-bold mt-6 mb-3 text-gray-900 dark:text-gray-100">{children}</h2>,
        h3: ({ children }) => <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-800 dark:text-gray-200">{children}</h3>,
        h4: ({ children }) => <h4 className="text-base font-semibold mt-3 mb-2 text-gray-700 dark:text-gray-300">{children}</h4>,
        // 段落样式
        p: ({ children }) => <p className="mb-3 text-gray-700 dark:text-gray-300 leading-relaxed">{children}</p>,
        // 代码块样式
        code: ({ className, children }: any) => {
          const match = /language-(\w+)/.exec(className || '')
          return match ? (
            <code className={className}>{children}</code>
          ) : (
            <code className="bg-gray-200 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono text-red-600 dark:text-red-400">{children}</code>
          )
        },
        pre: ({ children }) => (
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4 text-sm font-mono">
            {children}
          </pre>
        ),
        // 列表样式
        ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1 text-gray-700 dark:text-gray-300">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1 text-gray-700 dark:text-gray-300">{children}</ol>,
        li: ({ children }) => <li className="ml-4">{children}</li>,
        // 表格样式
        table: ({ children }) => (
          <div className="overflow-x-auto my-4">
            <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600">{children}</table>
          </div>
        ),
        thead: ({ children }) => <thead className="bg-gray-100 dark:bg-gray-800">{children}</thead>,
        tbody: ({ children }) => <tbody>{children}</tbody>,
        tr: ({ children }) => <tr className="border-b border-gray-300 dark:border-gray-600">{children}</tr>,
        th: ({ children }) => <th className="px-4 py-2 text-left font-semibold text-gray-900 dark:text-gray-100">{children}</th>,
        td: ({ children }) => <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{children}</td>,
        // 引用样式
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-blue-500 pl-4 italic my-4 text-gray-600 dark:text-gray-400">
            {children}
          </blockquote>
        ),
        // 水平线样式
        hr: () => <hr className="my-6 border-gray-300 dark:border-gray-600" />,
        // 链接样式
        a: ({ href, children }) => (
          <a href={href} className="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        ),
        // 强调样式
        strong: ({ children }) => <strong className="font-bold text-gray-900 dark:text-gray-100">{children}</strong>,
        em: ({ children }) => <em className="italic text-gray-700 dark:text-gray-300">{children}</em>,
      }}
    >
      {content}
    </ReactMarkdown>
  )

  return (
    <div className="max-w-4xl h-full overflow-y-auto px-6 py-4">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
        {title}
      </h1>

      {/* 概念 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">📖</span>
          概念讲解
        </h2>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <MarkdownRenderer content={concept} />
        </div>
      </section>

      {/* 应用场景 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm">🎯</span>
          应用场景
        </h2>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <MarkdownRenderer content={scenario} />
        </div>
      </section>

      {/* 示例代码 */}
      {topicData.code && topicData.code.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm">💻</span>
            示例代码
          </h2>
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            在下方编辑器中可以修改并运行这段代码
          </div>
        </section>
      )}

      {/* 练习题 */}
      {exercise && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm">✏️</span>
            拓展练习
          </h2>

          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">任务描述</h3>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{exercise.description}</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setShowExercise(!showExercise)}
              className="w-full text-left px-4 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center justify-between"
            >
              <span className="font-medium text-gray-900 dark:text-gray-100">查看练习题代码模板</span>
              <span className="text-gray-500">{showExercise ? '▲' : '▼'}</span>
            </button>

            {showExercise && (
              <>
                {(exercise.starterCode || exercise.starterCodeHtml || exercise.starterCodeCss) && (
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono">
                    <code>{exercise.starterCode || exercise.starterCodeHtml || '// 请编写代码'}</code>
                  </pre>
                )}

                <div className="space-y-2">
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    {showHint ? '隐藏提示' : '显示提示'}
                  </button>
                  <button
                    onClick={() => setShowSolution(!showSolution)}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                  >
                    {showSolution ? '隐藏答案' : '查看答案'}
                  </button>
                  {onLoadExerciseCode && (
                    <button
                      onClick={onLoadExerciseCode}
                      className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
                    >
                      加载到编辑器
                    </button>
                  )}
                </div>

                {showHint && exercise.hint && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">💡 提示</h4>
                    <p className="text-blue-700 dark:text-blue-400 whitespace-pre-line">{exercise.hint}</p>
                  </div>
                )}

                {showSolution && exercise.solution && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">✅ 参考答案</h4>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto text-sm font-mono">
                      <code>{exercise.solution}</code>
                    </pre>
                  </div>
                )}
              </>
            )}
          </div>

          {/* 验证按钮和结果 */}
          {onVerifyExercise && (
            <div className="mt-4 space-y-3">
              <button
                onClick={handleVerify}
                disabled={isVerifying}
                className="w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
              >
                {isVerifying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    验证中...
                  </>
                ) : (
                  <>
                    <span>✓</span>
                    提交验证
                  </>
                )}
              </button>

              {verifyResult && (
                <div className={`p-4 rounded-lg border ${
                  verifyResult.passed
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                }`}>
                  <h4 className={`font-semibold mb-2 ${
                    verifyResult.passed
                      ? 'text-green-800 dark:text-green-300'
                      : 'text-red-800 dark:text-red-300'
                  }`}>
                    {verifyResult.passed ? '🎉 验证通过' : '❌ 验证失败'}
                  </h4>
                  <pre className="text-sm whitespace-pre-wrap font-mono">
                    {verifyResult.message}
                  </pre>
                </div>
              )}
            </div>
          )}
        </section>
      )}
    </div>
  )
}

export default DocumentViewer
