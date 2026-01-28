import React, { useEffect, useRef, useCallback, useState } from 'react'
import type { editor } from 'monaco-editor'
import { EDITOR_CONFIG } from '@/constants'

// --------------------------------------------------------------------------
// 1. 引入 Worker (Vite 专用写法)
// 直接从 node_modules 导入并加上 ?worker 后缀，Vite 会自动处理路径
// --------------------------------------------------------------------------
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

interface MonacoEditorProps {
  fileId: string
  value: string
  language: string
  theme?: string
  onChange?: (value: string) => void
  onSave?: () => void
  onCursorPositionChange?: (position: { line: number; column: number }) => void
}

const MonacoEditor: React.FC<MonacoEditorProps> = ({
  fileId,
  value,
  language,
  theme = 'vs-dark',
  onChange,
  onSave,
  onCursorPositionChange
}) => {
  const [monaco, setMonaco] = useState<typeof import('monaco-editor') | null>(
    null
  )
  const [isLoading, setIsLoading] = useState(true)
  const editorRef = useRef<HTMLDivElement>(null)
  const editorInstanceRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const modelRef = useRef<editor.ITextModel | null>(null)

  // --------------------------------------------------------------------------
  // 2. 初始化环境与加载 Monaco
  // --------------------------------------------------------------------------
  useEffect(() => {
    let mounted = true

    const loadMonaco = async () => {
      try {
        // 配置 MonacoEnvironment
        // 使用 (window as any) 绕过 TypeScript 类型检查冲突
        self.MonacoEnvironment = {
          getWorker(_: any, label: string) {
            if (label === 'json') {
              return new JsonWorker()
            }
            if (label === 'css' || label === 'scss' || label === 'less') {
              return new CssWorker()
            }
            if (
              label === 'html' ||
              label === 'handlebars' ||
              label === 'razor'
            ) {
              return new HtmlWorker()
            }
            if (label === 'typescript' || label === 'javascript') {
              return new TsWorker()
            }
            return new EditorWorker()
          }
        }

        // 动态导入 Monaco 核心包
        const monacoModule = await import('monaco-editor')

        if (mounted) {
          setMonaco(monacoModule)
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Failed to load Monaco Editor:', error)
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    loadMonaco()

    return () => {
      mounted = false
    }
  }, [])

  // --------------------------------------------------------------------------
  // 3. 初始化编辑器实例 (Hook 顺序已修复)
  // --------------------------------------------------------------------------
  const initializeEditor = useCallback(() => {
    if (!editorRef.current || editorInstanceRef.current || !monaco) return

    // 销毁旧实例
    // if (editorInstanceRef.current) {
    //   editorInstanceRef.current?.dispose()
    // }

    // 创建新实例
    const editor = monaco.editor.create(editorRef.current, {
      value,
      language,
      theme,
      fontSize: EDITOR_CONFIG.defaultFontSize,
      fontFamily: EDITOR_CONFIG.defaultFontFamily,
      tabSize: EDITOR_CONFIG.defaultTabSize,
      wordWrap: EDITOR_CONFIG.wordWrap,
      minimap: {
        enabled: EDITOR_CONFIG.minimap.enabled,
        maxColumn: EDITOR_CONFIG.minimap.maxColumn
      },
      automaticLayout: true,
      scrollBeyondLastLine: true,
      renderWhitespace: 'selection',
      rulers: [80, 120],
      bracketPairColorization: {
        enabled: true
      },
      guides: {
        indentation: true,
        bracketPairs: true
      },
      suggest: {
        showKeywords: true,
        showSnippets: true
      },
      quickSuggestions: EDITOR_CONFIG.quickSuggestions,
      acceptSuggestionOnEnter: 'on',
      tabCompletion: 'on',
      formatOnPaste: true,
      formatOnType: true,
      // 这里的 model 设为 null，稍后手动设置，防止状态不一致
      model: null
    })

    editorInstanceRef.current = editor

    // 创建或获取 Model
    const uri = monaco.Uri.parse(`file:///${fileId}`)
    let model = monaco.editor.getModel(uri)

    if (!model) {
      model = monaco.editor.createModel(value, language, uri)
    } else {
      // 如果 Model 已存在，更新值和语言
      if (model.getValue() !== value) {
        model.setValue(value)
      }
      monaco.editor.setModelLanguage(model, language)
    }

    modelRef.current = model
    editor.setModel(model)

    // 事件监听
    const disposable = editor.onDidChangeModelContent(() => {
      const newValue = model?.getValue() || ''
      // 只有当内容真的改变且不是由外部 props 引起时才触发
      if (newValue !== value) {
        onChange?.(newValue)
      }
    })

    const cursorDisposable = editor.onDidChangeCursorPosition((e) => {
      onCursorPositionChange?.({
        line: e.position.lineNumber,
        column: e.position.column
      })
    })

    const saveDisposable = editor.addAction({
      id: 'save-file',
      label: 'Save File',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
      run: () => {
        onSave?.()
      }
    })

    editor.focus()

    return () => {
      disposable.dispose()
      cursorDisposable.dispose()
      saveDisposable.dispose()
    }
  }, [
    monaco,
    fileId,
    value,
    language,
    theme,
    onChange,
    onSave,
    onCursorPositionChange
  ])

  // 执行初始化
  useEffect(() => {
    if (!monaco) return
    const cleanup = initializeEditor()
    return cleanup
  }, [monaco, initializeEditor])

  // 监听语言变化
  useEffect(() => {
    if (!monaco || !modelRef.current) return
    monaco.editor.setModelLanguage(modelRef.current, language)
  }, [monaco, language])

  // 监听主题变化
  useEffect(() => {
    if (!monaco) return
    monaco.editor.setTheme(theme)
  }, [monaco, theme])

  // 监听外部内容变化
  useEffect(() => {
    if (!monaco || !modelRef.current) return
    const currentValue = modelRef.current.getValue()
    if (value !== currentValue) {
      // 使用 pushEditOperations 保持撤销栈或 executeEdits
      // 简单处理直接 setValue
      modelRef.current.setValue(value)
    }
  }, [monaco, value])

  // 工具函数
  const formatCode = useCallback(() => {
    editorInstanceRef.current?.getAction('editor.action.formatDocument')?.run()
  }, [])

  const findInFiles = useCallback(() => {
    editorInstanceRef.current
      ?.getAction('editor.action.startFindReplaceAction')
      ?.run()
  }, [])

  // 清理
  useEffect(() => {
    return () => {
      modelRef.current?.dispose()
      editorInstanceRef.current?.dispose()
    }
  }, [])

  // --------------------------------------------------------------------------
  // 渲染视图
  // --------------------------------------------------------------------------
  if (isLoading || !monaco) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-editor-bg text-gray-400">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
          <div className="text-sm">Initializing Editor Resources...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full relative group">
      <div ref={editorRef} className="h-full" />

      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
        <button
          className="p-1.5 bg-gray-800 text-gray-300 rounded hover:bg-gray-700 hover:text-white border border-gray-600 shadow-lg"
          title="Format Code"
          onClick={formatCode}
        >
          <span className="text-xs">Format</span>
        </button>
        <button
          className="p-1.5 bg-gray-800 text-gray-300 rounded hover:bg-gray-700 hover:text-white border border-gray-600 shadow-lg"
          title="Find"
          onClick={findInFiles}
        >
          <span className="text-xs">Find</span>
        </button>
      </div>
    </div>
  )
}

export default MonacoEditor
