import React, { useRef, useEffect, useCallback, useMemo } from 'react'
import { Terminal as XTerminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { useAppStore } from '@/stores/useAppStore'
import type { FileSystemNode } from '@/types/index'
import 'xterm/css/xterm.css'

// 定义 ANSI 颜色代码
const ANSI = {
  RESET: '\x1b[0m',
  BRIGHT: '\x1b[1m',
  GREEN: '\x1b[32m',
  BLUE: '\x1b[34m',
  CYAN: '\x1b[36m',
  MAGENTA: '\x1b[35m',
  YELLOW: '\x1b[33m',
  RED: '\x1b[31m'
}

const Terminal: React.FC = () => {
  const terminalRef = useRef<HTMLDivElement>(null)
  const xtermRef = useRef<XTerminal | null>(null)
  const fitAddonRef = useRef<FitAddon | null>(null)

  // 终端状态
  const commandRef = useRef('')
  const currentPathRef = useRef('/home/user')
  const historyRef = useRef<string[]>([])
  const historyIndexRef = useRef(-1)

  // Store 引用
  const storeRef = useRef(useAppStore.getState())

  // 订阅 store 变化
  useEffect(() => {
    const unsubscribe = useAppStore.subscribe((state) => {
      storeRef.current = state
    })
    return unsubscribe
  }, [])

  // 获取当前 store 状态
  const getCurrentStore = useCallback(() => storeRef.current, [])

  // 缓存可用命令列表，避免每次都重新创建
  const availableCommands = useMemo(
    () => [
      'help',
      'clear',
      'ls',
      'pwd',
      'cd',
      'mkdir',
      'rm',
      'touch',
      'cat',
      'echo',
      'date',
      'whoami',
      'npm',
      'git'
    ],
    []
  )

  // 文件系统操作函数
  const findNodeByPath = useCallback(
    (path: string, nodes: FileSystemNode[]): FileSystemNode | null => {
      const cleanPath = path.replace(/^\/+/, '').replace(/\/+$/, '')
      if (!cleanPath) return null

      const parts = cleanPath.split('/')
      let current: FileSystemNode | null = null

      for (const part of parts) {
        const searchNodes: FileSystemNode[] = current
          ? current.children || []
          : nodes
        current =
          searchNodes.find((node: FileSystemNode) => node.name === part) || null
        if (!current) break
      }

      return current
    },
    []
  )

  const listDirectory = useCallback(
    (path: string): string[] => {
      const store = getCurrentStore()
      const node = findNodeByPath(path, (store as any).fileSystem || [])

      if (!node) {
        return [`ls: cannot access '${path}': No such file or directory`]
      }

      if (node.type !== 'directory') {
        return [`ls: '${path}': Not a directory`]
      }

      const items = (node.children || []).map((child: FileSystemNode) => {
        const color = child.type === 'directory' ? ANSI.BLUE : ANSI.RESET
        const suffix = child.type === 'directory' ? '/' : ''
        return `${color}${child.name}${suffix}${ANSI.RESET}`
      })

      return items.length > 0 ? items : ['(empty directory)']
    },
    [findNodeByPath, getCurrentStore]
  )

  const createDirectory = useCallback(
    (path: string): string => {
      const store = getCurrentStore()
      const parts = path.replace(/^\/+/, '').split('/')
      const dirName = parts.pop()!
      const parentPath = parts.join('/') || '/'

      const parentNode = findNodeByPath(
        parentPath,
        (store as any).fileSystem || []
      )
      if (!parentNode || parentNode.type !== 'directory') {
        return `mkdir: cannot create directory '${path}': No such file or directory`
      }

      const newDir: FileSystemNode = {
        id: `dir-${Date.now()}`,
        name: dirName,
        type: 'directory',
        path: path,
        children: [],
        createdAt: new Date(),
        modifiedAt: new Date()
      }

      store.addFile(newDir)
      return ''
    },
    [findNodeByPath, getCurrentStore]
  )

  const removeFileOrDirectory = useCallback(
    (path: string, recursive = false): string => {
      const store = getCurrentStore()
      const node = findNodeByPath(path, (store as any).fileSystem || [])

      if (!node) {
        return `rm: cannot remove '${path}': No such file or directory`
      }

      if (
        node.type === 'directory' &&
        !recursive &&
        (node.children || []).length > 0
      ) {
        return `rm: cannot remove '${path}': Directory not empty`
      }

      store.deleteFile(node.id)
      return ''
    },
    [findNodeByPath, getCurrentStore]
  )

  // 命令执行函数
  const executeCommand = useCallback(
    (term: XTerminal, cmd: string) => {
      if (!cmd.trim()) {
        prompt(term)
        return
      }

      // 添加到历史记录 - 避免重复添加
      const store = getCurrentStore()
      const lastCommand = historyRef.current[historyRef.current.length - 1]
      if (lastCommand !== cmd) {
        historyRef.current.push(cmd)
        store.addCommandHistory(cmd)
      }

      const args = cmd.split(' ')
      const command = args[0]
      const restArgs = args.slice(1)

      let output: string[] = []

      switch (command) {
        case 'help':
          output = [
            `${ANSI.YELLOW}Available commands:${ANSI.RESET}`,
            `  ${ANSI.CYAN}help${ANSI.RESET}         - Show this help message`,
            `  ${ANSI.CYAN}clear${ANSI.RESET}        - Clear the terminal`,
            `  ${ANSI.CYAN}ls${ANSI.RESET}           - List files in current directory`,
            `  ${ANSI.CYAN}ls [path]${ANSI.RESET}    - List files in specified directory`,
            `  ${ANSI.CYAN}pwd${ANSI.RESET}          - Print working directory`,
            `  ${ANSI.CYAN}cd [path]${ANSI.RESET}    - Change directory`,
            `  ${ANSI.CYAN}mkdir [dir]${ANSI.RESET}  - Create directory`,
            `  ${ANSI.CYAN}rm [file]${ANSI.RESET}    - Remove file`,
            `  ${ANSI.CYAN}rm -r [dir]${ANSI.RESET}  - Remove directory recursively`,
            `  ${ANSI.CYAN}touch [file]${ANSI.RESET} - Create empty file`,
            `  ${ANSI.CYAN}cat [file]${ANSI.RESET}   - Display file contents`,
            `  ${ANSI.CYAN}echo [text]${ANSI.RESET}  - Display text`,
            `  ${ANSI.CYAN}date${ANSI.RESET}         - Show current date and time`,
            `  ${ANSI.CYAN}whoami${ANSI.RESET}       - Show current user`,
            `  ${ANSI.CYAN}npm [command]${ANSI.RESET} - npm package manager (simulated)`,
            `  ${ANSI.CYAN}git [command]${ANSI.RESET} - git version control (simulated)`
          ]
          break

        case 'clear':
          term.clear()
          prompt(term)
          return

        case 'pwd':
          output = [currentPathRef.current]
          break

        case 'cd':
          if (restArgs.length === 0) {
            currentPathRef.current = '/home/user'
          } else {
            const targetPath = restArgs[0].startsWith('/')
              ? restArgs[0]
              : `${currentPathRef.current}/${restArgs[0]}`.replace(/\/+/g, '/')
            const node = findNodeByPath(targetPath, (store as any).fileSystem)
            if (node && node.type === 'directory') {
              currentPathRef.current = targetPath
            } else {
              output = [`cd: ${restArgs[0]}: No such file or directory`]
            }
          }
          break

        case 'ls':
          const listPath = restArgs[0] || currentPathRef.current
          output = listDirectory(listPath)
          break

        case 'mkdir':
          if (restArgs.length === 0) {
            output = ['mkdir: missing operand']
          } else {
            for (const dir of restArgs) {
              const fullPath = dir.startsWith('/')
                ? dir
                : `${currentPathRef.current}/${dir}`.replace(/\/+/g, '/')
              const result = createDirectory(fullPath)
              if (result) output.push(result)
            }
          }
          break

        case 'rm':
          if (restArgs.length === 0) {
            output = ['rm: missing operand']
          } else {
            const recursive = restArgs.includes('-r')
            const filesToRemove = recursive
              ? restArgs.filter((arg) => arg !== '-r')
              : restArgs

            for (const file of filesToRemove) {
              const fullPath = file.startsWith('/')
                ? file
                : `${currentPathRef.current}/${file}`.replace(/\/+/g, '/')
              const result = removeFileOrDirectory(fullPath, recursive)
              if (result) output.push(result)
            }
          }
          break

        case 'touch':
          if (restArgs.length === 0) {
            output = ['touch: missing file operand']
          } else {
            for (const fileName of restArgs) {
              const fullPath = fileName.startsWith('/')
                ? fileName
                : `${currentPathRef.current}/${fileName}`.replace(/\/+/g, '/')
              const existingNode = findNodeByPath(
                fullPath,
                (store as any).fileSystem
              )

              if (existingNode) {
                // Update existing file timestamp
                store.updateFile(existingNode.id, { modifiedAt: new Date() })
              } else {
                // Create new file
                const newFile: FileSystemNode = {
                  id: `file-${Date.now()}-${Math.random()}`,
                  name: fileName.split('/').pop()!,
                  type: 'file',
                  path: fullPath,
                  content: '',
                  createdAt: new Date(),
                  modifiedAt: new Date()
                }
                store.addFile(newFile)
              }
            }
          }
          break

        case 'cat':
          if (restArgs.length === 0) {
            output = ['cat: missing file operand']
          } else {
            for (const fileName of restArgs) {
              const fullPath = fileName.startsWith('/')
                ? fileName
                : `${currentPathRef.current}/${fileName}`.replace(/\/+/g, '/')
              const node = findNodeByPath(fullPath, (store as any).fileSystem)

              if (!node) {
                output.push(`cat: ${fileName}: No such file or directory`)
              } else if (node.type !== 'file') {
                output.push(`cat: ${fileName}: Is a directory`)
              } else {
                output.push(node.content || '(empty file)')
              }
            }
          }
          break

        case 'echo':
          output = [restArgs.join(' ')]
          break

        case 'date':
          output = [new Date().toString()]
          break

        case 'whoami':
          output = ['frontend-master']
          break

        // npm 命令模拟
        case 'npm':
          if (restArgs.length === 0) {
            output = [
              `${ANSI.YELLOW}Usage: npm <command>${ANSI.RESET}`,
              `${ANSI.CYAN}where <command> is one of:${ANSI.RESET}`,
              '    install, i, add      Install packages',
              '    run, start           Run scripts',
              '    test                 Run tests',
              '    build                Build project',
              '    dev                  Start development server'
            ]
          } else {
            const npmCommand = restArgs[0]
            switch (npmCommand) {
              case 'install':
              case 'i':
              case 'add':
                const packages = restArgs.slice(1)
                if (packages.length === 0) {
                  output = [
                    `${ANSI.GREEN}npm install${ANSI.RESET}`,
                    `Installing dependencies from package.json...`,
                    `${ANSI.GREEN}✓ Dependencies installed successfully${ANSI.RESET}`
                  ]
                } else {
                  output = [
                    `${ANSI.GREEN}npm install ${packages.join(' ')}${ANSI.RESET}`,
                    `Installing packages: ${packages.join(', ')}`,
                    `${ANSI.GREEN}✓ Packages installed successfully${ANSI.RESET}`
                  ]
                }
                break
              case 'run':
              case 'start':
                const scriptName = restArgs[1] || 'start'
                output = [
                  `${ANSI.GREEN}npm run ${scriptName}${ANSI.RESET}`,
                  `> ${scriptName}`,
                  `${ANSI.YELLOW}Starting development server...${ANSI.RESET}`,
                  `${ANSI.GREEN}✓ Server running at http://localhost:3000${ANSI.RESET}`
                ]
                break
              case 'test':
                output = [
                  `${ANSI.GREEN}npm test${ANSI.RESET}`,
                  `> test`,
                  `${ANSI.YELLOW}Running tests...${ANSI.RESET}`,
                  `${ANSI.GREEN}✓ Allz tests passed (12ms)${ANSI.RESET}`
                ]
                break
              case 'build':
                output = [
                  `${ANSI.GREEN}npm run build${ANSI.RESET}`,
                  `> build`,
                  `${ANSI.YELLOW}Building project...${ANSI.RESET}`,
                  `${ANSI.GREEN}✓ Build completed successfully${ANSI.RESET}`
                ]
                break
              case 'dev':
                output = [
                  `${ANSI.GREEN}npm run dev${ANSI.RESET}`,
                  `> dev`,
                  `${ANSI.YELLOW}Starting development server...${ANSI.RESET}`,
                  `${ANSI.GREEN}✓ Dev server running at http://localhost:5173${ANSI.RESET}`
                ]
                break
              default:
                output = [
                  `${ANSI.RED}npm: unknown command "${npmCommand}"${ANSI.RESET}`
                ]
            }
          }
          break

        // git 命令模拟
        case 'git':
          if (restArgs.length === 0) {
            output = [
              `${ANSI.YELLOW}Usage: git <command> [<args>]${ANSI.RESET}`,
              `${ANSI.CYAN}These are common Git commands:${ANSI.RESET}`,
              '    init      Initialize a new repository',
              '    status    Show the working tree status',
              '    add       Add file contents to the index',
              '    commit    Record changes to the repository',
              '    push      Update remote refs',
              '    pull      Fetch from and integrate with another repo',
              '    log       Show commit logs'
            ]
          } else {
            const gitCommand = restArgs[0]
            switch (gitCommand) {
              case 'init':
                output = [
                  `${ANSI.GREEN}Initialized empty Git repository in /home/user/.git/${ANSI.RESET}`
                ]
                break
              case 'status':
                output = [
                  `${ANSI.YELLOW}On branch main${ANSI.RESET}`,
                  `No commits yet`,
                  ``,
                  `${ANSI.GREEN}Changes to be committed:${ANSI.RESET}`,
                  `  (use "git rm --cached <file>..." to unstage)`,
                  `        new file:   src/App.tsx`,
                  `        new file:   package.json`
                ]
                break
              case 'add':
                const filesToAdd = restArgs.slice(1)
                if (filesToAdd.length === 0) {
                  output = [
                    `${ANSI.YELLOW}Nothing specified, nothing added.${ANSI.RESET}`,
                    `Maybe you want to use 'git add .'?`
                  ]
                } else {
                  output = [
                    `${ANSI.GREEN}Added ${filesToAdd.length} file(s) to staging area${ANSI.RESET}`
                  ]
                }
                break
              case 'commit':
                const messageIndex = restArgs.indexOf('-m')
                const message =
                  messageIndex !== -1 && restArgs[messageIndex + 1]
                    ? restArgs[messageIndex + 1].replace(/['"]/g, '')
                    : 'Initial commit'
                output = [
                  `${ANSI.GREEN}[main ${Math.random().toString(36).substr(2, 9)}] ${message}${ANSI.RESET}`,
                  ` 1 file changed, 12 insertions(+)`
                ]
                break
              case 'log':
                output = [
                  `${ANSI.YELLOW}commit ${Math.random().toString(36).substr(2, 9)}${ANSI.RESET}`,
                  `Author: frontend-master <user@example.com>`,
                  `Date: ${new Date().toLocaleString()}`,
                  ``,
                  `    Initial commit`,
                  ``,
                  `${ANSI.YELLOW}commit ${Math.random().toString(36).substr(2, 9)}${ANSI.RESET}`,
                  `Author: frontend-master <user@example.com>`,
                  `Date: ${new Date().toLocaleString()}`,
                  ``,
                  `    Add project files`
                ]
                break
              case 'push':
              case 'pull':
                const remote = restArgs[1] || 'origin'
                const branch = restArgs[2] || 'main'
                output = [
                  `${ANSI.GREEN}git ${gitCommand} ${remote} ${branch}${ANSI.RESET}`,
                  `${ANSI.YELLOW}Connecting to remote repository...${ANSI.RESET}`,
                  `${ANSI.GREEN}✓ Operation completed successfully${ANSI.RESET}`
                ]
                break
              default:
                output = [
                  `${ANSI.RED}git: '${gitCommand}' is not a git command${ANSI.RESET}`
                ]
            }
          }
          break

        default:
          output = [`${ANSI.RED}Command not found: ${command}${ANSI.RESET}`]
          break
      }

      // 输出结果 - 批量写入提高性能
      if (output.length > 0) {
        term.writeln(output.join('\r\n'))
      }

      // 显示提示符
      prompt(term)
    },
    [
      getCurrentStore,
      findNodeByPath,
      listDirectory,
      createDirectory,
      removeFileOrDirectory
    ]
  )

  // 缓存 ANSI 字符串，避免重复创建
  const ansiStrings = useMemo(
    () => ({
      userPrompt: `${ANSI.GREEN}user@frontend-master${ANSI.RESET}:`,
      pathPrefix: ANSI.BLUE,
      pathSuffix: `${ANSI.RESET}$ `,
      reset: ANSI.RESET
    }),
    []
  )

  // 显示提示符 - 使用缓存避免重复字符串创建
  const prompt = useCallback(
    (term: XTerminal) => {
      const pathDisplay = currentPathRef.current.replace('/home/user', '~')
      term.write(
        `${ansiStrings.userPrompt}${ansiStrings.pathPrefix}${pathDisplay}${ansiStrings.pathSuffix}`
      )
    },
    [ansiStrings]
  )

  // 清除当前输入行
  const clearCurrentLine = useCallback(
    (term: XTerminal) => {
      term.write('\x1b[2K\r')
      prompt(term)
    },
    [prompt]
  )

  useEffect(() => {
    if (!terminalRef.current) return

    // 初始化 xterm 实例
    const term = new XTerminal({
      cursorBlink: true,
      fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace",
      fontSize: 14,
      lineHeight: 1.2,
      theme: {
        background: '#1e1e1e',
        foreground: '#cccccc',
        cursor: '#ffffff',
        selectionBackground: 'rgba(255, 255, 255, 0.3)'
      },
      convertEol: true
    })

    const fitAddon = new FitAddon()
    term.loadAddon(fitAddon)

    term.open(terminalRef.current)
    fitAddon.fit()

    xtermRef.current = term
    fitAddonRef.current = fitAddon

    // 欢迎语
    term.writeln(
      `${ANSI.CYAN}FrontendMaster Terminal [Version 1.0.0]${ANSI.RESET}`
    )
    term.writeln('Type "help" for available commands.')
    term.writeln('')
    prompt(term)

    // 处理输入
    const onDataDisposable = term.onData((e) => {
      switch (e) {
        case '\r': // Enter
          term.write('\r\n')
          executeCommand(term, commandRef.current.trim())
          commandRef.current = ''
          historyIndexRef.current = -1
          break

        case '\u007F': // Backspace
          if (commandRef.current.length > 0) {
            commandRef.current = commandRef.current.slice(0, -1)
            term.write('\b \b')
          }
          break

        case '\u001b[A': // Up Arrow
          if (historyRef.current.length > 0) {
            if (historyIndexRef.current === -1) {
              historyIndexRef.current = historyRef.current.length - 1
            } else if (historyIndexRef.current > 0) {
              historyIndexRef.current--
            }

            const historyCommand = historyRef.current[historyIndexRef.current]
            if (historyCommand) {
              clearCurrentLine(term)
              commandRef.current = historyCommand
              term.write(historyCommand)
            }
          }
          break

        case '\u001b[B': // Down Arrow
          if (historyIndexRef.current !== -1) {
            if (historyIndexRef.current < historyRef.current.length - 1) {
              historyIndexRef.current++
              const historyCommand = historyRef.current[historyIndexRef.current]
              clearCurrentLine(term)
              commandRef.current = historyCommand
              term.write(historyCommand)
            } else {
              historyIndexRef.current = -1
              clearCurrentLine(term)
              commandRef.current = ''
            }
          }
          break

        case '\t': // Tab - 简单的自动补全
          const currentCommand = commandRef.current.trim()
          const matches = availableCommands.filter((cmd) =>
            cmd.startsWith(currentCommand)
          )

          if (matches.length === 1) {
            const completion = matches[0].slice(currentCommand.length)
            commandRef.current += completion
            term.write(completion)
          } else if (matches.length > 1) {
            term.write('\r\n')
            matches.forEach((cmd) => term.writeln(`  ${cmd}`))
            prompt(term)
            term.write(commandRef.current)
          }
          break

        default:
          // 普通字符
          if (
            e >= String.fromCharCode(0x20) &&
            e <= String.fromCharCode(0x7e)
          ) {
            commandRef.current += e
            term.write(e)
          }
      }
    })

    // 监听容器大小变化
    const resizeObserver = new ResizeObserver(() => {
      try {
        fitAddon.fit()
      } catch (e) {
        // 忽略 resize 时的偶尔报错
      }
    })
    resizeObserver.observe(terminalRef.current)

    // 清理函数
    return () => {
      onDataDisposable.dispose()
      term.dispose()
      resizeObserver.disconnect()
    }
  }, [prompt, clearCurrentLine, executeCommand])

  return (
    <div
      className="h-full w-full bg-[#1e1e1e] overflow-hidden"
      ref={terminalRef}
    />
  )
}

export default Terminal
