import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { AppState, FileSystemNode, EditorState, TerminalState, LearningPath, LearningStage, UserPreferences } from '@/types'

interface AppStore extends AppState {
  // 文件系统操作
  setFileSystem: (fileSystem: FileSystemNode[]) => void
  addFile: (file: FileSystemNode) => void
  updateFile: (id: string, updates: Partial<FileSystemNode>) => void
  deleteFile: (id: string) => void
  
  // 编辑器操作
  setEditor: (editor: Partial<EditorState>) => void
  openFile: (file: FileSystemNode) => void
  closeFile: (fileId: string) => void
  saveFile: (fileId: string) => void
  setActiveFile: (fileId: string | null) => void
  
  // 终端操作
  setTerminal: (terminal: Partial<TerminalState>) => void
  toggleTerminal: () => void
  addCommandHistory: (command: string) => void
  
  // 学习路径操作
  setLearningPath: (path: LearningPath) => void
  setCurrentStage: (stage: LearningStage | null) => void
  setCurrentLesson: (lesson: any) => void
  updateProgress: (stageId: string, lessonId: string, progress: number) => void
  
  // UI操作
  setSidebarWidth: (width: number) => void
  setDarkMode: (isDark: boolean) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
  
  // 用户偏好设置
  setPreferences: (preferences: Partial<UserPreferences>) => void
}

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set /*, get */) => ({
        // 初始状态
        fileSystem: [],
        editor: {
          openFiles: [],
          activeFileId: null,
        },
        terminal: {
          histories: [],
          currentHistoryIndex: -1,
          isVisible: true,
          size: { width: 800, height: 200 },
        },
        learningPath: null,
        currentStage: null,
        currentLesson: null,
        sidebarWidth: 240,
        isDarkMode: true,
        isLoading: false,
        error: null,

        // 文件系统操作
        setFileSystem: (fileSystem) => set({ fileSystem }),
        
        addFile: (file) => set((state) => ({
          fileSystem: [...state.fileSystem, file],
        })),
        
        updateFile: (id, updates) => set((state) => ({
          fileSystem: state.fileSystem.map(node =>
            node.id === id ? { ...node, ...updates, modifiedAt: new Date() } : node
          ),
        })),
        
        deleteFile: (id) => set((state) => ({
          fileSystem: state.fileSystem.filter(node => node.id !== id),
        })),

        // 编辑器操作
        setEditor: (editor) => set((state) => ({
          editor: { ...state.editor, ...editor },
        })),
        
        openFile: (file) => set((state) => {
          const existingFile = state.editor.openFiles.find(f => f.id === file.id)
          if (existingFile) {
            return {
              editor: {
                ...state.editor,
                activeFileId: file.id,
              },
            }
          }
          
          const newFile = {
            id: file.id,
            name: file.name,
            content: file.content || '',
            language: file.language || 'plaintext',
            isDirty: false,
          }
          
          return {
            editor: {
              openFiles: [...state.editor.openFiles, newFile],
              activeFileId: file.id,
            },
          }
        }),
        
        closeFile: (fileId) => set((state) => {
          const newOpenFiles = state.editor.openFiles.filter(f => f.id !== fileId)
          const newActiveFileId = state.editor.activeFileId === fileId 
            ? (newOpenFiles.length > 0 ? newOpenFiles[newOpenFiles.length - 1].id : null)
            : state.editor.activeFileId
          
          return {
            editor: {
              ...state.editor,
              openFiles: newOpenFiles,
              activeFileId: newActiveFileId,
            },
          }
        }),
        
        saveFile: (fileId) => set((state) => ({
          editor: {
            ...state.editor,
            openFiles: state.editor.openFiles.map(f =>
              f.id === fileId ? { ...f, isDirty: false } : f
            ),
          },
        })),
        
        setActiveFile: (fileId) => set((state) => ({
          editor: {
            ...state.editor,
            activeFileId: fileId,
          },
        })),

        // 终端操作
        setTerminal: (terminal) => set((state) => ({
          terminal: { ...state.terminal, ...terminal },
        })),
        
        toggleTerminal: () => set((state) => ({
          terminal: {
            ...state.terminal,
            isVisible: !state.terminal.isVisible,
          },
        })),
        
        addCommandHistory: (command) => set((state) => ({
          terminal: {
            ...state.terminal,
            histories: [...state.terminal.histories.slice(-99), command],
            currentHistoryIndex: state.terminal.histories.length,
          },
        })),

        // 学习路径操作
        setLearningPath: (learningPath) => set({ learningPath }),
        setCurrentStage: (currentStage) => set({ currentStage }),
        setCurrentLesson: (currentLesson) => set({ currentLesson }),
        updateProgress: (stageId, lessonId, progress) => set((state) => ({
          learningPath: state.learningPath ? {
            ...state.learningPath,
            stages: state.learningPath.stages.map(stage =>
              stage.id === stageId
                ? {
                    ...stage,
                    lessons: stage.lessons.map(lesson =>
                      lesson.id === lessonId ? { ...lesson, progress } : lesson
                    ),
                  }
                : stage
            ),
          } : null,
        })),

        // UI操作
        setSidebarWidth: (sidebarWidth) => set({ sidebarWidth }),
        setDarkMode: (isDarkMode) => set({ isDarkMode }),
        setLoading: (isLoading) => set({ isLoading }),
        setError: (error) => set({ error }),
        clearError: () => set({ error: null }),
        
        // 用户偏好设置
        setPreferences: (preferences) => set((state) => ({
          ...state,
          ...preferences,
        })),
      }),
      {
        name: 'frontend-master-store',
        partialize: (state) => ({
          // 只持久化需要保存的状态
          sidebarWidth: state.sidebarWidth,
          isDarkMode: state.isDarkMode,
          // 编辑器状态可能很大，考虑部分持久化
        }),
      }
    ),
    {
      name: 'frontend-master',
    }
  )
)