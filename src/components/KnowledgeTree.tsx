import React from 'react'

interface KnowledgeItem {
  id: string
  title: string
  hasCode?: boolean
  hasExercise?: boolean
}

interface KnowledgeCategory {
  id: string
  title: string
  children: KnowledgeItem[]
}

interface KnowledgeTreeProps {
  data: Record<string, KnowledgeCategory> | KnowledgeCategory[]
  selectedTopicId: string | null
  onTopicSelect: (topicId: string) => void
  completedTopics?: Set<string>
}

const KnowledgeTree: React.FC<KnowledgeTreeProps> = ({
  data,
  selectedTopicId,
  onTopicSelect,
  completedTopics = new Set()
}) => {
  const categories = Array.isArray(data) ? data : Object.values(data)

  return (
    <div className="p-2">
      <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 px-2">
        知识点导航
      </h2>
      {categories.map((category) => {
        const completedInCategory = category.children.filter(item => completedTopics.has(item.id)).length
        const totalInCategory = category.children.length

        return (
          <div key={category.id} className="mb-4">
            <div className="flex items-center justify-between px-3 mb-1">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {category.title}
              </h3>
              <span className="text-xs text-gray-500 dark:text-gray-500">
                {completedInCategory}/{totalInCategory}
              </span>
            </div>
            <ul className="space-y-1">
              {category.children.map((item) => {
                const isCompleted = completedTopics.has(item.id)
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => onTopicSelect(item.id)}
                      className={`w-full text-left px-3 py-2 rounded text-sm transition-colors flex items-center gap-2 ${
                        selectedTopicId === item.id
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {isCompleted && (
                        <span className="text-green-500 text-xs" title="已完成">
                          ✓
                        </span>
                      )}
                      <span className="flex-1">{item.title}</span>
                      {item.hasExercise && !isCompleted && (
                        <span className="text-xs text-orange-500" title="有练习题">
                          ✏️
                        </span>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}
    </div>
  )
}

export default KnowledgeTree
