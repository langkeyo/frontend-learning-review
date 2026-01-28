import React, { useCallback, useMemo, useState } from 'react'
import { useAppStore } from '@/stores/useAppStore'
import { LEARNING_PATH } from '@/constants'
import type { LearningStage, Lesson } from '@/types/index'
import ProgressBar from '@/components/ui/ProgressBar'
import ProgressIndicator from '@/components/ui/ProgressIndicator'
import ContentRenderer from '@/components/ui/ContentRenderer'
import ExerciseSystem from '@/components/ExerciseSystem'

/**
 * 学习面板组件 - 增强版
 * 显示学习路径和课程内容，包含丰富的交互和视觉反馈
 */
const LearningPanel: React.FC = () => {
  const learningPath = useAppStore((state) => (state as any).learningPath)
  const currentStage = useAppStore((state) => (state as any).currentStage)
  const currentLesson = useAppStore((state) => (state as any).currentLesson)
  const setCurrentStage = useAppStore((state) => state.setCurrentStage)
const setCurrentLesson = useAppStore((state) => state.setCurrentLesson)
  const updateProgress = useAppStore((state) => state.updateProgress)
  const openFile = useAppStore((state) => state.openFile)
  const [showExerciseSystem, setShowExerciseSystem] = useState(false)

  // 获取学习统计数据
  const getLearningStats = useMemo(() => {
    if (!currentData) return { totalLessons: 0, completedLessons: 0, totalTime: 0 }
    
    const totalLessons = currentData.stages.reduce((acc: number, stage: any) => acc + stage.lessons.length, 0)
    const completedLessons = currentData.stages.reduce((acc: number, stage: any) => 
      acc + stage.lessons.filter((lesson: any) => (lesson as any).progress >= 100).length, 0
    )
    const totalTime = currentData.stages.reduce((acc: number, stage: any) => 
      acc + stage.lessons.reduce((lessonAcc: number, lesson: any) => lessonAcc + lesson.estimatedTime, 0), 0
    )
    
    return { totalLessons, completedLessons, totalTime }
  }, [currentData])

  // 根据阶段生成具体的学习内容
  const getStageContent = (stageId: string, stageTitle: string) => {
    const contentMap: Record<string, any> = {
      'html-css': {
        theoryContent: `
          <h3 class="text-lg font-bold mb-3">HTML5 & CSS3 核心概念</h3>
          <div class="space-y-3">
            <div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
              <h4 class="font-semibold text-blue-700 dark:text-blue-300">📋 学习目标</h4>
              <ul class="mt-2 space-y-1 text-sm">
                <li>• 掌握HTML5语义化标签的正确使用</li>
                <li>• 理解CSS3现代布局技术（Flexbox、Grid）</li>
                <li>• 学会响应式设计的实现方法</li>
              </ul>
            </div>
            <div class="bg-green-50 dark:bg-green-900/20 p-3 rounded">
              <h4 class="font-semibold text-green-700 dark:text-green-300">🎯 核心要点</h4>
              <ul class="mt-2 space-y-1 text-sm">
                <li>• 语义化标签：header、nav、main、article、section</li>
                <li>• Flexbox布局：容器属性与项目属性</li>
                <li>• CSS Grid：网格布局系统</li>
                <li>• 媒体查询与响应式设计</li>
              </ul>
            </div>
          </div>
        `,
        practiceContent: `
          <h3 class="text-lg font-bold mb-3">实战练习任务</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
            完成一个响应式的个人作品集页面，包含导航、内容区域和页脚。
          </p>
        `,
        projectContent: `
          <h3 class="text-lg font-bold mb-3">🚀 项目挑战</h3>
          <p class="text-sm mb-3">
            设计并实现一个完整的响应式电商首页，包含商品展示、筛选功能和购物车入口。
          </p>
          <div class="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded text-sm">
            <strong>技术要求：</strong>语义化HTML、Flexbox/Grid布局、响应式设计、CSS动画
          </div>
        `,
        exercises: [
          {
            id: 'ex-html-css-1',
            title: '创建语义化结构',
            description: '使用HTML5语义化标签构建页面基础结构',
            type: 'code-completion' as const,
            difficulty: 'easy' as const,
            initialCode: `<!-- 请完成下面的语义化HTML结构 -->
<___ class="container">
  <___>网站导航</___>
  <___>主要内容</___>
  <___>页脚信息</___>
</___>`,
            solution: `<!-- 语义化HTML结构 -->
<div class="container">
  <header>网站导航</header>
  <main>主要内容</main>
  <footer>页脚信息</footer>
</div>`,
            hints: ['使用header、main、footer等语义化标签', '注意标签的嵌套关系'],
            testCases: []
          }
        ]
      },
      'javascript-es6': {
        theoryContent: `
          <h3 class="text-lg font-bold mb-3">JavaScript ES6+ 现代特性</h3>
          <div class="space-y-3">
            <div class="bg-purple-50 dark:bg-purple-900/20 p-3 rounded">
              <h4 class="font-semibold text-purple-700 dark:text-purple-300">⚡ 核心特性</h4>
              <ul class="mt-2 space-y-1 text-sm">
                <li>• 箭头函数与this绑定</li>
                <li>• 解构赋值与扩展运算符</li>
                <li>• Promise与async/await</li>
                <li>• 模块化（import/export）</li>
              </ul>
            </div>
          </div>
        `,
        practiceContent: `<h3>ES6特性练习</h3><p>使用现代JavaScript语法重构传统代码</p>`,
        projectContent: `<h3>异步编程项目</h3><p>构建一个数据可视化应用，处理异步数据流</p>`,
        exercises: []
      },
      // 其他阶段的默认内容
      'default': {
        theoryContent: `<h3 class="text-lg font-bold mb-3">${stageTitle}核心概念</h3><p>掌握${stageTitle}的核心知识点和最佳实践。</p>`,
        practiceContent: `<h3>实战练习</h3><p>通过实际练习巩固${stageTitle}的知识。</p>`,
        projectContent: `<h3>项目实战</h3><p>运用${stageTitle}完成一个完整项目。</p>`,
        exercises: []
      }
    }

    return contentMap[stageId] || contentMap['default']
  }

  // 计算阶段解锁状态的智能算法
  const calculateStageUnlocking = useCallback((stages: any[]) => {
    return stages.map((stage, index) => {
      let isLocked = false
      let progress = 0
      
      if (index === 0) {
        // 第一个阶段默认解锁
        isLocked = false
        progress = 25 // 模拟部分进度
      } else {
        // 检查前一个阶段的完成情况
        const previousStage = stages[index - 1]
        const previousProgress = previousStage?.progress || 0
        
        // 解锁条件：前一个阶段完成度达到80%
        if (previousProgress >= 80) {
          isLocked = false
          // 如果是新解锁的阶段，给予初始进度
          progress = stage.progress || 0
        } else {
          isLocked = true
          progress = 0
        }
      }
      
      const isCompleted = progress >= 100
      
      return {
        ...stage,
        isLocked,
        progress,
        isCompleted,
        unlockThreshold: 80, // 解锁阈值
        unlockProgress: index > 0 ? (stages[index - 1]?.progress || 0) : 100
      }
    })
  }, [])

// 增强的学习路径数据，包含丰富的内容和交互元素
  const mockLearningPath = useMemo(() => {
    const baseStages = LEARNING_PATH.stages.map((stage, index) => {
      const stageContent = getStageContent(stage.id, stage.title)
      
      return {
        ...stage,
        id: stage.id,
        title: stage.title,
        description: stage.description,
        order: index + 1,
        lessons: [
          {
            id: `${stage.id}-lesson-1`,
            title: `${stage.title} - 核心概念`,
            type: 'theory' as const,
            content: stageContent.theoryContent,
            estimatedTime: 30,
            exercises: [],
            completed: false
          },
          {
            id: `${stage.id}-lesson-2`,
            title: `${stage.title} - 实战练习`,
            type: 'practice' as const,
            content: stageContent.practiceContent,
            estimatedTime: 45,
            exercises: stageContent.exercises,
            completed: false
          },
          {
            id: `${stage.id}-lesson-3`,
            title: `${stage.title} - 项目挑战`,
            type: 'project' as const,
            content: stageContent.projectContent,
            estimatedTime: 60,
            exercises: [],
            completed: false
          }
        ]
      }
    })

    // 应用智能解锁算法
    const enhancedStages = calculateStageUnlocking(baseStages)

    return {
      id: 'frontend-master-path',
      title: '前端工程化学习路径',
      description: '从基础到高级的完整前端学习体系，包含实战项目和最佳实践',
      totalProgress: Math.round(enhancedStages.reduce((acc, stage) => acc + stage.progress, 0) / enhancedStages.length),
      stages: enhancedStages,
      enrolledStudents: 12850,
      rating: 4.8,
      totalDuration: enhancedStages.reduce((acc, stage) => acc + stage.lessons.reduce((lessonAcc, lesson) => lessonAcc + lesson.estimatedTime, 0), 0)
    }
  }, [calculateStageUnlocking])

  const currentData = learningPath || mockLearningPath

  // 处理阶段切换
  const handleStageSelect = useCallback((stage: LearningStage) => {
    if (!stage.isLocked) {
      setCurrentStage(stage)
      if (stage.lessons.length > 0) {
        setCurrentLesson(stage.lessons[0])
      }
    }
  }, [setCurrentStage, setCurrentLesson])

  // 处理课程选择
  const handleLessonSelect = useCallback((lesson: Lesson) => {
    setCurrentLesson(lesson)
  }, [setCurrentLesson])

// 继续学习（自动选择下一个未完成的课程）
  const handleContinueLearning = useCallback(() => {
    if (!currentStage) return
    
    const nextLesson = currentStage.lessons.find((lesson: any) => 
      (lesson as any).progress !== 100
    )
    
    if (nextLesson) {
      setCurrentLesson(nextLesson)
    } else {
      // 当前阶段已完成，选择下一个阶段
      const currentIndex = mockLearningPath.stages.findIndex((s: any) => s.id === currentStage.id)
      const nextStage = mockLearningPath.stages[currentIndex + 1]
      if (nextStage && !nextStage.isLocked) {
        setCurrentStage(nextStage)
        setCurrentLesson(nextStage.lessons[0])
      }
    }
  }, [currentStage, setCurrentLesson, setCurrentStage, mockLearningPath.stages])

  // 练习完成回调
  const handleExerciseComplete = useCallback((exerciseId: string, solution: string) => {
    console.log('Exercise completed:', exerciseId, solution)
    // TODO: 更新练习完成状态和进度
    if (currentStage && currentLesson) {
      updateProgress(currentStage.id, currentLesson.id, 100)
    }
  }, [currentStage, currentLesson, updateProgress])

  // 提示请求回调
  const handleHintRequest = useCallback((exerciseId: string, hintIndex: number) => {
    console.log('Hint requested:', exerciseId, hintIndex)
    // TODO: 记录提示使用情况
  }, [])

  // IDE集成：创建练习文件
  const createExerciseFile = useCallback((lesson: Lesson) => {
    if (!lesson.exercises || lesson.exercises.length === 0) return
    
    const exercise = lesson.exercises[0] // 使用第一个练习题
    const fileName = `${lesson.title.replace(/[^a-zA-Z0-9]/g, '_')}.js`
    const filePath = `/exercises/${fileName}`
    
    // 创建练习文件内容
    const fileContent = `// ${exercise.title}
// ${exercise.description}

// 在这里编写你的代码
${exercise.initialCode || '// 在这里开始编写...'}

// 提示：
${exercise.hints.map((hint, index) => `// ${index + 1}. ${hint}`).join('\n')}
`
    
    // 创建虚拟文件对象并打开
    const virtualFile = {
      id: `exercise-${exercise.id}`,
      name: fileName,
      content: fileContent,
      language: 'javascript',
      path: filePath,
      type: 'file' as const,
      isDirectory: false,
      createdAt: new Date(),
      modifiedAt: new Date()
    }
    
    openFile(virtualFile)
    console.log('Created exercise file:', fileName)
  }, [openFile])

  // IDE集成：创建项目文件结构
  const createProjectFiles = useCallback((lesson: Lesson) => {
    const projectFiles = [
      {
        id: `project-${lesson.id}-index`,
        name: 'index.html',
        content: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${lesson.title}</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div id="app">
        <h1>${lesson.title}</h1>
        <p>开始你的项目开发...</p>
    </div>
    <script src="script.js"></script>
</body>
</html>`,
        language: 'html',
        path: '/project/index.html',
        type: 'file' as const,
        isDirectory: false,
        createdAt: new Date(),
        modifiedAt: new Date()
      },
      {
        id: `project-${lesson.id}-style`,
        name: 'style.css',
        content: `/* ${lesson.title} - 样式文件 */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Arial', sans-serif;
    line-height: 1.6;
}

#app {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

h1 {
    color: #333;
    margin-bottom: 20px;
}

/* 在这里添加你的样式 */`,
        language: 'css',
        path: '/project/style.css',
        type: 'file' as const,
        isDirectory: false,
        createdAt: new Date(),
        modifiedAt: new Date()
      },
      {
        id: `project-${lesson.id}-script`,
        name: 'script.js',
        content: `// ${lesson.title} - 脚本文件
console.log('项目开始:', '${lesson.title}')

// 在这里添加你的JavaScript代码

document.addEventListener('DOMContentLoaded', function() {
    // DOM加载完成后执行
    console.log('DOM loaded')
})`,
        language: 'javascript',
        path: '/project/script.js',
        type: 'file' as const,
        isDirectory: false,
        createdAt: new Date(),
        modifiedAt: new Date()
      }
    ]
    
    // 打开主要文件（index.html）
    openFile(projectFiles[0])
    console.log('Created project files for:', lesson.title)
  }, [openFile])

  if (!currentData) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🎯</div>
          <h2 className="text-2xl font-bold mb-2">FrontendMaster</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            选择一个学习路径开始你的前端工程化之旅
          </p>
          <button 
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg"
            onClick={() => setCurrentStage(mockLearningPath.stages[0])}
          >
            🚀 开始学习
          </button>
        </div>
      </div>
    )
  }

    const stats = getLearningStats

  return (
    <div className="p-6 h-full overflow-y-auto">
      {/* 学习路径头部信息 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">📚 {currentData.title}</h2>
          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
            <span className="flex items-center">
              ⭐ {currentData.rating}
            </span>
            <span className="flex items-center">
              👥 {currentData.enrolledStudents.toLocaleString()}
            </span>
            <span className="flex items-center">
              ⏱️ {Math.round(currentData.totalDuration / 60)}小时
            </span>
          </div>
        </div>
        
        {/* 学习统计 */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center">
              <span className="text-2xl mr-2">📖</span>
              <div>
                <div className="text-lg font-semibold text-blue-700 dark:text-blue-300">
                  {stats.totalLessons}
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-400">总课程数</div>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center">
              <span className="text-2xl mr-2">✅</span>
              <div>
                <div className="text-lg font-semibold text-green-700 dark:text-green-300">
                  {stats.completedLessons}
                </div>
                <div className="text-xs text-green-600 dark:text-green-400">已完成</div>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-center">
              <span className="text-2xl mr-2">📊</span>
              <div>
                <div className="text-lg font-semibold text-purple-700 dark:text-purple-300">
                  {stats.totalLessons > 0 ? Math.round((stats.completedLessons / stats.totalLessons) * 100) : 0}%
                </div>
                <div className="text-xs text-purple-600 dark:text-purple-400">完成率</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 总进度展示 */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 mb-4 border border-blue-200 dark:border-blue-800">
          <ProgressBar
            progress={currentData.totalProgress}
            label="总体学习进度"
            showPercentage={true}
            animated={true}
            height="md"
            color="blue"
          />
        </div>
      </div>

      {/* 当前阶段信息卡片 */}
      {currentStage && (
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <span className="mr-2">
                  {currentStage.isCompleted ? '✅' : currentStage.isLocked ? '🔒' : '📖'}
                </span>
                {currentStage.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {currentStage.description}
              </p>
            </div>
            <div className="ml-4">
              <ProgressIndicator
                value={currentStage.progress}
                max={100}
                size="md"
                color={currentStage.isCompleted ? 'green' : 'blue'}
                showValue={true}
              />
            </div>
          </div>
          
          {/* 阶段进度条 */}
          <ProgressBar
            progress={currentStage.progress}
            label="阶段进度"
            showPercentage={true}
            height="sm"
            color={currentStage.isCompleted ? 'green' : 'blue'}
          />
          
          {/* 继续学习按钮 */}
          {!currentStage.isLocked && currentStage.progress < 100 && (
            <div className="mt-4">
              <button
                className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-sm"
                onClick={handleContinueLearning}
              >
                🚀 继续学习
              </button>
            </div>
          )}
        </div>
      )}

      {/* 当前课程内容卡片 */}
      {currentLesson && !showExerciseSystem && (
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
          {/* 课程头部 */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h4 className="text-md font-medium flex items-center">
                <span className="mr-2">
                  {currentLesson.type === 'theory' ? '📖' : 
                   currentLesson.type === 'practice' ? '💻' : '🚀'}
                </span>
                {currentLesson.title}
              </h4>
              <div className="flex items-center text-sm text-gray-500">
                <span className="mr-2">⏱️</span>
                {currentLesson.estimatedTime} 分钟
              </div>
            </div>
          </div>
          
          {/* 课程内容 */}
          <div className="p-4">
            {currentLesson.type === 'theory' && (
              <div className="prose prose-sm max-w-none">
                {currentLesson.content ? (
                  <ContentRenderer content={currentLesson.content} type="html" />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">📝</div>
                    <p>课程内容正在准备中...</p>
                  </div>
                )}
              </div>
            )}
            
            {currentLesson.type === 'practice' && (
              <div>
                <div className="text-center py-6">
                  <div className="text-5xl mb-4">💻</div>
                  <h5 className="text-lg font-semibold mb-2">实战练习</h5>
                </div>
                
                {currentLesson.content ? (
                  <div className="mb-6">
                    <ContentRenderer content={currentLesson.content} type="html" />
                  </div>
                ) : (
                  <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
                    准备好开始练习了吗？在IDE中完成编程任务。
                  </p>
                )}
                
                <div className="text-center">
                  <button 
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-sm"
                    onClick={() => handleStartPractice(currentLesson)}
                  >
                    🎯 开始练习
                  </button>
                </div>
              </div>
            )}
            
            {currentLesson.type === 'project' && (
              <div>
                <div className="text-center py-6">
                  <div className="text-5xl mb-4">🚀</div>
                  <h5 className="text-lg font-semibold mb-2">项目挑战</h5>
                </div>
                
                {currentLesson.content ? (
                  <div className="mb-6">
                    <ContentRenderer content={currentLesson.content} type="html" />
                  </div>
                ) : (
                  <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
                    基于所学知识完成一个实际项目，展示你的技能。
                  </p>
                )}
                
                <div className="text-center">
                  <button 
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all transform hover:scale-105 shadow-sm"
                    onClick={() => handleStartProject(currentLesson)}
                  >
                    🏆 开始项目
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 练习系统 */}
      {showExerciseSystem && currentLesson && currentLesson.exercises && currentLesson.exercises.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              💻 {currentLesson.title} - 练习系统
            </h3>
            <button
              onClick={() => setShowExerciseSystem(false)}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              ✕ 关闭
            </button>
          </div>
          <ExerciseSystem
            exercises={currentLesson.exercises}
            onExerciseComplete={handleExerciseComplete}
            onHintRequest={handleHintRequest}
          />
        </div>
      )}

      {/* 学习路径地图 */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          🗺️ 学习路径地图
          <span className="ml-2 text-xs text-gray-500">
            ({currentData.stages.length} 个阶段)
          </span>
        </h3>
        <div className="space-y-3">
          {currentData.stages.map((stage: any, index: number) => (
            <div
              key={stage.id}
              className={`rounded-lg border transition-all duration-300 ${
                stage.id === currentStage?.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                  : stage.isLocked
                  ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 opacity-75'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm'
              }`}
            >
              <div className="p-4">
                {/* 阶段头部 */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center flex-1">
                    {/* 阶段图标和序号 */}
                    <div className="flex items-center mr-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        stage.isCompleted 
                          ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                          : stage.isLocked
                          ? 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
                          : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {stage.isCompleted ? '✓' : index + 1}
                      </div>
                    </div>
                    
                    {/* 阶段信息 */}
                    <div className="flex-1">
                      <div className="font-medium text-sm flex items-center">
                        {stage.title}
                        {stage.isCompleted && (
                          <span className="ml-2 text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full dark:bg-green-900/30 dark:text-green-400">
                            已完成
                          </span>
                        )}
                        {stage.isLocked && (
                          <span className="ml-2 text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full dark:bg-gray-700 dark:text-gray-400">
                            🔒 未解锁
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {stage.description}
                      </div>
                    </div>
                  </div>
                  
                  {/* 阶段操作按钮 */}
                  {!stage.isLocked && stage.id !== currentStage?.id && (
                    <button
                      className="px-3 py-1.5 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all transform hover:scale-105 shadow-sm"
                      onClick={() => handleStageSelect(stage)}
                    >
                      {stage.progress > 0 ? '📖 继续' : '🚀 开始'}
                    </button>
                  )}
                </div>
                
                {/* 阶段进度 */}
                {stage.progress > 0 && (
                  <div className="mb-3">
                    <ProgressBar
                      progress={stage.progress}
                      height="sm"
                      color={stage.isCompleted ? 'green' : 'blue'}
                      showPercentage={true}
                    />
                  </div>
                )}
                
                {/* 课程列表 */}
                {stage.id === currentStage?.id && stage.lessons && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                    <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                      课程内容 ({stage.lessons.length} 个课程)
                    </div>
                    <div className="space-y-2">
                      {stage.lessons.map((lesson: any, lessonIndex: number) => (
                        <div
                          key={lesson.id}
                          className={`flex items-center p-2 rounded-lg cursor-pointer transition-all ${
                            lesson.id === currentLesson?.id
                              ? 'bg-blue-100 dark:bg-blue-800/30 border border-blue-300 dark:border-blue-600'
                              : 'hover:bg-gray-100 dark:hover:bg-gray-700 border border-transparent'
                          }`}
                          onClick={() => handleLessonSelect(lesson)}
                        >
                          {/* 课程图标 */}
                          <span className="mr-3 text-lg">
                            {lesson.type === 'theory' ? '📖' : 
                             lesson.type === 'practice' ? '💻' : '🚀'}
                          </span>
                          
                          {/* 课程信息 */}
                          <div className="flex-1">
                            <div className="text-xs font-medium">
                              {lessonIndex + 1}. {lesson.title}
                            </div>
                            <div className="text-xs text-gray-500 flex items-center mt-1">
                              <span className="mr-3">⏱️ {lesson.estimatedTime}分钟</span>
                              {(lesson as any).completed && (
                                <span className="text-green-600 dark:text-green-400">✓ 已完成</span>
                              )}
                            </div>
                          </div>
                          
                          {/* 当前课程指示器 */}
                          {lesson.id === currentLesson?.id && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LearningPanel