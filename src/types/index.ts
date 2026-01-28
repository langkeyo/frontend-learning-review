// 文件系统类型定义
export interface FileSystemNode {
  id: string
  name: string
  type: 'file' | 'directory'
  path: string
  content?: string
  children?: FileSystemNode[]
  createdAt: Date
  modifiedAt: Date
  size?: number
  language?: string
}

// 文件操作类型
export type FileOperation = 
  | { type: 'create'; path: string; content: string; isDirectory: boolean }
  | { type: 'delete'; path: string }
  | { type: 'rename'; path: string; newName: string }
  | { type: 'move'; path: string; newPath: string }
  | { type: 'write'; path: string; content: string }

// 编辑器状态
export interface EditorState {
  openFiles: Array<{
    id: string
    name: string
    content: string
    language: string
    isDirty: boolean
  }>
  activeFileId: string | null
  cursorPosition?: {
    line: number
    column: number
  }
}

// 终端状态
export interface TerminalState {
  histories: string[]
  currentHistoryIndex: number
  isVisible: boolean
  size: { width: number; height: number }
}

// 学习路径类型
export interface LearningPath {
  id: string
  title: string
  description: string
  stages: LearningStage[]
  totalProgress: number
}

export interface LearningStage {
  id: string
  title: string
  description: string
  order: number
  isLocked: boolean
  isCompleted: boolean
  progress: number
  lessons: Lesson[]
}

export interface Lesson {
  id: string
  title: string
  type: 'theory' | 'practice' | 'project'
  content?: string
  exercises?: Exercise[]
  estimatedTime: number // 分钟
}

export interface Exercise {
  id: string
  title: string
  description: string
  type: 'code-completion' | 'implementation' | 'debug'
  difficulty: 'easy' | 'medium' | 'hard'
  initialCode?: string
  solution?: string
  hints: string[]
  testCases?: TestCase[]
}

export interface TestCase {
  id: string
  input: any
  expectedOutput: any
  description: string
}

// 应用主状态
export interface AppState {
  // IDE状态
  fileSystem: FileSystemNode[]
  editor: EditorState
  terminal: TerminalState
  
  // 学习状态
  learningPath: LearningPath | null
  currentStage: LearningStage | null
  currentLesson: Lesson | null
  
  // UI状态
  sidebarWidth: number
  isDarkMode: boolean
  isLoading: boolean
  error: string | null
}

// WebContainer相关类型
export interface WebContainerInstance {
  instance: any
  isReady: boolean
  workingDirectory: string
}

// 网络请求相关类型
export interface NetworkRequest {
  id: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  url: string
  headers: Record<string, string>
  body?: string
  status?: number
  responseTime?: number
  timestamp: Date
}

// 用户偏好设置
export interface UserPreferences {
  theme: 'dark' | 'light'
  fontSize: number
  fontFamily: string
  tabSize: number
  wordWrap: boolean
  minimap: boolean
  autoComplete: boolean
}