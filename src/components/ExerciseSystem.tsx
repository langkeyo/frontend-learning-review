import React, { useState, useCallback } from 'react'
import type { Exercise, TestCase } from '@/types/index'

interface ExerciseSystemProps {
  exercises: Exercise[]
  onExerciseComplete: (exerciseId: string, solution: string) => void
  onHintRequest: (exerciseId: string, hintIndex: number) => void
}

const ExerciseSystem: React.FC<ExerciseSystemProps> = ({
  exercises,
  onExerciseComplete,
  onHintRequest
}) => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [userCode, setUserCode] = useState('')
  const [testResults, setTestResults] = useState<{ [key: string]: boolean }>({})
  const [showHints, setShowHints] = useState<{ [key: string]: number }>({})
  const [isRunning, setIsRunning] = useState(false)

  const currentExercise = exercises[currentExerciseIndex]

  // 运行测试用例
  const runTests = useCallback(async () => {
    if (!currentExercise) return
    
    setIsRunning(true)
    const results: { [key: string]: boolean } = {}
    
    try {
      // 创建一个安全的执行环境
      const testFunction = new Function('code', `
        ${currentExercise.initialCode || ''}
        ${userCode}
        return {
          // 这里需要根据具体的练习类型来实现测试逻辑
          // 简化版本：假设用户代码中有一个solution函数
          typeof solution !== 'undefined' ? solution : null
        }
      `)
      
      const solution = testFunction(userCode)
      
      if (currentExercise.testCases) {
        for (const testCase of currentExercise.testCases) {
          try {
            // 这里应该根据具体的题目类型来执行测试
            const result = await runTestCase(solution, testCase)
            results[testCase.id] = result
          } catch (error) {
            console.error('Test case error:', error)
            results[testCase.id] = false
          }
        }
      }
    } catch (error) {
      console.error('Code execution error:', error)
      // 语法错误等情况
    }
    
    setTestResults(results)
    setIsRunning(false)
    
    // 检查是否所有测试都通过
    const allPassed = Object.values(results).every(result => result === true)
    if (allPassed && Object.keys(results).length > 0) {
      onExerciseComplete(currentExercise.id, userCode)
    }
  }, [currentExercise, userCode, onExerciseComplete])

  // 运行单个测试用例
  const runTestCase = async (solution: any, testCase: TestCase): Promise<boolean> => {
    // 这里需要根据具体的题目类型来实现测试逻辑
    // 简化实现：假设solution是一个函数，我们调用它并比较结果
    if (typeof solution === 'function') {
      try {
        const result = solution(testCase.input)
        return JSON.stringify(result) === JSON.stringify(testCase.expectedOutput)
      } catch (error) {
        return false
      }
    }
    
    // 对于其他类型的题目，需要不同的测试逻辑
    return false
  }

  // 获取提示
  const getHint = useCallback(() => {
    if (!currentExercise) return
    
    const currentHintIndex = (showHints[currentExercise.id] || 0) + 1
    if (currentHintIndex <= currentExercise.hints.length) {
      setShowHints(prev => ({
        ...prev,
        [currentExercise.id]: currentHintIndex
      }))
      onHintRequest(currentExercise.id, currentHintIndex - 1)
    }
  }, [currentExercise, showHints, onHintRequest])

  // 重置代码
  const resetCode = useCallback(() => {
    if (currentExercise?.initialCode) {
      setUserCode(currentExercise.initialCode)
    }
    setTestResults({})
  }, [currentExercise])

  // 下一个练习
  const nextExercise = useCallback(() => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1)
      setUserCode('')
      setTestResults({})
      setShowHints(prev => ({ ...prev, [exercises[currentExerciseIndex + 1].id]: 0 }))
    }
  }, [currentExerciseIndex, exercises])

  // 上一个练习
  const prevExercise = useCallback(() => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1)
      setUserCode('')
      setTestResults({})
    }
  }, [currentExerciseIndex])

  if (!currentExercise) {
    return (
      <div className="text-center py-8 text-gray-500">
        <div className="text-4xl mb-2">🎯</div>
        <p>没有可用的练习题</p>
      </div>
    )
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400'
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'hard': return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400'
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400'
    }
  }

  const getExerciseTypeIcon = (type: string) => {
    switch (type) {
      case 'code-completion': return '📝'
      case 'implementation': return '⚙️'
      case 'debug': return '🐛'
      default: return '💻'
    }
  }

  return (
    <div className="exercise-system">
      {/* 练习头部 */}
      <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <span className="mr-2">{getExerciseTypeIcon(currentExercise.type)}</span>
              {currentExercise.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {currentExercise.description}
            </p>
          </div>
          <div className="ml-4">
            <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(currentExercise.difficulty)}`}>
              {currentExercise.difficulty === 'easy' ? '简单' : 
               currentExercise.difficulty === 'medium' ? '中等' : '困难'}
            </span>
          </div>
        </div>
        
        {/* 练习进度 */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>练习 {currentExerciseIndex + 1} / {exercises.length}</span>
          <div className="flex space-x-2">
            <button
              onClick={prevExercise}
              disabled={currentExerciseIndex === 0}
              className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
            >
              ← 上一题
            </button>
            <button
              onClick={nextExercise}
              disabled={currentExerciseIndex === exercises.length - 1}
              className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
            >
              下一题 →
            </button>
          </div>
        </div>
      </div>

      {/* 代码编辑器区域 */}
      <div className="mb-6">
        <div className="bg-gray-900 text-gray-100 rounded-lg overflow-hidden">
          <div className="bg-gray-800 px-4 py-2 text-sm font-mono">
            solution.js
          </div>
          <textarea
            value={userCode || (currentExercise.initialCode || '')}
            onChange={(e) => setUserCode(e.target.value)}
            className="w-full h-64 p-4 bg-gray-900 text-gray-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="在这里编写你的代码..."
            spellCheck={false}
          />
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={runTests}
          disabled={isRunning}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center"
        >
          {isRunning ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
              运行中...
            </>
          ) : (
            '▶️ 运行测试'
          )}
        </button>
        
        <button
          onClick={resetCode}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          🔄 重置代码
        </button>
        
        <button
          onClick={getHint}
          disabled={(showHints[currentExercise.id] || 0) >= currentExercise.hints.length}
          className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50"
        >
          💡 提示 ({(showHints[currentExercise.id] || 0)}/{currentExercise.hints.length})
        </button>
      </div>

      {/* 提示区域 */}
      {showHints[currentExercise.id] > 0 && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg dark:bg-yellow-900/20 dark:border-yellow-800">
          <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">💡 提示</h4>
          <div className="space-y-2">
            {currentExercise.hints.slice(0, showHints[currentExercise.id]).map((hint, index) => (
              <div key={index} className="text-sm text-yellow-700 dark:text-yellow-400">
                {index + 1}. {hint}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 测试结果 */}
      {Object.keys(testResults).length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold mb-3">🧪 测试结果</h4>
          <div className="space-y-2">
            {currentExercise.testCases?.map((testCase, index) => {
              const passed = testResults[testCase.id]
              return (
                <div
                  key={testCase.id}
                  className={`p-3 rounded-lg border ${
                    passed 
                      ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                      : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="mr-2">
                        {passed ? '✅' : '❌'}
                      </span>
                      <span className="font-medium text-sm">
                        测试用例 {index + 1}
                      </span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      passed 
                        ? 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200'
                        : 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200'
                    }`}>
                      {passed ? '通过' : '失败'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {testCase.description}
                  </div>
                  {!passed && (
                    <div className="text-xs text-red-600 dark:text-red-400 mt-2">
                      预期输出: {JSON.stringify(testCase.expectedOutput)}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          
          {Object.values(testResults).every(result => result === true) && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-center dark:bg-green-900/20 dark:border-green-800">
              <div className="text-2xl mb-2">🎉</div>
              <div className="font-semibold text-green-800 dark:text-green-300">
                恭喜！所有测试用例都通过了！
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ExerciseSystem