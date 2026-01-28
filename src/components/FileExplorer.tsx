import React, { useState, useCallback, useMemo, useEffect, memo } from 'react'
import { ChevronRight, ChevronDown, Plus } from 'lucide-react'
import { useAppStore } from '@/stores/useAppStore'
import { fileSystemService } from '@/services/fileSystemService'
import { FileUtils } from '@/utils/fileUtils'
import ErrorBoundary from './ErrorBoundary'
import type { FileSystemNode } from '@/types/index'

// ------------------------------------------------------------------
// 常量定义：默认文件数据 (提取出来避免在组件中重复创建)
// ------------------------------------------------------------------
const DEFAULT_FILES: FileSystemNode[] = [
  {
    id: 'default-1',
    name: 'index.html',
    type: 'file',
    path: '/index.html',
    content:
      '<!DOCTYPE html>\n<html>\n<head>\n  <title>My App</title>\n</head>\n<body>\n  <h1>Hello World</h1>\n</body>\n</html>',
    createdAt: new Date(),
    modifiedAt: new Date(),
    size: 98,
    language: 'html'
  },
  {
    id: 'default-2',
    name: 'style.css',
    type: 'file',
    path: '/style.css',
    content:
      'body {\n  font-family: Arial, sans-serif;\n  margin: 0;\n  padding: 20px;\n}',
    createdAt: new Date(),
    modifiedAt: new Date(),
    size: 52,
    language: 'css'
  },
  {
    id: 'default-3',
    name: 'script.js',
    type: 'file',
    path: '/script.js',
    content:
      'console.log("Hello World");\n\ndocument.addEventListener("DOMContentLoaded", () => {\n  console.log("Page loaded");\n});',
    createdAt: new Date(),
    modifiedAt: new Date(),
    size: 75,
    language: 'javascript'
  },
  {
    id: 'default-4',
    name: 'src',
    type: 'directory',
    path: '/src',
    children: [],
    createdAt: new Date(),
    modifiedAt: new Date()
  }
]

interface FileTreeItemProps {
  node: FileSystemNode
  level: number
  onFileSelect: (node: FileSystemNode) => void
}

/**
 * 防抖Hook
 */
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * 文件树项组件
 */
const FileTreeItem: React.FC<FileTreeItemProps> = memo(
  ({ node, level, onFileSelect }) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [editName, setEditName] = useState(node.name)
    const [showContextMenu, setShowContextMenu] = useState(false)
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 })

    const openFile = useAppStore((state) => state.openFile)
    const addFile = useAppStore((state) => state.addFile)
    const deleteFile = useAppStore((state) => state.deleteFile)
    const updateFile = useAppStore((state) => state.updateFile)

    const fileIcon = useMemo(() => {
      return FileUtils.getFileIcon(node.name, node.type)
    }, [node.name, node.type])

    const formattedSize = useMemo(() => {
      if (node.type === 'file' && node.size) {
        return FileUtils.formatFileSize(node.size)
      }
      return null
    }, [node.type, node.size])

    const handleClick = useCallback(() => {
      if (node.type === 'file') {
        openFile(node)
      } else {
        setIsExpanded((prev) => !prev)
      }
    }, [node.type, openFile, node])

    const handleDoubleClick = useCallback(() => {
      if (node.type === 'directory') {
        setIsEditing(true)
      }
    }, [node.type])

    const handleContextMenu = useCallback((e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setMenuPosition({ x: e.clientX, y: e.clientY })
      setShowContextMenu(true)
    }, [])

    const handleRename = useCallback(async () => {
      if (editName.trim() && editName !== node.name) {
        try {
          const newPath = node.path.replace(/\/[^\/]+$/, `/${editName}`)
          await fileSystemService.renameFile(node.path, newPath)
          updateFile(node.id, { name: editName, path: newPath })
        } catch (error) {
          console.error('Failed to rename file:', error)
        }
      }
      setIsEditing(false)
    }, [editName, node.id, node.name, node.path, updateFile])

    const handleDelete = useCallback(async () => {
      if (
        confirm(
          `确定要删除${node.type === 'directory' ? '文件夹' : '文件'} "${node.name}" 吗？`
        )
      ) {
        try {
          await fileSystemService.deleteFile(node.path)
          deleteFile(node.id)
        } catch (error) {
          console.error('Failed to delete file:', error)
        }
      }
      setShowContextMenu(false)
    }, [node.id, node.name, node.path, node.type, deleteFile])

    const handleCreateFile = useCallback(
      async (isDirectory: boolean = false) => {
        const name = isDirectory ? '新建文件夹' : '新建文件'
        const newPath = `${node.path}${node.path.endsWith('/') ? '' : '/'}${name}`

        try {
          const newFile = await fileSystemService.createFile(
            newPath,
            '',
            isDirectory
          )
          addFile(newFile)
          // 创建文件后自动展开目录
          setIsExpanded(true)
        } catch (error) {
          console.error('Failed to create file:', error)
        }
        setShowContextMenu(false)
      },
      [node.path, addFile]
    )

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
          handleRename()
        } else if (e.key === 'Escape') {
          setEditName(node.name)
          setIsEditing(false)
        }
      },
      [handleRename, node.name]
    )

    useEffect(() => {
      const handleClickOutside = () => {
        setShowContextMenu(false)
      }

      if (showContextMenu) {
        document.addEventListener('click', handleClickOutside)
        return () => {
          document.removeEventListener('click', handleClickOutside)
        }
      }
    }, [showContextMenu])

    // 子项渲染
    const childrenRender = useMemo(() => {
      if (node.type !== 'directory' || !isExpanded || !node.children) {
        return null
      }

      return node.children.map((child: FileSystemNode) => (
        <FileTreeItem
          key={child.id}
          node={child}
          level={level + 1}
          onFileSelect={onFileSelect}
        />
      ))
    }, [node.type, isExpanded, node.children, level, onFileSelect])

    // 右键菜单渲染
    const contextMenuRender = useMemo(() => {
      if (!showContextMenu) return null

      return (
        <div
          className="fixed bg-gray-800 border border-gray-600 rounded shadow-lg py-1 z-50"
          style={{ left: menuPosition.x, top: menuPosition.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="flex gap-1 items-center w-full text-left px-3 py-1 text-sm text-gray-300 hover:bg-gray-700"
            onClick={() => handleCreateFile(false)}
          >
            <Plus size={14} className="inline mr-2" />
            新建文件
          </button>
          <button
            className="flex items-center gap-1 w-full text-left px-3 py-1 text-sm text-gray-300 hover:bg-gray-700"
            onClick={() => handleCreateFile(true)}
          >
            <Plus size={14} className="inline mr-2" />
            新建文件夹
          </button>
          {node.name !== 'src' && node.name !== 'public' && (
            <>
              <button
                className="w-full text-left px-3 py-1 text-sm text-gray-300 hover:bg-gray-700"
                onClick={() => {
                  setIsEditing(true)
                  setShowContextMenu(false)
                }}
              >
                重命名
              </button>
              <button
                className="w-full text-left px-3 py-1 text-sm text-red-400 hover:bg-gray-700"
                onClick={handleDelete}
              >
                删除
              </button>
            </>
          )}
        </div>
      )
    }, [
      showContextMenu,
      menuPosition,
      handleCreateFile,
      node.name,
      handleDelete
    ])

    return (
      <div>
        <div
          className="flex items-center py-1 px-2 hover:bg-gray-700 dark:hover:bg-gray-600 cursor-pointer select-none"
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
          onContextMenu={handleContextMenu}
        >
          {node.type === 'directory' && (
            <span className="mr-1">
              {isExpanded ? (
                <ChevronDown size={14} className="text-gray-500" />
              ) : (
                <ChevronRight size={14} className="text-gray-500" />
              )}
            </span>
          )}

          <span className="mr-2">{fileIcon}</span>

          {isEditing ? (
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={handleKeyDown}
              className="px-1 py-0 text-sm bg-gray-900 border border-blue-500 rounded text-white"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className="text-sm text-gray-300 truncate">{node.name}</span>
          )}

          {formattedSize && (
            <span className="ml-auto text-xs text-gray-500 pl-2">
              {formattedSize}
            </span>
          )}
        </div>

        {childrenRender}
        {contextMenuRender}
      </div>
    )
  }
)

FileTreeItem.displayName = 'FileTreeItem'

/**
 * 文件浏览器组件 - 修复版
 */
const FileExplorer: React.FC = () => {
  const fileSystem = useAppStore((state) => (state as any).fileSystem)
  const setFileSystem = useAppStore((state) => state.setFileSystem)
  const setLoading = useAppStore((state) => state.setLoading)
  const setError = useAppStore((state) => state.setError)

  const [searchQuery, setSearchQuery] = useState('')

  // 防抖延迟设为 300ms
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  // ------------------------------------------------------------------
  // 核心修复：单一数据加载 Effect
  // 合并了“初始化加载”和“搜索加载”的逻辑，避免死循环
  // ------------------------------------------------------------------
  useEffect(() => {
    let isMounted = true

    const loadData = async () => {
      // 仅当真的需要加载时才显示 loading，改善体验
      if (isMounted) setLoading(true)

      try {
        let files: FileSystemNode[] = []

        if (!debouncedSearchQuery.trim()) {
          // 场景A: 无搜索词 -> 加载完整目录树
          files = await fileSystemService.getFileTree()

          // 如果服务返回空，使用默认数据兜底
          if (files.length === 0) {
            files = DEFAULT_FILES
          }
        } else {
          // 场景B: 有搜索词 -> 执行搜索
          files = await fileSystemService.searchFiles(debouncedSearchQuery)
        }

        if (isMounted) {
          setFileSystem(files)
          setError(null) // 清除可能存在的旧错误
        }
      } catch (error) {
        console.error('File load/search error:', error)
        if (isMounted) {
          setError('无法加载文件列表')
          // 出错时也显示默认文件防止白屏
          setFileSystem(DEFAULT_FILES)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadData()

    return () => {
      isMounted = false
    }
    // 注意：依赖数组中仅包含 debouncedSearchQuery
    // 移除了 setFileSystem 等函数依赖，彻底防止因函数引用变化导致的死循环
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchQuery])

  // 处理文件选择
  const handleFileSelect = useCallback((node: FileSystemNode) => {
    // 逻辑已在子组件处理，此处保留接口以便后续扩展
    console.log('Selected:', node.name)
  }, [])

  const clearSearch = useCallback(() => {
    setSearchQuery('')
  }, [])

  // 渲染文件树内容
  const fileTreeContent = useMemo(() => {
    if (!fileSystem || fileSystem.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500 select-none">
          <div className="text-2xl mb-2">📁</div>
          <p>暂无文件</p>
          <p className="text-xs mt-1">右键点击区域创建文件</p>
        </div>
      )
    }

    return (
      <div className="flex-1 overflow-y-auto file-tree">
        {fileSystem.map((node: FileSystemNode) => (
          <FileTreeItem
            key={node.id}
            node={node}
            level={0}
            onFileSelect={handleFileSelect}
          />
        ))}
      </div>
    )
  }, [fileSystem, handleFileSelect])

  return (
    <ErrorBoundary
      fallback={
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <div className="text-2xl mb-2">⚠️</div>
            <p>组件崩溃</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-blue-400 hover:underline text-sm"
            >
              刷新重试
            </button>
          </div>
        </div>
      }
    >
      <div className="flex-1 flex flex-col overflow-hidden h-full bg-editor-sidebar">
        {/* 搜索栏 */}
        <div className="file-search p-2 border-b border-gray-700">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索文件..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              
              className="w-full px-3 py-1 text-sm bg-gray-900 border border-gray-700 rounded text-gray-300 placeholder-gray-600 focus:border-blue-500 outline-none"
            />
            {searchQuery && (
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
                onClick={clearSearch}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* 文件列表区域 */}
        {fileTreeContent}

        {/* 底部状态栏 */}
        <div className="text-center p-1 border-t border-gray-700 text-xs text-gray-600 select-none">
          {fileSystem.length} 个项目
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default FileExplorer
