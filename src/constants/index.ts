// 应用常量定义
export const APP_CONFIG = {
  name: 'FrontendMaster',
  version: '1.0.0',
  description: '前端工程化复习平台',
} as const

// 文件系统常量
export const FILE_SYSTEM = {
  maxFileSize: 1024 * 1024, // 1MB
  supportedLanguages: [
    'javascript', 'typescript', 'jsx', 'tsx',
    'html', 'css', 'scss', 'json', 'md'
  ],
  defaultFileContent: {
    'javascript': '// JavaScript File\n\n',
    'typescript': '// TypeScript File\n\n',
    'jsx': '// React Component\n\nexport default function Component() {\n  return <div>Component</div>\n}\n',
    'tsx': '// React Component (TypeScript)\n\nimport React from \'react\'\n\ninterface Props {\n  // Define props here\n}\n\nexport default function Component({}: Props) {\n  return <div>Component</div>\n}\n',
    'html': '<!DOCTYPE html>\n<html lang="zh-CN">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Document</title>\n</head>\n<body>\n  \n</body>\n</html>',
    'css': '/* CSS File */\n\n',
    'scss': '// SCSS File\n\n',
    'json': '{\n  \n}',
    'md': '# Markdown File\n\n',
  },
} as const

// 编辑器配置常量
export const EDITOR_CONFIG = {
  defaultFontSize: 14,
  defaultFontFamily: 'Monaco, Menlo, Ubuntu Mono, Consolas, monospace',
  defaultTabSize: 2,
  minimap: {
    enabled: true,
    maxColumn: 120,
  },
  wordWrap: 'on',
  autoComplete: true,
  quickSuggestions: true,
  suggestOnTriggerCharacters: true,
} as const

// 终端配置常量
export const TERMINAL_CONFIG = {
  defaultCols: 80,
  defaultRows: 24,
  fontSize: 14,
  fontFamily: 'Monaco, Menlo, Ubuntu Mono, Consolas, monospace',
  theme: 'dark',
  cursorBlink: true,
  scrollback: 1000,
} as const

// 学习路径常量
export const LEARNING_PATH = {
  stages: [
    {
      id: 'html-css',
      title: 'HTML & CSS 基础',
      order: 1,
      description: 'HTML5语义化标签和CSS3现代布局',
    },
    {
      id: 'javascript-es6',
      title: 'JavaScript ES6+',
      order: 2,
      description: '现代JavaScript语法和特性',
    },
    {
      id: 'dom-bom',
      title: 'DOM & BOM 操作',
      order: 3,
      description: '文档对象模型和浏览器对象模型',
    },
    {
      id: 'network-protocols',
      title: '网络协议',
      order: 4,
      description: 'HTTP/WebSocket等网络通信协议',
    },
    {
      id: 'frontend-frameworks',
      title: '前端框架',
      order: 5,
      description: 'React/Vue等现代前端框架',
    },
    {
      id: 'engineering',
      title: '前端工程化',
      order: 6,
      description: '构建工具、包管理、自动化部署',
    },
    {
      id: 'performance-optimization',
      title: '性能优化',
      order: 7,
      description: '代码优化、加载性能、运行时性能',
    },
  ],
} as const

// UI布局常量
export const LAYOUT_CONFIG = {
  sidebar: {
    defaultWidth: 240,
    minWidth: 180,
    maxWidth: 400,
  },
  editor: {
    minWidth: 300,
  },
  terminal: {
    defaultHeight: 200,
    minHeight: 100,
    maxHeight: 400,
  },
} as const

// 错误消息常量
export const ERROR_MESSAGES = {
  fileNotFound: '文件未找到',
  fileAlreadyExists: '文件已存在',
  invalidFileName: '文件名无效',
  permissionDenied: '权限不足',
  networkError: '网络错误',
  containerError: 'WebContainer初始化失败',
  syntaxError: '语法错误',
  runtimeError: '运行时错误',
} as const

// 成功消息常量
export const SUCCESS_MESSAGES = {
  fileCreated: '文件创建成功',
  fileDeleted: '文件删除成功',
  fileRenamed: '文件重命名成功',
  fileSaved: '文件保存成功',
  exerciseCompleted: '练习完成',
  stageCompleted: '阶段完成',
} as const