import React, { useEffect, useRef } from 'react'

export interface ExecutionResult {
  output?: string
  html?: string
  css?: string
  js?: string
  error?: string
}

interface CodeExecutorProps {
  result: ExecutionResult | null
}

const CodeExecutor: React.FC<CodeExecutorProps> = ({ result }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // 当 HTML/CSS/JS 变化时，渲染到 iframe
  useEffect(() => {
    if (!result || !iframeRef.current) return

    // 如果有 HTML、CSS 或 JS 内容，渲染到 iframe
    if (result.html || result.css || result.js) {
      const iframe = iframeRef.current
      const doc = iframe.contentDocument || iframe.contentWindow?.document

      if (doc) {
        let htmlContent = result.html || '<div class="container"></div>'

        // 插入 CSS
        if (result.css) {
          htmlContent = htmlContent.replace(
            '<head>',
            `<head><style>${result.css}</style>`
          )
        }

        // 插入 JS
        if (result.js) {
          htmlContent = htmlContent.replace(
            '</body>',
            `<script>${result.js}<\/script></body>`
          )
        }

        // 确保 HTML 有完整的 head/body 结构
        if (!htmlContent.includes('<html')) {
          htmlContent = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>${htmlContent}</body></html>`
        }

        doc.open()
        doc.write(htmlContent)
        doc.close()
      }
    }
  }, [result])

  if (!result) {
    return (
      <div className="text-gray-400 italic">
        点击"运行"按钮查看执行结果...
      </div>
    )
  }

  if (result.error) {
    return (
      <div>
        <div className="text-red-600 font-semibold mb-2">❌ 执行错误</div>
        <pre className="text-red-500 text-sm whitespace-pre-wrap">
          {result.error}
        </pre>
      </div>
    )
  }

  // 如果有 HTML/CSS/JS，显示渲染结果
  const hasVisualContent = result.html || result.css

  return (
    <div className="flex flex-col h-full">
      {/* 渲染结果区域 */}
      {hasVisualContent ? (
        <div className="flex-1 border border-gray-300 dark:border-gray-600 rounded overflow-hidden">
          <iframe
            ref={iframeRef}
            className="w-full h-full bg-white"
            title="Preview"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      ) : null}

      {/* 控制台输出区域 */}
      <div className={`${hasVisualContent ? 'h-1/3 border-t border-gray-200 dark:border-gray-700' : 'flex-1'} overflow-y-auto`}>
        {result.output ? (
          <div>
            <div className="text-green-600 font-semibold mb-2 text-sm">✅ 控制台输出</div>
            <pre className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 text-sm font-mono">
              {result.output}
            </pre>
          </div>
        ) : (
          <div className="text-gray-400 italic text-sm">
            {hasVisualContent ? '无控制台输出' : '点击"运行"按钮查看执行结果...'}
          </div>
        )}
      </div>
    </div>
  )
}

export default CodeExecutor
