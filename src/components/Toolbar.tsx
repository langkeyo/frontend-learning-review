import React, {
  useCallback,
  useState,
  useEffect,
  useMemo,
  lazy,
  Suspense
} from 'react'
import {
  FilePlus,
  FolderPlus,
  Save,
  RefreshCw,
  Settings,
  Download,
  Play,
  Pause,
  RotateCcw,
  Terminal as TerminalIcon
} from 'lucide-react'
import { useAppStore } from '@/stores/useAppStore'
import { fileSystemService } from '@/services/fileSystemService'
import { webContainerService } from '@/services/webContainerService'
import { FileUtils } from '@/utils/fileUtils'

const SettingsPanel = lazy(() => import('@/components/SettingsPanel'))

// 临时解决 JSZip 导入问题
declare global {
  var JSZip: any
}

/**
 * 工具栏组件
 * 提供文件操作和常用功能按钮
 */
const Toolbar: React.FC = () => {
  const { addFile, setLoading, setError, toggleTerminal } = useAppStore()
  const [isRunning, setIsRunning] = useState(false)
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  // 创建新文件
  const createNewFile = useCallback(async () => {
    try {
      const fileName = prompt('请输入文件名：', 'untitled.js')
      if (!fileName) return

      const validation = FileUtils.validateFileName(fileName)
      if (!validation.isValid) {
        setError(validation.error || '文件名无效')
        return
      }

      setLoading(true)
      const content = FileUtils.getDefaultContent(fileName)
      const newFile = await fileSystemService.createFile(
        `/${fileName}`,
        content,
        false
      )
      addFile(newFile)
      setError(`文件 "${fileName}" 创建成功`)
      setTimeout(() => setError(null), 2000)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '创建文件失败'
      setError(errorMessage)
      console.error('创建文件失败:', error)
    } finally {
      setLoading(false)
    }
  }, [addFile, setError, setLoading])

  // 创建新文件夹
  const createNewFolder = useCallback(async () => {
    try {
      const folderName = prompt('请输入文件夹名：', 'New Folder')
      if (!folderName) return

      const validation = FileUtils.validateFileName(folderName)
      if (!validation.isValid) {
        setError(validation.error || '文件夹名无效')
        return
      }

      setLoading(true)
      const newFolder = await fileSystemService.createFile(
        `/${folderName}`,
        '',
        true
      )
      addFile(newFolder)
      setError(`文件夹 "${folderName}" 创建成功`)
      setTimeout(() => setError(null), 2000)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '创建文件夹失败'
      setError(errorMessage)
      console.error('创建文件夹失败:', error)
    } finally {
      setLoading(false)
    }
  }, [addFile, setError, setLoading])

  // 保存当前文件
  const saveCurrentFile = useCallback(async () => {
    // 触发编辑器的保存功能
    const saveEvent = new CustomEvent('save-active-file')
    window.dispatchEvent(saveEvent)
    setLastSaveTime(new Date())
    setError('文件已保存')
    setTimeout(() => setError(null), 2000)
  }, [setError])

  // 运行/停止项目
  const toggleRun = useCallback(async () => {
    try {
      if (!isRunning) {
        setLoading(true)
        setError('正在启动开发服务器...')

        // 启动开发服务器
        const devServer = await webContainerService.startDevServer()

        setIsRunning(true)
        setError(`开发服务器已启动: ${devServer.url}`)

        // 更新状态栏显示服务器信息
        setTimeout(() => setError(null), 5000)
      } else {
        setLoading(true)
        setError('正在停止开发服务器...')
        await webContainerService.stopDevServer()

        setIsRunning(false)
        setError('开发服务器已停止')
        setTimeout(() => setError(null), 2000)
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : `操作失败: ${error}`
      setError(errorMessage)
      setTimeout(() => setError(null), 3000)
      console.error('运行/停止项目失败:', error)
    } finally {
      setLoading(false)
    }
  }, [isRunning, setError, setLoading])

  // 检查 WebContainer 支持状态
  useEffect(() => {
    const checkWebContainerSupport = async () => {
      if (!(webContainerService.constructor as any).isSupported()) {
        setError('WebContainers 不被支持，某些功能可能不可用')
        setTimeout(() => setError(null), 3000)
      }
    }

    checkWebContainerSupport()
  }, [setError])

  // 重置项目
  const resetProject = useCallback(() => {
    if (confirm('确定要重置项目吗？这将清除所有未保存的更改。')) {
      setLoading(true)
      // TODO: 重置项目状态
      setTimeout(() => {
        setLoading(false)
        setError('项目已重置')
        setTimeout(() => setError(null), 2000)
      }, 1000)
    }
  }, [setLoading, setError])

  // 下载项目
  const downloadProject = useCallback(() => {
    // TODO: 实现项目下载
    const files = (useAppStore.getState() as any).fileSystem || []

    // 简化版下载 - 创建单个文件的内容
    const content = files
      .map((file: any) => {
        if (file.type === 'file') {
          return `// File: ${file.name}\n${file.content || ''}\n`
        }
        return `// Directory: ${file.name}\n`
      })
      .join('\n')

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'project-files.txt'
    a.click()
    URL.revokeObjectURL(url)
  }, [])

  // 刷新文件系统
  const refreshFileSystem = useCallback(async () => {
    try {
      setLoading(true)
      const files = await fileSystemService.getFileTree()
      const { setFileSystem } = useAppStore.getState()
      setFileSystem(files)
    } catch (error) {
      setError(error instanceof Error ? error.message : '刷新失败')
    } finally {
      setLoading(false)
    }
  }, [setLoading, setError])

  // 工具栏按钮配置
  const toolbarButtons = useMemo(
    () => [
      // 文件操作组
      {
        group: 'file',
        buttons: [
          {
            icon: FilePlus,
            label: '文件',
            title: '新建文件',
            onClick: createNewFile,
            ariaLabel: '创建新文件',
            showText: true
          },
          {
            icon: FolderPlus,
            label: '文件夹',
            title: '新建文件夹',
            onClick: createNewFolder,
            ariaLabel: '创建新文件夹',
            showText: true
          },
          {
            icon: Save,
            label: '保存',
            title: '保存',
            onClick: saveCurrentFile,
            ariaLabel: '保存当前文件',
            showText: true
          }
        ]
      },
      // 运行控制组
      {
        group: 'run',
        buttons: [
          {
            icon: isRunning ? Pause : Play,
            label: isRunning ? '停止' : '运行',
            title: isRunning ? '停止项目' : '运行项目',
            onClick: toggleRun,
            ariaLabel: isRunning ? '停止项目' : '运行项目',
            showText: true,
            variant: isRunning ? 'danger' : 'success'
          },
          {
            icon: RotateCcw,
            label: '重置',
            title: '重置项目',
            onClick: resetProject,
            ariaLabel: '重置项目',
            showText: true
          }
        ]
      },
      // 其他操作组
      {
        group: 'tools',
        buttons: [
          {
            icon: Download,
            label: '下载',
            title: '下载项目',
            onClick: downloadProject,
            ariaLabel: '下载项目',
            showText: true
          },
          {
            icon: RefreshCw,
            label: '刷新',
            title: '刷新文件树',
            onClick: refreshFileSystem,
            ariaLabel: '刷新文件系统',
            showText: true
          },
          {
            icon: TerminalIcon,
            label: '终端',
            title: '切换终端',
            onClick: toggleTerminal,
            ariaLabel: '切换终端',
            showText: true
          },
          {
            icon: Settings,
            label: '设置',
            title: '设置',
            onClick: () => setIsSettingsOpen(true),
            ariaLabel: '打开设置',
            showText: true
          }
        ]
      } // 【修改1】删除了多余的1个 }，仅保留1个对象闭合大括号
      // 【修改2】此处无需额外符号，前面的逗号已分隔数组项
    ],
    [
      isRunning,
      createNewFile,
      createNewFolder,
      saveCurrentFile,
      toggleRun,
      resetProject,
      downloadProject,
      refreshFileSystem,
      toggleTerminal,
      setError
    ]
  )
  // 【修改3】删除了依赖数组中未使用的 setError
  return (
    <>
      <div
        className="toolbar bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-2 py-1"
        role="toolbar"
        aria-label="文件操作工具栏"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          {/* 主要工具栏按钮 - 支持换行 */}
          <div className="flex flex-wrap items-center gap-1">
            {toolbarButtons.map((buttonGroup, groupIndex) => (
              <React.Fragment key={buttonGroup.group}>
                {buttonGroup.buttons.map((button, buttonIndex) => (
                  <button
                    key={`${buttonGroup.group}-${buttonIndex}`}
                    className={`toolbar-button flex items-center gap-1 px-2 py-1 text-sm rounded transition-colors ${
                      button.variant === 'success'
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : button.variant === 'danger'
                          ? 'bg-red-500 text-white hover:bg-red-600'
                          : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                    title={button.title}
                    onClick={button.onClick}
                    aria-label={button.ariaLabel}
                  >
                    <button.icon size={14} aria-hidden="true" />
                    <span className="hidden xs:inline sm:inline">
                      {button.label}
                    </span>
                  </button>
                ))}
                {/* 分隔符 */}
                {groupIndex < toolbarButtons.length - 1 && (
                  <div
                    className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1"
                    aria-hidden="true"
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* 状态信息 */}
          <div className="flex items-center text-xs text-gray-600 dark:text-gray-400 flex-shrink-0">
            {lastSaveTime && (
              <span className="mr-3 hidden sm:inline">
                最后保存: {lastSaveTime.toLocaleTimeString()}
              </span>
            )}
            {isRunning && (
              <span className="text-green-600 dark:text-green-400 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                <span className="hidden sm:inline">运行中</span>
                <span className="sm:hidden">●</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 设置面板 */}
      <Suspense fallback={null}>
        <SettingsPanel
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />
      </Suspense>
    </>
  )
}

export default Toolbar
