import React, { memo, useCallback } from 'react'
import { X, Moon, Sun, Monitor, Zap, Database, Palette, Settings } from 'lucide-react'
import { useAppStore } from '@/stores/useAppStore'

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
}

const SettingsPanel: React.FC<SettingsPanelProps> = memo(({ isOpen, onClose }) => {
  const store = useAppStore() as any
  const { 
    setDarkMode, 
    setError,
    setPreferences,
    setSidebarWidth
  } = store

  const isDarkMode = store.isDarkMode as boolean
  const sidebarWidth = store.sidebarWidth as number

  const handleThemeChange = useCallback((theme: 'light' | 'dark' | 'system') => {
    if (theme === 'system') {
      // 检测系统主题
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setDarkMode(prefersDark)
    } else {
      setDarkMode(theme === 'dark')
    }
    setError(`主题已切换到 ${theme === 'dark' ? '深色' : theme === 'light' ? '浅色' : '系统'} 模式`)
    setTimeout(() => setError(null), 2000)
  }, [setDarkMode, setError])

  const handleSidebarWidthChange = useCallback((width: number) => {
    setSidebarWidth(width)
    setError(`侧边栏宽度已调整为 ${width}px`)
    setTimeout(() => setError(null), 2000)
  }, [setSidebarWidth, setError])

  const handleResetPreferences = useCallback(() => {
    if (confirm('确定要重置所有偏好设置吗？')) {
      setDarkMode(true)
      setSidebarWidth(240)
      setPreferences({
        fontSize: 14,
        fontFamily: 'monospace',
        tabSize: 2,
        wordWrap: true,
        minimap: true,
        autoComplete: true
      })
      setError('偏好设置已重置')
      setTimeout(() => setError(null), 2000)
    }
  }, [setDarkMode, setSidebarWidth, setPreferences, setError])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Settings className="w-5 h-5" />
            设置
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            aria-label="关闭设置"
          >
            <X className="w-5 h-5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Theme Settings */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Palette className="w-4 h-4" />
              主题设置
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleThemeChange('light')}
                className={`p-3 rounded-lg border transition-colors ${
                  !isDarkMode
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <Sun className="w-5 h-5 mx-auto mb-1" />
                <span className="text-xs">浅色</span>
              </button>
              <button
                onClick={() => handleThemeChange('dark')}
                className={`p-3 rounded-lg border transition-colors ${
                  isDarkMode
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <Moon className="w-5 h-5 mx-auto mb-1" />
                <span className="text-xs">深色</span>
              </button>
              <button
                onClick={() => handleThemeChange('system')}
                className="p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-colors"
              >
                <Monitor className="w-5 h-5 mx-auto mb-1" />
                <span className="text-xs">系统</span>
              </button>
            </div>
          </div>

          {/* Sidebar Settings */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Database className="w-4 h-4" />
              布局设置
            </h3>
            <div className="space-y-2">
              <div>
                <label className="text-xs text-gray-600 dark:text-gray-400 block mb-1">
                  侧边栏宽度: {sidebarWidth}px
                </label>
                <input
                  type="range"
                  min="200"
                  max="400"
                  value={sidebarWidth}
                  onChange={(e) => handleSidebarWidthChange(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
              </div>
            </div>
          </div>

          {/* Performance Settings */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              性能设置
            </h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">启用自动保存</span>
                <input
                  type="checkbox"
                  defaultChecked={true}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">启用代码补全</span>
                <input
                  type="checkbox"
                  defaultChecked={true}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">显示小地图</span>
                <input
                  type="checkbox"
                  defaultChecked={true}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleResetPreferences}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            重置默认设置
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            完成
          </button>
        </div>
      </div>
    </div>
  )
})

SettingsPanel.displayName = 'SettingsPanel'

export default SettingsPanel