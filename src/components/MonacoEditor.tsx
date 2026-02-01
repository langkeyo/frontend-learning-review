import React, { useEffect, useRef, useState, useCallback } from 'react'
import * as monacoEditor from 'monaco-editor'
import { EDITOR_CONFIG } from '@/constants'

// Worker 导入
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
  const [monaco, setMonaco] = useState<typeof monacoEditor | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const editorRef = useRef<monacoEditor.editor.IStandaloneCodeEditor | null>(null)
  const modelRef = useRef<monacoEditor.editor.ITextModel | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isEditorFocusedRef = useRef(false)  // 追踪编辑器是否有焦点

  // 初始化 Monaco 环境
  useEffect(() => {
    let mounted = true

    const loadMonaco = async () => {
      try {
        self.MonacoEnvironment = {
          getWorker(_: any, label: string) {
            if (label === 'json') return new JsonWorker()
            if (label === 'css' || label === 'scss' || label === 'less') return new CssWorker()
            if (label === 'html' || label === 'handlebars' || label === 'razor') return new HtmlWorker()
            if (label === 'typescript' || label === 'javascript') return new TsWorker()
            return new EditorWorker()
          }
        }

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

  // 创建/更新 editor 和 model 的逻辑
  const initializeEditor = useCallback(() => {
    // 先清理旧的 editor 和 model
    if (editorRef.current) {
      console.log('[MonacoEditor] Disposing old editor')
      editorRef.current.dispose()
      editorRef.current = null
    }
    if (modelRef.current) {
      console.log('[MonacoEditor] Disposing old model')
      modelRef.current.dispose()
      modelRef.current = null
    }

    if (!monaco || !containerRef.current) {
      console.log('[MonacoEditor] Cannot initialize, monaco or container not ready')
      return
    }

    console.log('[MonacoEditor] Initializing editor for', fileId, 'value length:', value.length, 'language:', language)

    const uri = monaco.Uri.parse(`file:///${fileId}`)

    // 获取或创建 model
    let model = monaco.editor.getModel(uri)
    if (!model) {
      model = monaco.editor.createModel(value, language, uri)
      console.log('[MonacoEditor] Created new model')
    } else {
      // 先更新 model 的值
      if (model.getValue() !== value && !isEditorFocusedRef.current) {
        console.log('[MonacoEditor] Updating existing model')
        model.setValue(value)
      }
      // 然后更新语言
      monaco.editor.setModelLanguage(model, language)
    }

    modelRef.current = model
    console.log('[MonacoEditor] Model value after init:', model.getValue().substring(0, 100))

    // 创建新 editor
    const newEditor = monaco.editor.create(containerRef.current, {
      model,
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
      bracketPairColorization: { enabled: true },
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
      formatOnType: true
    })

    editorRef.current = newEditor

    // === 关键：失去焦点时保存（不再在输入时保存）===
    const blurDisposable = newEditor.onDidBlurEditorText(() => {
      if (!modelRef.current) return
      const newValue = modelRef.current.getValue()
      isEditorFocusedRef.current = false
      onChange?.(newValue)
    })

    // === 追踪焦点状态 ===
    const focusDisposable = newEditor.onDidFocusEditorText(() => {
      isEditorFocusedRef.current = true
    })

    // 监听光标位置
    const cursorDisposable = newEditor.onDidChangeCursorPosition((e) => {
      onCursorPositionChange?.({
        line: e.position.lineNumber,
        column: e.position.column
      })
    })

    // === 关键：Ctrl+S 保存时也调用 onChange ===
    newEditor.addAction({
      id: 'save-file',
      label: 'Save File',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
      run: () => {
        if (!modelRef.current) return
        const newValue = modelRef.current.getValue()
        onChange?.(newValue)  // 同步到父组件
        onSave?.()
      }
    })

    newEditor.focus()

    return () => {
      blurDisposable.dispose()
      focusDisposable.dispose()
      cursorDisposable.dispose()
    }
  }, [monaco, fileId, language, theme, onChange, onSave, onCursorPositionChange, value])

  // 执行初始化 - 只在 monaco 加载后执行
  useEffect(() => {
    if (!monaco) return
    const cleanup = initializeEditor()
    return cleanup
  }, [monaco, initializeEditor])

  // 当外部 value 变化时更新 model（如重置文件内容时）
  // === 关键：只在编辑器无焦点时更新，避免打断用户输入 ===
  useEffect(() => {
    console.log('[MonacoEditor] Value change effect, monaco ready:', !!monaco, 'model ready:', !!modelRef.current, 'isFocused:', isEditorFocusedRef.current, 'value length:', value.length)
    if (!monaco || !modelRef.current) {
      console.log('[MonacoEditor] Skipping value update, monaco or model not ready')
      return
    }
    // 只在编辑器无焦点时更新，避免打断用户输入
    if (!isEditorFocusedRef.current) {
      const currentValue = modelRef.current.getValue()
      console.log('[MonacoEditor] Current model value preview:', currentValue.substring(0, 100))
      if (value !== currentValue) {
        console.log('[MonacoEditor] Updating value, length:', value.length)
        modelRef.current.setValue(value)
      }
    } else {
      console.log('[MonacoEditor] Skipping value update, editor is focused')
    }
  }, [monaco, value])

  // 监听主题变化
  useEffect(() => {
    if (!monaco) return
    monaco.editor.setTheme(theme)
  }, [monaco, theme])

  // 清理
  useEffect(() => {
    return () => {
      modelRef.current?.dispose()
      editorRef.current?.dispose()
    }
  }, [])

  // 工具函数
  const formatCode = useCallback(() => {
    editorRef.current?.getAction('editor.action.formatDocument')?.run()
  }, [])

  const findInFiles = useCallback(() => {
    editorRef.current?.getAction('editor.action.startFindReplaceAction')?.run()
  }, [])

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
      <div ref={containerRef} className="h-full" />

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
