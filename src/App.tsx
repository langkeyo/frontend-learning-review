import React, {
  useEffect,
  useCallback,
  useState,
  memo,
  lazy,
  Suspense
} from 'react'
import { useAppStore } from '@/stores/useAppStore'
import { fileSystemService } from '@/services/fileSystemService'
import Toolbar from '@/components/Toolbar'
import StatusBar from '@/components/StatusBar'
import LoadingSpinner from '@/components/LoadingSpinner'
import ErrorBoundary from '@/components/ErrorBoundary'

// 动态导入组件以优化bundle大小 (bundle-dynamic-imports规则)
const FileExplorer = lazy(() => import('@/components/FileExplorer'))
const Editor = lazy(() => import('@/components/Editor'))
const Terminal = lazy(() => import('@/components/Terminal'))
const LearningPanel = lazy(() => import('@/components/LearningPanel'))
const SettingsPanel = lazy(() => import('@/components/SettingsPanel'))

// 记忆化的文件图标组件
const FileIcon = memo(({ language }: { language: string }) => {
  const iconMap: Record<string, string> = {
    javascript: 'JS',
    typescript: 'TS',
    html: '<>',
    css: '#',
    json: '{}',
    markdown: 'MD',
    plaintext: 'txt'
  }

  return <span>{iconMap[language] || '📄'}</span>
})

FileIcon.displayName = 'FileIcon'

// 记忆化的编辑器标签页组件
const EditorTab = memo(
  ({
    file,
    isActive,
    onTabClick,
    onTabClose
  }: {
    file: {
      id: string
      name: string
      language: string
      isDirty: boolean
    }
    isActive: boolean
    onTabClick: (fileId: string) => void
    onTabClose: (fileId: string, e: React.MouseEvent) => void
  }) => {
    return (
      <button
        className={`
        flex items-center gap-2 px-3 py-2 text-sm border-r border-editor-border min-w-[120px] max-w-[200px]
        ${
          isActive
            ? 'bg-editor-bg text-white border-t-2 border-t-blue-500'
            : 'bg-editor-sidebar text-gray-400 hover:bg-gray-800'
        }
      `}
        onClick={() => onTabClick(file.id)}
      >
        <FileIcon language={file.language} />
        <span className="truncate flex-1 text-left">{file.name}</span>
        {file.isDirty && (
          <span className="w-2 h-2 rounded-full bg-yellow-500 mr-1" />
        )}
        <span
          className="hover:bg-gray-700 rounded p-0.5 cursor-pointer"
          onClick={(e) => onTabClose(file.id, e)}
        >
          ×
        </span>
      </button>
    )
  }
)

EditorTab.displayName = 'EditorTab'

// 记忆化的空状态组件
const EmptyState = memo(() => {
  return (
    <div className="absolute inset-0 flex items-center justify-center text-gray-500 select-none">
      <div className="text-center">
        <div className="text-4xl mb-4 opacity-50">⚛️</div>
        <div className="text-xl font-medium mb-2">FrontendMaster</div>
        <div className="text-sm opacity-70">
          使用 <span className="keyboard-shortcut">Ctrl+P</span> 快速搜索文件
        </div>
      </div>
    </div>
  )
})

EmptyState.displayName = 'EmptyState'

/**
 * 主应用组件
 */
const App: React.FC = () => {
  // 获取store实例
  const store = useAppStore() as any

  // 使用解构赋值获取store状态和方法
  const {
    setFileSystem,
    setLoading,
    setError,
    clearError,
    setActiveFile,
    closeFile,
    editor,
    terminal,
    learningPath,
    sidebarWidth,
    isDarkMode,
    isLoading,
    error
  } = store

  // 新增：本地状态，仅用于控制应用首次启动时的白屏/Loading
  const [isInitializing, setIsInitializing] = useState(true)

  // 设置面板状态
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  // 创建默认项目结构
  const createDefaultProjectStructure = useCallback(async () => {
    const structure = [
      {
        name: 'src',
        type: 'directory' as const,
        path: '/src',
        isDirectory: true
      },
      {
        name: 'index.html',
        type: 'file' as const,
        path: '/index.html',
        content: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FrontendMaster 项目</title>
</head>
<body>
  <div id="root"></div>
  <script src="src/index.js"></script>
</body>
</html>`,
        isDirectory: false
      },
      {
        name: 'README.md',
        type: 'file' as const,
        path: '/README.md',
        content: `# FrontendMaster 项目

欢迎来到前端工程化复习平台！

## 项目结构
- \`src/\` - 源代码目录
- \`index.html\` - 入口HTML文件

## 开始学习
1. 在左侧文件浏览器中查看文件
2. 点击文件在编辑器中打开
3. 使用终端运行命令
4. 在右侧学习面板中查看课程
`,
        isDirectory: false
      }
    ]

    for (const file of structure) {
      await fileSystemService.createFile(
        file.path,
        file.content || '',
        file.isDirectory
      )
    }

    return await fileSystemService.getFileTree()
  }, [])

  // 初始化文件系统
  useEffect(() => {
    const initializeFileSystem = async () => {
      try {
        // 这里不要设置全局 setLoading，避免触发不必要的渲染震荡
        // setLoading(true)

        await fileSystemService.init()

        const defaultFiles = await fileSystemService.getFileTree()

        if (defaultFiles.length === 0) {
          const updatedFiles = await createDefaultProjectStructure()
          setFileSystem(updatedFiles)
        } else {
          setFileSystem(defaultFiles)
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to initialize file system'
        )
      } finally {
        // 初始化完成，关闭首屏 Loading
        setIsInitializing(false)
        setLoading(false)
      }
    }

    initializeFileSystem()
  }, [])

  // 切换活动文件
  const handleTabClick = useCallback(
    (fileId: string) => {
      setActiveFile(fileId)
    },
    [setActiveFile]
  )

  // 关闭文件
  const handleTabClose = useCallback(
    (fileId: string, e: React.MouseEvent) => {
      e.stopPropagation()
      closeFile(fileId)
    },
    [closeFile]
  )

  // 处理全局错误
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      setError(event.error?.message || 'An unexpected error occurred')
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      setError(event.reason?.message || 'A promise was rejected')
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [setError])

  // 修复点：这里只判断 isInitializing，不再判断 isLoading
  // 这样当 FileExplorer 内部触发 setLoading(true) 时，App 不会被卸载，UI 依然存在
  if (isInitializing) {
    return <LoadingSpinner />
  }

  // 渲染主界面
  return (
    <ErrorBoundary>
      <div
        className={`flex h-screen w-screen ${isDarkMode ? 'dark' : ''} text-gray-300`}
      >
        {/* 如果需要全局 Loading 遮罩，可以放在这里，覆盖在内容之上，而不是替换内容 */}
        {isLoading && (
          <div
            className="fixed top-0 left-0 w-full h-1 bg-blue-500 z-50 animate-pulse"
            title="Loading..."
          />
        )}

        {/* 侧边栏 - 文件浏览器 */}
        <div
          className="flex flex-col bg-editor-sidebar border-r border-editor-border shrink-0"
          style={{
            width: `${sidebarWidth}px`,
            minWidth: '200px', // 调整稍微小一点的最小宽度
            maxWidth: '400px'
          }}
        >
          <Toolbar />
          <div className="flex-1 overflow-hidden relative">
            {/* 
                App 已经负责了初始化加载，FileExplorer 挂载后会根据搜索词再次加载。
                现在因为 App 不会卸载 FileExplorer，所以流程可以跑通。
             */}
            <Suspense fallback={<LoadingSpinner />}>
              <FileExplorer />
            </Suspense>
          </div>
        </div>

        {/* 主编辑器区域 */}
        <div className="flex-1 flex flex-col bg-editor-bg min-w-0">
          {/* 编辑器标签页 */}
          <div className="editor-tabs shrink-0 flex overflow-x-auto bg-editor-sidebar border-b border-editor-border">
            {editor.openFiles.length === 0 ? (
              <div className="px-4 py-2 text-gray-500 text-sm italic select-none">
                无打开文件
              </div>
            ) : (
              editor.openFiles.map((file: any) => (
                <EditorTab
                  key={file.id}
                  file={file}
                  isActive={file.id === editor.activeFileId}
                  onTabClick={handleTabClick}
                  onTabClose={handleTabClose}
                />
              ))
            )}
          </div>

          {/* 编辑器内容 */}
          <div className="flex-1 min-h-0 relative">
            {editor.activeFileId ? (
              <Suspense fallback={<LoadingSpinner />}>
                <Editor />
              </Suspense>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-500 select-none">
                <div className="text-center">
                  <div className="text-4xl mb-4 opacity-50">⚛️</div>
                  <div className="text-xl font-medium mb-2">FrontendMaster</div>
                  <div className="text-sm opacity-70">
                    使用 <span className="keyboard-shortcut">Ctrl+P</span>{' '}
                    快速搜索文件
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 终端 */}
          {terminal.isVisible && (
            <div
              className="terminal-container border-t border-editor-border shrink-0 bg-black"
              style={{ height: `${terminal.size.height}px` }}
            >
              <Suspense fallback={<LoadingSpinner />}>
                <Terminal />
              </Suspense>
            </div>
          )}
        </div>

        {/* 学习面板 */}
        {learningPath && (
          <div className="w-80 bg-white dark:bg-editor-sidebar border-l border-editor-border shrink-0 overflow-y-auto">
            <Suspense fallback={<LoadingSpinner />}>
              <LearningPanel />
            </Suspense>
          </div>
        )}

        {/* 错误提示 */}
        {error && (
          <div className="fixed top-4 right-4 bg-red-900 border border-red-700 text-white px-4 py-3 rounded shadow-lg z-50 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium">{error}</span>
              <button
                className="text-gray-300 hover:text-white"
                onClick={clearError}
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* 设置面板 */}
        <Suspense fallback={null}>
          <SettingsPanel
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
          />
        </Suspense>

        {/* 状态栏 */}
        <StatusBar />
      </div>
    </ErrorBoundary>
  )
}

export default App
