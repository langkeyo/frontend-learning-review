import type { FileSystemNode, FileOperation } from '@/types'

/**
 * IndexedDB 文件系统服务
 * 提供文件的增删改查操作
 */
class FileSystemService {
  private dbName = 'FrontendMasterFS'
  private storeName = 'files'
  private version = 1
  private db: IDBDatabase | null = null

  /**
   * 初始化数据库
   */
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => {
        reject(new Error('Failed to open IndexedDB'))
      }

      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'id' })
          store.createIndex('path', 'path', { unique: true })
          store.createIndex('type', 'type', { unique: false })
          store.createIndex('parentId', 'parentId', { unique: false })
        }
      }
    })
  }

  /**
   * 创建文件或目录
   */
  async createFile(path: string, content: string = '', isDirectory: boolean = false): Promise<FileSystemNode> {
    if (!this.db) await this.init()

    const fileName = path.split('/').pop() || 'untitled'
    const extension = fileName.includes('.') ? fileName.split('.').pop() : ''
    const language = this.getLanguageFromExtension(extension || '')
    
    const fileNode: FileSystemNode = {
      id: this.generateId(),
      name: fileName,
      type: isDirectory ? 'directory' : 'file',
      path,
      content: isDirectory ? undefined : (content || ''),
      children: isDirectory ? [] : undefined,
      createdAt: new Date(),
      modifiedAt: new Date(),
      size: content.length,
      language,
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)
      const request = store.add(fileNode)

      request.onsuccess = () => resolve(fileNode)
      request.onerror = () => reject(new Error('Failed to create file'))
    })
  }

  /**
   * 读取文件内容
   */
  async readFile(path: string): Promise<FileSystemNode | null> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly')
      const store = transaction.objectStore(this.storeName)
      const index = store.index('path')
      const request = index.get(path)

      request.onsuccess = () => resolve(request.result || null)
      request.onerror = () => reject(new Error('Failed to read file'))
    })
  }

  /**
   * 更新文件内容
   */
  async updateFile(path: string, content: string): Promise<FileSystemNode> {
    const existingFile = await this.readFile(path)
    if (!existingFile) {
      throw new Error('File not found')
    }

    const updatedFile: FileSystemNode = {
      ...existingFile,
      content,
      modifiedAt: new Date(),
      size: content.length,
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)
      const request = store.put(updatedFile)

      request.onsuccess = () => resolve(updatedFile)
      request.onerror = () => reject(new Error('Failed to update file'))
    })
  }

  /**
   * 删除文件或目录
   */
  async deleteFile(path: string): Promise<void> {
    if (!this.db) await this.init()

    // 递归删除子文件/目录
    const files = await this.listDirectory(path)
    if (files.length > 0) {
      for (const file of files) {
        await this.deleteFile(file.path)
      }
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)
      const index = store.index('path')
      const request = index.openCursor(IDBKeyRange.only(path))

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result
        if (cursor) {
          cursor.delete()
          resolve()
        } else {
          resolve() // 文件不存在也算成功
        }
      }
      request.onerror = () => reject(new Error('Failed to delete file'))
    })
  }

  /**
   * 重命名文件或目录
   */
  async renameFile(oldPath: string, newPath: string): Promise<FileSystemNode> {
    const existingFile = await this.readFile(oldPath)
    if (!existingFile) {
      throw new Error('File not found')
    }

    const updatedFile: FileSystemNode = {
      ...existingFile,
      path: newPath,
      name: newPath.split('/').pop() || 'untitled',
      modifiedAt: new Date(),
    }

    // 更新子文件路径
    const children = await this.listDirectory(oldPath)
    for (const child of children) {
      const childNewPath = child.path.replace(oldPath, newPath)
      await this.renameFile(child.path, childNewPath)
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)
      const request = store.put(updatedFile)

      request.onsuccess = () => resolve(updatedFile)
      request.onerror = () => reject(new Error('Failed to rename file'))
    })
  }

  /**
   * 列出目录内容
   */
  async listDirectory(path: string = '/'): Promise<FileSystemNode[]> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly')
      const store = transaction.objectStore(this.storeName)
      // const results: FileSystemNode[] = [] // 预留变量，待实现搜索功能

      // 获取所有文件，然后在内存中过滤
      const request = store.getAll()

      request.onsuccess = () => {
        const allFiles = request.result
        
        // 过滤出指定路径下的直接子文件/目录
        const directChildren = allFiles.filter(file => {
          if (file.path === path) return false // 排除目录本身
          
          // 检查是否是直接子文件
          const relativePath = file.path.startsWith(path) ? file.path.slice(path.length) : ''
          const firstSlash = relativePath.indexOf('/')
          return firstSlash === -1 || (path === '/' && firstSlash === relativePath.length - 1)
        })

        resolve(directChildren.sort((a, b) => {
          // 目录排在前面，然后按名称排序
          if (a.type !== b.type) {
            return a.type === 'directory' ? -1 : 1
          }
          return a.name.localeCompare(b.name)
        }))
      }
      
      request.onerror = () => reject(new Error('Failed to list directory'))
    })
  }

  /**
   * 搜索文件
   */
  async searchFiles(query: string): Promise<FileSystemNode[]> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly')
      const store = transaction.objectStore(this.storeName)
      const request = store.getAll()

      request.onsuccess = () => {
        const allFiles = request.result
        const filtered = allFiles.filter(file => 
          file.name.toLowerCase().includes(query.toLowerCase()) ||
          (file.content && file.content.toLowerCase().includes(query.toLowerCase()))
        )
        resolve(filtered)
      }
      
      request.onerror = () => reject(new Error('Failed to search files'))
    })
  }

  /**
   * 获取文件树结构
   */
  async getFileTree(): Promise<FileSystemNode[]> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly')
      const store = transaction.objectStore(this.storeName)
      const request = store.getAll()

      request.onsuccess = () => {
        const allFiles = request.result
        const tree = this.buildFileTree(allFiles)
        resolve(tree)
      }
      
      request.onerror = () => reject(new Error('Failed to get file tree'))
    })
  }

  /**
   * 根据扩展名推断语言
   */
  private getLanguageFromExtension(extension: string): string {
    const extensionMap: Record<string, string> = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'html': 'html',
      'css': 'css',
      'scss': 'scss',
      'sass': 'sass',
      'less': 'less',
      'json': 'json',
      'md': 'markdown',
      'vue': 'vue',
      'svelte': 'svelte',
    }

    return extensionMap[extension?.toLowerCase()] || 'plaintext'
  }

  /**
   * 构建文件树结构
   */
  private buildFileTree(files: FileSystemNode[]): FileSystemNode[] {
    if (files.length === 0) {
      return []
    }

    const nodeMap = new Map<string, FileSystemNode>()
    const rootNodes: FileSystemNode[] = []

    // 创建所有节点的映射
    files.forEach(file => {
      nodeMap.set(file.path, { ...file })
    })

    // 构建树结构
    nodeMap.forEach(node => {
      const parentPath = this.getParentPath(node.path)
      
      // 如果父路径是根目录或者父路径不存在，则为根节点
      if (parentPath === '' || parentPath === '/' || !nodeMap.has(parentPath)) {
        rootNodes.push(node)
      } else {
        // 子节点
        const parent = nodeMap.get(parentPath)
        if (parent && parent.type === 'directory') {
          if (!parent.children) {
            parent.children = []
          }
          parent.children.push(node)
        } else {
          // 如果父节点不是目录或不存在，也作为根节点
          rootNodes.push(node)
        }
      }
    })

    return rootNodes.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'directory' ? -1 : 1
      }
      return a.name.localeCompare(b.name)
    })
  }

  /**
   * 获取父路径
   */
  private getParentPath(path: string): string {
    if (path === '/') return '/'
    const parts = path.split('/').filter(Boolean)
    parts.pop()
    return '/' + parts.join('/')
  }

  /**
   * 生成唯一ID
   */
  private generateId(): string {
    return `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * 执行文件操作
   */
  async executeOperation(operation: FileOperation): Promise<void> {
    switch (operation.type) {
      case 'create':
        await this.createFile(operation.path, operation.content, operation.isDirectory)
        break
      case 'delete':
        await this.deleteFile(operation.path)
        break
      case 'rename':
        await this.renameFile(operation.path, operation.newName)
        break
      case 'move':
        await this.renameFile(operation.path, operation.newPath)
        break
      case 'write':
        await this.updateFile(operation.path, operation.content)
        break
      default:
        throw new Error(`Unknown operation type: ${(operation as any).type}`)
    }
  }
}

// 导出单例实例
export const fileSystemService = new FileSystemService()