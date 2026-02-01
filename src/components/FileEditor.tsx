import React, { useState, useCallback } from 'react'
import { RotateCcw, Save } from 'lucide-react'
import MonacoEditor from '@/components/MonacoEditor'

export interface FileData {
  id: string
  name: string
  language: string
  content: string
  isModified?: boolean
}

export const DEFAULT_FILES: Record<string, FileData[]> = {
  html: [
    { id: 'html', name: 'index.html', language: 'html', content: '' },
    { id: 'css', name: 'style.css', language: 'css', content: '' },
    { id: 'js', name: 'script.js', language: 'javascript', content: '' }
  ],
  javascript: [
    { id: 'js', name: 'script.js', language: 'javascript', content: '' }
  ],
  css: [
    { id: 'css', name: 'style.css', language: 'css', content: '' },
    { id: 'html', name: 'index.html', language: 'html', content: '' }
  ]
}

interface FileEditorProps {
  files: FileData[]
  activeFileId?: string
  theme?: string
  onFileChange?: (fileId: string, content: string) => void
  onActiveFileChange?: (fileId: string) => void
  onResetFiles?: () => void
  onFileSave?: () => void
}

const FileEditor: React.FC<FileEditorProps> = ({
  files,
  activeFileId = files[0]?.id,
  theme = 'vs-dark',
  onFileChange,
  onActiveFileChange,
  onResetFiles,
  onFileSave
}) => {
  // 使用 useMemo 避免频繁重新计算
  const activeFile = React.useMemo(() => {
    const found = files.find(f => f.id === activeFileId)
    return found || files[0]
  }, [files, activeFileId])

  const hasAnyModified = files.some(f => f.isModified)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle')

  // 调试日志
  console.log('[FileEditor] Render, activeFileId:', activeFileId, 'files length:', files.length)
  console.log('[FileEditor] activeFile:', activeFile ? { id: activeFile.id, name: activeFile.name, contentLength: activeFile.content.length, 'content preview': activeFile.content.substring(0, 100) } : 'null')

  const handleCodeChange = useCallback((content: string) => {
    onFileChange?.(activeFile.id, content)
  }, [activeFile.id, onFileChange])

  const handleSave = useCallback(() => {
    setSaveStatus('saved')
    onFileSave?.()
    setTimeout(() => setSaveStatus('idle'), 1500)
  }, [onFileSave])

  return (
    <div className="flex flex-col h-full">
      {/* Tab 标签栏 */}
      <div className="flex bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 overflow-x-auto shrink-0">
        {files.map((file) => (
          <button
            key={file.id}
            onClick={() => onActiveFileChange?.(file.id)}
            className={`
              px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2
              ${file.id === activeFileId
                ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 border-t-2 border-blue-500'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }
            `}
          >
            {file.name}
            {file.isModified && (
              <span className="w-2 h-2 bg-orange-500 rounded-full" title="已修改" />
            )}
          </button>
        ))}

        {/* 重置按钮 */}
        {hasAnyModified && (
          <button
            onClick={onResetFiles}
            className="ml-auto px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center gap-1 transition-colors"
            title="重置为初始代码"
          >
            <RotateCcw size={14} />
            重置
          </button>
        )}
      </div>

      {/* 编辑器区域 */}
      <div className="flex-1 overflow-hidden relative">
        <MonacoEditor
          key={activeFile.id}
          fileId={activeFile.id}
          value={activeFile.content}
          language={activeFile.language}
          theme={theme}
          onChange={handleCodeChange}
          onSave={handleSave}
        />

        {/* 保存状态提示 */}
        {saveStatus === 'saved' && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded text-sm flex items-center gap-1 shadow-lg">
            <Save size={14} />
            已保存
          </div>
        )}
      </div>

      {/* 底部提示信息 */}
      <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
        <span>
          {hasAnyModified ? (
            <span className="text-orange-600 dark:text-orange-400">代码已修改，按 Ctrl+S 保存后点击"运行"</span>
          ) : (
            <span>按 Ctrl+S 保存代码，然后点击"运行"查看效果</span>
          )}
        </span>
      </div>
    </div>
  )
}

export default FileEditor
