

/**
 * 文件工具函数
 */
export class FileUtils {
  /**
   * 根据文件名获取语言
   */
  static getLanguageFromFileName(fileName: string): string {
    const extension = fileName.includes('.') ? fileName.split('.').pop()?.toLowerCase() : ''
    
    const extensionMap: Record<string, string> = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'html': 'html',
      'htm': 'html',
      'css': 'css',
      'scss': 'scss',
      'sass': 'sass',
      'less': 'less',
      'json': 'json',
      'md': 'markdown',
      'vue': 'vue',
      'svelte': 'svelte',
      'xml': 'xml',
      'yaml': 'yaml',
      'yml': 'yaml',
      'sql': 'sql',
      'py': 'python',
      'go': 'go',
      'rs': 'rust',
      'java': 'java',
      'c': 'c',
      'cpp': 'cpp',
      'h': 'c',
      'hpp': 'cpp',
    }

    return extensionMap[extension || ''] || 'plaintext'
  }

  /**
   * 获取文件图标
   */
  static getFileIcon(fileName: string, type: string = 'file'): string {
    if (type === 'directory') {
      return '📁'
    }

    const extension = fileName.includes('.') ? fileName.split('.').pop()?.toLowerCase() : ''
    
    const iconMap: Record<string, string> = {
      'js': '🟨',
      'jsx': '🟨',
      'ts': '🟦',
      'tsx': '🟦',
      'html': '🌐',
      'htm': '🌐',
      'css': '🎨',
      'scss': '🎨',
      'sass': '🎨',
      'less': '🎨',
      'json': '📋',
      'md': '📝',
      'vue': '💚',
      'svelte': '🧡',
      'xml': '📄',
      'yaml': '📄',
      'yml': '📄',
      'sql': '🗃️',
      'py': '🐍',
      'go': '🐹',
      'rs': '🦀',
      'java': '☕',
      'c': '⚙️',
      'cpp': '⚙️',
      'h': '📜',
      'hpp': '📜',
    }

    return iconMap[extension || ''] || '📄'
  }

  /**
   * 格式化文件大小
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  /**
   * 检查文件是否为二进制文件
   */
  static isBinaryFile(fileName: string): boolean {
    const binaryExtensions = [
      'jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg',
      'mp4', 'avi', 'mov', 'wmv', 'flv',
      'mp3', 'wav', 'flac', 'aac',
      'zip', 'rar', '7z', 'tar', 'gz',
      'exe', 'dmg', 'pkg', 'deb', 'rpm',
      'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
    ]

    const extension = fileName.includes('.') ? fileName.split('.').pop()?.toLowerCase() : ''
    return binaryExtensions.includes(extension || '')
  }

  /**
   * 获取文件 MIME 类型
   */
  static getMimeType(fileName: string): string {
    const extension = fileName.includes('.') ? fileName.split('.').pop()?.toLowerCase() : ''
    
    const mimeMap: Record<string, string> = {
      'html': 'text/html',
      'htm': 'text/html',
      'css': 'text/css',
      'js': 'text/javascript',
      'jsx': 'text/javascript',
      'ts': 'text/typescript',
      'tsx': 'text/typescript',
      'json': 'application/json',
      'md': 'text/markdown',
      'txt': 'text/plain',
      'xml': 'text/xml',
      'yaml': 'text/yaml',
      'yml': 'text/yaml',
      'sql': 'text/sql',
      'py': 'text/x-python',
      'go': 'text/x-go',
      'rs': 'text/x-rust',
      'java': 'text/x-java-source',
      'c': 'text/x-c',
      'cpp': 'text/x-c++',
      'h': 'text/x-c',
      'hpp': 'text/x-c++',
    }

    return mimeMap[extension || ''] || 'text/plain'
  }

  /**
   * 验证文件名
   */
  static validateFileName(fileName: string): { isValid: boolean; error?: string } {
    if (!fileName || fileName.trim() === '') {
      return { isValid: false, error: '文件名不能为空' }
    }

    // 检查非法字符
    const invalidChars = /[<>:"/\\|?*]/
    if (invalidChars.test(fileName)) {
      return { isValid: false, error: '文件名包含非法字符' }
    }

    // 检查长度
    if (fileName.length > 255) {
      return { isValid: false, error: '文件名过长' }
    }

    // 检查保留名称（Windows）
    const reservedNames = [
      'CON', 'PRN', 'AUX', 'NUL',
      'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9',
      'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9'
    ]

    const nameWithoutExtension = fileName.split('.')[0].toUpperCase()
    if (reservedNames.includes(nameWithoutExtension)) {
      return { isValid: false, error: '文件名为系统保留名称' }
    }

    return { isValid: true }
  }

  /**
   * 获取默认文件内容
   */
  static getDefaultContent(fileName: string): string {
    const language = this.getLanguageFromFileName(fileName)
    
    const defaultContent: Record<string, string> = {
      'javascript': '// JavaScript File\\n\\n',
      'typescript': '// TypeScript File\\n\\n',
      'html': '<!DOCTYPE html>\\n<html lang="zh-CN">\\n<head>\\n  <meta charset="UTF-8">\\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\\n  <title>Document</title>\\n</head>\\n<body>\\n  \\n</body>\\n</html>',
      'css': '/* CSS File */\\n\\n',
      'scss': '// SCSS File\\n\\n',
      'json': '{\\n  \\n}',
      'markdown': '# Markdown File\\n\\n',
    }

    return defaultContent[language] || ''
  }
}