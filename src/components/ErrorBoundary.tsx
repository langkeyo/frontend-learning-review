import { Component, ErrorInfo, ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

/**
 * 错误边界组件
 * 捕获并处理React组件错误
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.props.onError?.(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center h-full p-8">
          <div className="text-6xl mb-4">💥</div>
          <h1 className="text-2xl font-bold mb-2">出现了一些问题</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            应用程序遇到了意外错误
          </p>
          <details className="text-left text-sm text-gray-500 dark:text-gray-400">
            <summary className="cursor-pointer mb-2 font-semibold">错误详情</summary>
            <pre className="mt-2 p-4 bg-gray-100 dark:bg-gray-800 rounded overflow-auto">
              {this.state.error?.stack}
            </pre>
          </details>
          <button
            className="mt-4 px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600"
            onClick={() => {
              this.setState({ hasError: false, error: undefined })
              window.location.reload()
            }}
          >
            重新加载页面
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary