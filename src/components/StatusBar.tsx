import React, { useState, useEffect } from 'react'
import { GitBranch, AlertCircle, CheckCircle, Clock, Terminal } from 'lucide-react'
import { useAppStore } from '@/stores/useAppStore'

/**
 * 状态栏组件
 * 显示应用状态信息
 */
const StatusBar: React.FC = () => {
  const editor = useAppStore((state) => (state as any).editor)
  const isDarkMode = useAppStore((state) => (state as any).isDarkMode)
  const terminal = useAppStore((state) => (state as any).terminal)
  
  const [currentTime, setCurrentTime] = useState(new Date())
  const [problems] = useState({ errors: 0, warnings: 0 })
  const [gitBranch] = useState('main')
  const [selectedEncoding] = useState('UTF-8')
  const [selectedLineEnding] = useState('LF')

  const activeFile = editor.openFiles?.find((f: any) => f.id === editor.activeFileId)
  const cursorPosition = editor.cursorPosition

  // 更新时间
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="status-bar bg-gray-200 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700 px-2 py-1 flex items-center justify-between text-xs">
      <div className="flex items-center gap-4">
        {/* 文件信息 */}
        {activeFile ? (
          <>
            <span className="flex items-center gap-2">
              <span>{getFileIcon(activeFile.language)}</span>
              <span className="truncate max-w-32">{activeFile.name}</span>
              {activeFile.isDirty && <span className="text-yellow-500 text-xs">●</span>}
            </span>
            
            {/* 光标位置 */}
            {cursorPosition && (
              <span className="text-gray-600 dark:text-gray-400">
                Ln {cursorPosition.line}, Col {cursorPosition.column}
              </span>
            )}
            
            <div className="w-px h-3 bg-gray-400 dark:bg-gray-600" />
            
            {/* 文件语言和编码 */}
            <span className="text-gray-600 dark:text-gray-400">
              {activeFile.language.toUpperCase()}
            </span>
            
            <span className="text-gray-600 dark:text-gray-400">
              {selectedEncoding}
            </span>
            
            <span className="text-gray-600 dark:text-gray-400">
              {selectedLineEnding}
            </span>
          </>
        ) : (
          <span className="text-gray-500 dark:text-gray-400">无活动文件</span>
        )}
      </div>
      
      <div className="flex items-center gap-4">
        {/* 问题/错误数量 */}
        <div className="flex items-center gap-2">
          {problems.errors > 0 && (
            <span className="flex items-center gap-1 text-red-500">
              <AlertCircle size={12} />
              {problems.errors}
            </span>
          )}
          {problems.warnings > 0 && (
            <span className="flex items-center gap-1 text-yellow-500">
              <AlertCircle size={12} />
              {problems.warnings}
            </span>
          )}
          {problems.errors === 0 && problems.warnings === 0 && (
            <span className="flex items-center gap-1 text-green-500">
              <CheckCircle size={12} />
              0
            </span>
          )}
        </div>
        
        {/* Git 分支信息 */}
        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <GitBranch size={12} />
          {gitBranch}
        </span>
        
        {/* 终端状态 */}
        {terminal?.isVisible && (
          <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
            <Terminal size={12} />
            终端
          </span>
        )}
        
        <div className="w-px h-3 bg-gray-400 dark:bg-gray-600" />
        
        {/* 主题信息 */}
        <span className="text-gray-600 dark:text-gray-400">
          {isDarkMode ? '🌙 Dark' : '☀️ Light'}
        </span>
        
        {/* 当前时间 */}
        <span className="text-gray-600 dark:text-gray-400">
          <Clock size={12} className="inline mr-1" />
          {currentTime.toLocaleTimeString()}
        </span>
      </div>
    </div>
  )
}

/**
 * 根据语言获取文件图标
 */
const getFileIcon = (language: string): string => {
  const iconMap: Record<string, string> = {
    javascript: '🟨',
    typescript: '🟦',
    html: '🌐',
    css: '🎨',
    json: '📋',
    markdown: '📝',
    plaintext: '📄',
  }

  return iconMap[language] || '📄'
}

export default StatusBar