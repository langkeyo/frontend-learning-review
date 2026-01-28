import React from 'react'

interface ProgressIndicatorProps {
  value: number
  max: number
  size?: 'sm' | 'md' | 'lg'
  color?: 'blue' | 'green' | 'yellow' | 'red'
  showValue?: boolean
  label?: string
  icon?: React.ReactNode
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  value,
  max,
  size = 'md',
  color = 'blue',
  showValue = true,
  label,
  icon
}) => {
  const percentage = Math.round((value / max) * 100)
  
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base'
  }

  const colorClasses = {
    blue: 'text-blue-600 dark:text-blue-400',
    green: 'text-green-600 dark:text-green-400',
    yellow: 'text-yellow-600 dark:text-yellow-400',
    red: 'text-red-600 dark:text-red-400'
  }

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="relative">
        <svg
          className={sizeClasses[size]}
          viewBox="0 0 36 36"
        >
          <path
            className="text-gray-200 dark:text-gray-700"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className={colorClasses[color]}
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray={`${percentage}, 100`}
            strokeLinecap="round"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-semibold ${colorClasses[color]}`}>
            {showValue ? `${percentage}%` : ''}
          </span>
        </div>
      </div>
      {label && (
        <span className="text-sm text-gray-600 dark:text-gray-400 text-center">
          {icon && <span className="mr-1">{icon}</span>}
          {label}
        </span>
      )}
    </div>
  )
}

export default ProgressIndicator