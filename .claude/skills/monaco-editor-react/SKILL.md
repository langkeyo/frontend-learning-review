---
name: monaco-editor-react
description: Monaco Editor integration best practices in React - avoid cursor reset and save issues
---
# Monaco Editor React 集成最佳实践

## 核心原则

**Monaco Editor 在 React 中作为受控组件使用时，必须避免循环更新导致的光标重置问题。**

---

## 问题：保存时只剩一个字符

### 错误做法 - 实时同步

```typescript
// ❌ 错误：在 onDidChangeModelContent 中立即调用 onChange
const contentChangeDisposable = editor.onDidChangeModelContent(() => {
  onChange?.(model.getValue())  // 导致父组件更新 state
})

// ❌ 错误：外部 value 变化时立即更新 model
useEffect(() => {
  model.setValue(value)  // setValue 会重置光标！
}, [value])
```

**问题流程：**
```
用户输入 → onDidChangeModelContent → onChange(newValue)
  → 父组件更新 state → value prop 变化
  → useEffect 调用 setValue() → 光标重置只剩第一个字符
```

### 正确做法 - 延迟保存

```typescript
// ✅ 正确：不在输入时调用 onChange
// 只在失去焦点或按 Ctrl+S 时保存

// 失去焦点时保存
const blurDisposable = editor.onDidBlurEditorText(() => {
  onChange?.(model.getValue())
})

// Ctrl+S 保存时也调用 onChange
editor.addAction({
  id: 'save-file',
  keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
  run: () => {
    onChange?.(model.getValue())  // 同步到父组件
    onSave?.()
  }
})

// 外部 value 变化时：只在编辑器无焦点时更新
useEffect(() => {
  if (!isEditorFocusedRef.current) {  // 避免打断用户输入
    model.setValue(value)
  }
}, [value])
```

---

## 完整实现模板

```typescript
import React, { useEffect, useRef, useState } from 'react'
import * as monacoEditor from 'monaco-editor'

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

  // 追踪编辑器是否有焦点
  const isEditorFocusedRef = useRef(false)

  // 初始化 Monaco 环境
  useEffect(() => {
    let mounted = true

    const loadMonaco = async () => {
      const monacoModule = await import('monaco-editor')

      if (mounted) {
        setMonaco(monacoModule)
        setIsLoading(false)
      }
    }

    loadMonaco()
    return () => { mounted = false }
  }, [])

  // 创建/更新 editor 和 model
  const initializeEditor = useCallback(() => {
    if (!monaco || !containerRef.current) return

    const editor = editorRef.current
    const uri = monaco.Uri.parse(`file:///${fileId}`)

    // 获取或创建 model
    let model = monaco.editor.getModel(uri)
    if (!model) {
      model = monaco.editor.createModel(value, language, uri)
    } else if (model.getValue() !== value && !isEditorFocusedRef.current) {
      model.setValue(value)
    }

    monaco.editor.setModelLanguage(model, language)
    modelRef.current = model

    // 创建新 editor
    if (!editor) {
      const newEditor = monaco.editor.create(containerRef.current, {
        model,
        theme,
        automaticLayout: true,
        // ... 其他配置
      })

      editorRef.current = newEditor

      // === 关键：失去焦点时保存 ===
      const blurDisposable = newEditor.onDidBlurEditorText(() => {
        const newValue = model?.getValue() || ''
        onChange?.(newValue)
      })

      // 追踪焦点状态
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
          const newValue = model?.getValue() || ''
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
    }
  }, [monaco, fileId, language, theme, onChange, onSave, onCursorPositionChange])

  // 执行初始化
  useEffect(() => {
    if (!monaco) return
    const cleanup = initializeEditor()
    return cleanup
  }, [monaco, initializeEditor])

  // 外部 value 变化时更新 model（如重置文件内容时）
  useEffect(() => {
    if (!monaco || !modelRef.current) return
    if (!isEditorFocusedRef.current) {
      const currentValue = modelRef.current.getValue()
      if (value !== currentValue) {
        modelRef.current.setValue(value)
      }
    }
  }, [monaco, value])

  if (isLoading || !monaco) {
    return <div>Loading...</div>
  }

  return <div ref={containerRef} className="h-full" />
}

export default MonacoEditor
```

---

## FileEditor 父组件注意点

### 使用 useCallback 稳定回调引用

```typescript
// ✅ 正确：使用 useCallback 避免编辑器频繁重建
const handleCodeChange = useCallback((content: string) => {
  onFileChange?.(activeFile.id, content)
}, [activeFile.id, onFileChange])

const handleSave = useCallback(() => {
  setSaveStatus('saved')
  onFileSave?.()
  setTimeout(() => setSaveStatus('idle'), 1500)
}, [onFileSave])

// 传递给 MonacoEditor
<MonacoEditor
  key={activeFile.id}  // 切换文件时重建编辑器
  value={activeFile.content}
  language={activeFile.language}
  onChange={handleCodeChange}  // 稳定的引用
  onSave={handleSave}
/>
```

**为什么使用 key：** 切换文件时用 key 强制重建编辑器，避免 model 复用导致的内容错乱。

---

## 快速检查清单

当遇到 Monaco Editor 在 React 中的问题时，检查：

- [ ] `onDidChangeModelContent` 中**没有**调用 `onChange`
- [ ] 失去焦点时调用 `onChange` 保存
- [ ] Ctrl+S 时也调用 `onChange` 同步
- [ ] 外部 value 同步时检查 `isEditorFocusedRef.current`
- [ ] 父组件用 `useCallback` 包装回调函数
- [ ] 切换文件时使用 `key` 强制重建编辑器

---

## 关键记忆点

**输入时不同步，失去焦点或保存时同步。**

```
用户输入 → 只更新 Monaco 内部 model
失去焦点 → onChange(model.getValue())
Ctrl+S  → onChange(model.getValue()) + onSave()
外部更新 → 只在无焦点时 model.setValue(value)
```

这样避免了循环更新，光标不会被 `setValue` 重置。
