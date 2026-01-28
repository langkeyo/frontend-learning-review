import React, { useCallback, useEffect, memo } from 'react'
import MonacoEditor from './MonacoEditor'
import { useAppStore } from '@/stores/useAppStore'
import { fileSystemService } from '@/services/fileSystemService'

/**
 * 编辑器容器组件
 * 管理多标签页和 Monaco Editor 实例
 * 应用React.memo优化重渲染 (rerender-memo规则)
 */
const Editor: React.FC = () => {
  const { 
    editor, 
    saveFile, 
    setEditor 
  } = useAppStore()

  const activeFile = editor.openFiles.find(f => f.id === editor.activeFileId)

  // 处理内容变化 - 优化依赖项 (rerender-dependencies规则)
  const handleContentChange = useCallback((content: string) => {
    if (!activeFile || content === activeFile.content) return
    
    // 直接调用store方法，避免类型问题
    const currentFiles = editor.openFiles
    const updatedFiles = currentFiles.map(file =>
      file.id === activeFile.id
        ? { ...file, content, isDirty: true }
        : file
    )
    
    setEditor({ openFiles: updatedFiles })
  }, [activeFile?.id, activeFile?.content, editor.openFiles, setEditor])

  // 处理保存
  const handleSave = useCallback(async () => {
    if (!activeFile) return

    try {
      const file = await fileSystemService.readFile(activeFile.id)
      if (file) {
        await fileSystemService.updateFile(file.path, activeFile.content)
      }
      
      // 更新文件系统中的文件大小
      // setFileSystem(...)
      
      // 标记为已保存
      saveFile(activeFile.id)
      
      // 显示保存成功提示
      showSaveNotification()
    } catch (error) {
      console.error('Failed to save file:', error)
      showSaveError(error)
    }
  }, [activeFile, saveFile])

  // 处理光标位置变化
  const handleCursorPositionChange = useCallback((position: { line: number; column: number }) => {
    setEditor({ cursorPosition: position })
  }, [setEditor])

  // 显示保存成功通知
  const showSaveNotification = () => {
    // 创建临时通知元素
    const notification = document.createElement('div')
    notification.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-3 py-1 rounded text-sm z-50'
    notification.textContent = '✓ 文件已保存'
    document.body.appendChild(notification)
    
    // 3秒后自动消失
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification)
      }
    }, 2000)
  }

  // 监听保存事件
  useEffect(() => {
    const handleSaveEvent = () => {
      if (activeFile) {
        handleSave()
      }
    }

    window.addEventListener('save-active-file', handleSaveEvent)
    return () => {
      window.removeEventListener('save-active-file', handleSaveEvent)
    }
  }, [activeFile, handleSave])

  // 显示保存错误通知
  const showSaveError = (error: any) => {
    const notification = document.createElement('div')
    notification.className = 'fixed bottom-4 right-4 bg-red-500 text-white px-3 py-1 rounded text-sm z-50'
    notification.textContent = `✗ 保存失败: ${error.message || '未知错误'}`
    document.body.appendChild(notification)
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification)
      }
    }, 3000)
  }

  if (!activeFile) {
    return <EmptyEditorState />
  }

  return (
    <div className="h-full w-full">
      <MonacoEditor
        fileId={activeFile.id}
        value={activeFile.content}
        language={activeFile.language}
        theme="vs-dark"
        onChange={handleContentChange}
        onSave={handleSave}
        onCursorPositionChange={handleCursorPositionChange}
      />
    </div>
  )
}

/**
 * 空状态编辑器提示 - 静态JSX提取到组件外部 (rendering-hoist-jsx)
 */
const EmptyEditorState = () => (
  <div className="h-full w-full flex items-center justify-center text-gray-500">
    <div className="text-center">
      <div className="text-4xl mb-4">📝</div>
      <div className="text-xl mb-2">选择一个文件开始编辑</div>
      <div className="text-sm text-gray-400">
        在左侧文件浏览器中点击文件，或在工具栏创建新文件
      </div>
    </div>
  </div>
)

export default memo(Editor)