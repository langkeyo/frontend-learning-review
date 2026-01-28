import { WebContainer } from '@webcontainer/api'
import type { FileSystemNode } from '@/types/index'
import { fileSystemService } from './fileSystemService'

export interface WebContainerProcess {
  id: string
  command: string[]
  args: string[]
  status: 'running' | 'stopped' | 'completed'
  output: string[]
  exitCode?: number
  startTime: Date
  endTime?: Date
}

export interface DevServerInfo {
  url: string
  port: number
  status: 'starting' | 'running' | 'stopped'
}

/**
 * WebContainer 服务
 * 提供安全的代码执行环境
 */
class WebContainerService {
  private static instance: WebContainerService
  private container: WebContainer | null = null
  private processes: Map<string, WebContainerProcess> = new Map()
  private devServer: DevServerInfo | null = null
  private isInitialized = false

  private constructor() {}

  static getInstance(): WebContainerService {
    if (!WebContainerService.instance) {
      WebContainerService.instance = new WebContainerService()
    }
    return WebContainerService.instance
  }

  /**
   * 初始化 WebContainer
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return

    try {
      console.log('Initializing WebContainer...')
      this.container = await WebContainer.boot()
      
      // 设置基本的工作目录结构
      await this.setupFileSystem()
      
      this.isInitialized = true
      console.log('WebContainer initialized successfully')
    } catch (error) {
      console.error('Failed to initialize WebContainer:', error)
      throw new Error(`WebContainer 初始化失败: ${error}`)
    }
  }

  /**
   * 确保容器已初始化
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize()
    }
  }

  /**
   * 设置基础文件系统
   */
  private async setupFileSystem(): Promise<void> {
    if (!this.container) return

    // 创建基本的项目结构
    const files = await fileSystemService.getFileTree()
    
    // 将 IndexedDB 中的文件同步到 WebContainer
    await this.syncFilesToContainer(files)
    
    // 创建 package.json（如果不存在）
    const hasPackageJson = files.some(f => f.name === 'package.json')
    if (!hasPackageJson) {
      const defaultPackageJson = {
        name: 'frontend-master-project',
        version: '1.0.0',
        type: 'module',
        scripts: {
          dev: 'vite',
          build: 'vite build',
          preview: 'vite preview',
          test: 'vitest'
        },
        dependencies: {
          'react': '^18.2.0',
          'react-dom': '^18.2.0'
        },
        devDependencies: {
          '@types/react': '^18.2.43',
          '@types/react-dom': '^18.2.17',
          '@vitejs/plugin-react': '^4.2.1',
          'vite': '^5.0.8',
          'typescript': '^5.2.2'
        }
      }
      
      await this.container.fs.writeFile(
        'package.json',
        JSON.stringify(defaultPackageJson, null, 2)
      )
    }
  }

  /**
   * 同步文件到 WebContainer
   */
  private async syncFilesToContainer(files: FileSystemNode[]): Promise<void> {
    if (!this.container) return

    for (const file of files) {
      if (file.type === 'file' && file.content) {
        const containerPath = file.path.startsWith('/') ? file.path.slice(1) : file.path
        await this.container.fs.writeFile(containerPath, file.content)
      } else if (file.type === 'directory' && file.children) {
        // 递归同步子文件
        await this.syncFilesToContainer(file.children)
      }
    }
  }

  /**
   * 在容器中执行命令
   */
  async executeCommand(command: string, args: string[] = []): Promise<WebContainerProcess> {
    await this.ensureInitialized()
    if (!this.container) {
      throw new Error('WebContainer not initialized')
    }

    const processId = this.generateProcessId()
    const process: WebContainerProcess = {
      id: processId,
      command: [command, ...args],
      args,
      status: 'running',
      output: [],
      startTime: new Date()
    }

    this.processes.set(processId, process)

    try {
      console.log(`Executing command: ${command} ${args.join(' ')}`)
      
      const containerProcess = await this.container.spawn(command, args)
      const currentProcess = process
      
      // 监听输出
      containerProcess.output.pipeTo(
        new WritableStream({
          write(data) {
            currentProcess.output.push(data)
          }
        })
      )

      // 等待命令完成
      const exitCode = await containerProcess.exit
      
      currentProcess.status = exitCode === 0 ? 'completed' : 'stopped'
      currentProcess.exitCode = exitCode
      currentProcess.endTime = new Date()

      console.log(`Command completed with exit code: ${exitCode}`)
      
    } catch (error) {
      process.status = 'stopped'
      process.output.push(`Error: ${error}`)
      process.endTime = new Date()
    }

    return process
  }

  /**
   * 安装 npm 包
   */
  async installPackages(packages: string[] = []): Promise<WebContainerProcess> {
    const args = packages.length > 0 ? ['install', ...packages] : ['install']
    return this.executeCommand('npm', args)
  }

  /**
   * 启动开发服务器
   */
  async startDevServer(): Promise<DevServerInfo> {
    await this.ensureInitialized()
    if (!this.container) {
      throw new Error('WebContainer not initialized')
    }

    if (this.devServer?.status === 'running') {
      return this.devServer
    }

    // 启动开发服务器
    console.log('Starting development server...')
    
    const process = await this.executeCommand('npm', ['run', 'dev'])
    
    // 等待服务器启动并获取端口
    this.devServer = {
      url: '',
      port: 3000,
      status: 'starting'
    }

    try {
      // 等待服务器准备就绪
      this.container.on('server-ready', (port, url) => {
        console.log(`Dev server ready at ${url}`)
        this.devServer = {
          url,
          port,
          status: 'running'
        }
      })
      
      return this.devServer
      
    } catch (error) {
      this.devServer.status = 'stopped'
      throw new Error(`Failed to start dev server: ${error}`)
    }
  }

  /**
   * 停止开发服务器
   */
  async stopDevServer(): Promise<void> {
    if (!this.devServer || this.devServer.status !== 'running') {
      return
    }

    try {
      // TODO: 实现停止开发服务器的逻辑
      this.devServer.status = 'stopped'
      console.log('Dev server stopped')
    } catch (error) {
      throw new Error(`Failed to stop dev server: ${error}`)
    }
  }

  /**
   * 运行测试
   */
  async runTests(): Promise<WebContainerProcess> {
    return this.executeCommand('npm', ['test'])
  }

  /**
   * 构建项目
   */
  async buildProject(): Promise<WebContainerProcess> {
    return this.executeCommand('npm', ['run', 'build'])
  }

  /**
   * 预览构建结果
   */
  async previewBuild(): Promise<DevServerInfo> {
    const buildProcess = await this.executeCommand('npm', ['run', 'preview'])
    
    this.devServer = {
      url: '',
      port: 4173,
      status: 'starting'
    }

    try {
      // 等待预览服务器准备就绪
      this.container!.on('server-ready', (port, url) => {
        this.devServer = {
          url,
          port,
          status: 'running'
        }
      })
      
      return this.devServer
      
    } catch (error) {
      this.devServer.status = 'stopped'
      throw new Error(`Failed to preview build: ${error}`)
    }
  }

  /**
   * 写入文件到容器
   */
  async writeFile(path: string, content: string): Promise<void> {
    await this.ensureInitialized()
    if (!this.container) {
      throw new Error('WebContainer not initialized')
    }

    const containerPath = path.startsWith('/') ? path.slice(1) : path
    await this.container.fs.writeFile(containerPath, content)
  }

  /**
   * 从容器读取文件
   */
  async readFile(path: string): Promise<string> {
    await this.ensureInitialized()
    if (!this.container) {
      throw new Error('WebContainer not initialized')
    }

    const containerPath = path.startsWith('/') ? path.slice(1) : path
    return await this.container.fs.readFile(containerPath, 'utf-8')
  }

  /**
   * 获取进程信息
   */
  getProcess(id: string): WebContainerProcess | undefined {
    return this.processes.get(id)
  }

  /**
   * 获取所有进程
   */
  getAllProcesses(): WebContainerProcess[] {
    return Array.from(this.processes.values())
  }

  /**
   * 获取开发服务器信息
   */
  getDevServerInfo(): DevServerInfo | null {
    return this.devServer
  }

  /**
   * 清理进程
   */
  cleanup(): void {
    this.processes.clear()
    this.devServer = null
  }

  /**
   * 重启容器
   */
  async restart(): Promise<void> {
    this.cleanup()
    this.isInitialized = false
    this.container = null
    await this.initialize()
  }

  /**
   * 生成进程ID
   */
  private generateProcessId(): string {
    return `process_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * 检查容器是否支持
   */
  static isSupported(): boolean {
    return typeof WebContainer !== 'undefined'
  }

  /**
   * 获取容器状态
   */
  getStatus(): {
    isSupported: boolean
    isInitialized: boolean
    devServer: DevServerInfo | null
    activeProcesses: number
  } {
    return {
      isSupported: WebContainerService.isSupported(),
      isInitialized: this.isInitialized,
      devServer: this.devServer,
      activeProcesses: this.processes.size
    }
  }
}

// 导出单例实例
export const webContainerService = WebContainerService.getInstance()