import React from 'react'

interface ProgressBarProps {
  progress: number
  height?: 'sm' | 'md' | 'lg'
  color?: 'blue' | 'green' | 'yellow' | 'red'
  showPercentage?: boolean
  animated?: boolean
  label?: string
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 'md',
  color = 'blue',
  showPercentage = false,
  animated = true,
  label
}) => {
  const heightClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  }

  const colorClasses = {
    blue: 'bg-gradient-to-r from-blue-500 to-blue-600',
    green: 'bg-gradient-to-r from-green-500 to-green-600',
    yellow: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
    red: 'bg-gradient-to-r from-red-500 to-red-600'
  }

  const progressClamped = Math.min(Math.max(progress, 0), 100)

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </span>
          {showPercentage && (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {progressClamped}%
            </span>
          )}
        </div>
      )}
      <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full ${heightClasses[height]} overflow-hidden`}>
        <div
          className={`${colorClasses[color]} ${heightClasses[height]} rounded-full transition-all duration-500 ease-out ${
            animated ? 'animate-in fade-in slide-in-from-left-full' : ''
          }`}
          style={{ width: `${progressClamped}%` }}
        >
          <div className="h-full bg-white/20 animate-pulse" />
        </div>
      </div>
    </div>
  )
}

export default ProgressBar