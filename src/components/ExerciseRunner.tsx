import React, { useState, useCallback } from 'react'
import { Play, RotateCcw, CheckCircle, XCircle, Lightbulb } from 'lucide-react'
import { useAppStore } from '@/stores/useAppStore'
import { webContainerService } from '@/services/webContainerService'
import type { Exercise, TestCase } from '@/types/index'

interface ExerciseRunnerProps {
  exercise: Exercise
  onComplete: (success: boolean, result?: any) => void
  initialCode?: string
}

interface TestResult {
  testCase: TestCase
  passed: boolean
  actualOutput?: any
  error?: string
  duration: number
}

/**
 * 练习题执行器组件
 * 提供代码编辑、运行测试、查看结果等功能
 */
const ExerciseRunner: React.FC<ExerciseRunnerProps> = ({
  exercise,
  onComplete,
  initialCode = exercise.initialCode || ''
}) => {
  const [code, setCode] = useState(initialCode || '')
  const [isRunning, setIsRunning] = useState(false)
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [currentHintIndex, setCurrentHintIndex] = useState(-1)
  const [showHints, setShowHints] = useState(false)
  const [runCount, setRunCount] = useState(0)
  const setError = useAppStore((state) => state.setError)

  // 重置到初始代码
  const resetCode = useCallback(() => {
    setCode(initialCode)
    setTestResults([])
    setCurrentHintIndex(-1)
    setShowHints(false)
  }, [initialCode])

  // 显示下一个提示
  const showNextHint = useCallback(() => {
    if (currentHintIndex < exercise.hints.length - 1) {
      setCurrentHintIndex(prev => prev + 1)
      setShowHints(true)
    }
  }, [currentHintIndex, exercise.hints.length])

  // 运行测试用例
  const runTests = useCallback(async () => {
    if (!exercise.testCases || exercise.testCases.length === 0) {
      setError('该练习没有测试用例')
      return
    }

    setIsRunning(true)
    setRunCount(prev => prev + 1)
    
    try {
      const results: TestResult[] = []
      
      // 在 WebContainer 中创建临时测试文件
      const testFileName = `exercise_test_${Date.now()}.js`
      const userCode = code
      const testCode = generateTestCode(exercise.testCases, userCode)
      
      await webContainerService.writeFile(testFileName, testCode)
      
      // 运行测试
      const testProcess = await webContainerService.executeCommand('node', [testFileName])
      
      // 解析测试结果
      try {
        const output = testProcess.output.join('\n')
        const testResultsJson = JSON.parse(output || '{}')
        
        exercise.testCases.forEach((testCase, index) => {
          const testResult = testResultsJson[index]
          results.push({
            testCase,
            passed: testResult.passed,
            actualOutput: testResult.actualOutput,
            error: testResult.error,
            duration: testResult.duration || 0
          })
        })
      } catch (parseError) {
        // 如果无法解析 JSON，尝试简单的输出分析
        exercise.testCases.forEach((testCase) => {
          results.push({
            testCase,
            passed: testProcess.exitCode === 0,
            actualOutput: testProcess.output.join('\n'),
            error: testProcess.exitCode !== 0 ? 'Test execution failed' : undefined,
            duration: 0
          })
        })
      }
      
      setTestResults(results)
      
      // 检查是否所有测试都通过
      const allPassed = results.every(result => result.passed)
      onComplete(allPassed, { results, code })
      
    } catch (error) {
      setError(`运行测试失败: ${error}`)
    } finally {
      setIsRunning(false)
    }
  }, [code, exercise.testCases, onComplete, setError])

  // 生成测试代码
  // 生成测试代码
  const generateTestCode = (testCases: TestCase[], userCode: string): string => {
    const testFunctions = testCases.map((testCase) => {
      return `
  // Test Case: ${testCase.description}
  try {
    const input = ${JSON.stringify(testCase.input)};
    const expectedOutput = ${JSON.stringify(testCase.expectedOutput)};
    
    // 执行用户代码
    ${userCode.replace(/export/g, '// export').replace(/function/g, 'const testFunction = function')}
    
    // 调用函数并检查结果
    const result = testFunction ? testFunction(input) : undefined;
    const passed = JSON.stringify(result) === JSON.stringify(expectedOutput);
    
    console.log(JSON.stringify({
      passed,
      actualOutput: result,
      error: passed ? null : \`Expected \${JSON.stringify(expectedOutput)}, got \${JSON.stringify(result)}\`
    }));
  } catch (error) {
    console.log(JSON.stringify({
      passed: false,
      actualOutput: null,
      error: error.message
    }));
  }`
    }).join('\n')

    return testFunctions
  }

  // 获取统计信息
  const getStats = useCallback(() => {
    const passed = testResults.filter(r => r.passed).length
    const total = testResults.length
    const passedPercentage = total > 0 ? Math.round((passed / total) * 100) : 0
    return { passed, total, passedPercentage }
  }, [testResults])

  // 格式化测试结果
  const formatTestResult = (result: TestResult) => {
    const statusIcon = result.passed 
      ? <CheckCircle className="w-4 h-4 text-green-500" />
      : <XCircle className="w-4 h-4 text-red-500" />

    return (
      <div className={`border rounded-lg p-3 ${result.passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {statusIcon}
            <span className="font-medium">{result.testCase.description}</span>
          </div>
          <span className="text-xs text-gray-500">{result.duration}ms</span>
        </div>
        
        <div className="text-sm space-y-1">
          <div>
            <span className="font-medium">输入: </span>
            <code className="bg-gray-100 px-1 rounded">
              {JSON.stringify(result.testCase.input)}
            </code>
          </div>
          
          <div>
            <span className="font-medium">期望: </span>
            <code className="bg-gray-100 px-1 rounded">
              {JSON.stringify(result.testCase.expectedOutput)}
            </code>
          </div>
          
          {!result.passed && (
            <div>
              <span className="font-medium">实际: </span>
              <code className="bg-red-100 px-1 rounded text-red-700">
                {JSON.stringify(result.actualOutput)}
              </code>
            </div>
          )}
          
          {result.error && (
            <div className="text-red-600 text-sm">
              <span className="font-medium">错误: </span>
              {result.error}
            </div>
          )}
        </div>
      </div>
    )
  }

  const stats = getStats()

  return (
    <div className="exercise-runner h-full flex flex-col">
      {/* 练习描述 */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-2">{exercise.title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
          {exercise.description}
        </p>
        
        <div className="flex items-center gap-4 text-sm">
          <span className={`px-2 py-1 rounded-full ${
            exercise.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
            exercise.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {exercise.difficulty === 'easy' ? '简单' :
             exercise.difficulty === 'medium' ? '中等' : '困难'}
          </span>
          
          <span className="text-gray-500">
            {exercise.testCases?.length || 0} 个测试用例
          </span>
          
          {runCount > 0 && (
            <span className="text-gray-500">
              已运行 {runCount} 次
            </span>
          )}
        </div>
      </div>

      {/* 代码编辑器区域 */}
      <div className="flex-1 flex">
        <div className="flex-1 flex flex-col">
          <div className="p-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <span className="text-sm font-medium">代码编辑器</span>
            <button
              onClick={resetCode}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <RotateCcw size={14} />
              重置
            </button>
          </div>
          
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 p-4 font-mono text-sm border-0 resize-none focus:outline-none bg-white dark:bg-gray-900"
            placeholder="在这里输入你的代码..."
            spellCheck={false}
          />
        </div>

        {/* 侧边栏 - 提示和参考答案 */}
        <div className="w-80 border-l border-gray-200 dark:border-gray-700 flex flex-col">
          {/* 提示区域 */}
          <div className="flex-1 flex flex-col">
            <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lightbulb size={16} />
                <span className="text-sm font-medium">提示</span>
              </div>
              <button
                onClick={() => setShowHints(!showHints)}
                className="text-sm text-blue-500 hover:text-blue-600"
              >
                {showHints ? '隐藏' : '显示'}
              </button>
            </div>
            
            {showHints && (
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {exercise.hints.length === 0 ? (
                  <p className="text-gray-500 text-sm">暂无提示</p>
                ) : (
                  <>
                    {exercise.hints.slice(0, currentHintIndex + 1).map((hint, index) => (
                      <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="text-xs font-medium text-blue-700 mb-1">
                          提示 {index + 1}
                        </div>
                        <div className="text-sm text-blue-600">{hint}</div>
                      </div>
                    ))}
                    
                    {currentHintIndex < exercise.hints.length - 1 && (
                      <button
                        onClick={showNextHint}
                        className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                      >
                        显示下一个提示
                      </button>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* 参考答案 */}
          {exercise.solution && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">参考答案</span>
                <button
                  className="text-xs text-gray-500 hover:text-gray-700"
                  onClick={() => setCode(exercise.solution || '')}
                >
                  使用答案
                </button>
              </div>
              <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto">
                {exercise.solution}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* 测试运行区域 */}
      <div className="border-t border-gray-200 dark:border-gray-700">
        <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={runTests}
              disabled={isRunning || !code.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
            >
              {isRunning ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  运行中...
                </>
              ) : (
                <>
                  <Play size={16} />
                  运行测试
                </>
              )}
            </button>
            
            {testResults.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm">
                  {stats.passed}/{stats.total} 通过
                </span>
                <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${
                      stats.passedPercentage === 100 ? 'bg-green-500' :
                      stats.passedPercentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${stats.passedPercentage}%` }}
                  />
                </div>
              </div>
            )}
          </div>
          
          {stats.passedPercentage === 100 && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle size={20} />
              <span className="font-medium">所有测试通过！</span>
            </div>
          )}
        </div>
        
        {/* 测试结果 */}
        {testResults.length > 0 && (
          <div className="p-4 overflow-y-auto max-h-64">
            <h4 className="font-medium mb-3">测试结果</h4>
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div key={index}>
                  {formatTestResult(result)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ExerciseRunner