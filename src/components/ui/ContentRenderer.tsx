import React, { useState } from 'react'

interface ContentRendererProps {
  content: string
  type?: 'html' | 'plain'
  className?: string
}

const ContentRenderer: React.FC<ContentRendererProps> = ({
  content,
  type = 'html',
  className = ''
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  // 处理代码复制
  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCode(code)
      setTimeout(() => setCopiedCode(null), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  // 处理HTML内容渲染，增强代码高亮
  const processHTML = (html: string) => {
    return html
      // 处理代码块
      .replace(/<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g, (match, language, code) => {
        const codeId = Math.random().toString(36).substr(2, 9)
        const isCopied = copiedCode === code.trim()
        return `
          <div class="code-block relative group">
            <div class="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onclick="navigator.clipboard.writeText(\`${code.replace(/`/g, '\\`')}\`).then(() => this.textContent = '✓ 已复制')"
                class="px-2 py-1 text-xs bg-gray-700 text-white rounded hover:bg-gray-600"
              >
                ${isCopied ? '✓ 已复制' : '📋 复制'}
              </button>
            </div>
            <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code class="language-${language}">${code}</code></pre>
          </div>
        `
      })
      // 处理内联代码
      .replace(/<code>(.*?)<\/code>/g, '<span class="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-sm">$1</span>')
      // 处理提示框
      .replace(/<blockquote><p>(⚠️|💡|✅)(.*?)<\/p><\/blockquote>/g, (match, icon, text) => {
        const alertType = icon === '⚠️' ? 'warning' : icon === '💡' ? 'info' : 'success'
        const alertStyles = {
          warning: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-300',
          info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300',
          success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300'
        }
        return `<div class="border-l-4 p-4 my-4 rounded-r-lg ${alertStyles[alertType]}">${icon} ${text}</div>`
      })
      // 处理表格
      .replace(/<table>/g, '<div class="overflow-x-auto my-4"><table class="min-w-full border-collapse border border-gray-300 dark:border-gray-600">')
      .replace(/<\/table>/g, '</table></div>')
      .replace(/<th/g, '<th class="border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 px-4 py-2 text-left font-semibold"')
      .replace(/<td/g, '<td class="border border-gray-300 dark:border-gray-600 px-4 py-2"')
      // 处理图片
      .replace(/<img/g, '<img class="w-full max-w-2xl rounded-lg shadow-lg my-4" loading="lazy"')
      // 处理视频
      .replace(/<video/g, '<video class="w-full max-w-2xl rounded-lg shadow-lg my-4" controls preload="metadata"')
  }

  const renderContent = () => {
    switch (type) {
      case 'html':
        return (
          <div
            className={`prose prose-sm max-w-none ${className}`}
            dangerouslySetInnerHTML={{ __html: processHTML(content) }}
          />
        )
      case 'plain':
        return (
          <div className={`text-sm whitespace-pre-wrap ${className}`}>
            {content}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="content-renderer">
      {renderContent()}
    </div>
  )
}

export default ContentRenderer