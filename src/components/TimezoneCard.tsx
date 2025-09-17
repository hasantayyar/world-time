import { X, MapPin, Sun, Moon } from 'lucide-react'
import type { TimezoneData } from '@/types/timezone'

interface TimezoneCardProps {
  timezone: TimezoneData
  onRemove: (id: string) => void
  showRemove: boolean
}

export function TimezoneCard({ timezone, onRemove, showRemove }: TimezoneCardProps) {
  const isNight = () => {
    const hour = timezone.currentTime.getHours()
    return hour < 6 || hour >= 20
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
            {timezone.name}
          </h3>
        </div>
        {showRemove && (
          <button
            onClick={() => onRemove(timezone.id)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            aria-label={`Remove ${timezone.name} timezone`}
          >
            <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </button>
        )}
      </div>

      {/* Time Display */}
      <div className="text-center mb-4">
        <div className="text-4xl font-mono font-bold text-gray-900 dark:text-white mb-2">
          {timezone.formattedTime}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          {timezone.formattedDate}
        </div>
      </div>

      {/* Additional Info */}
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-500 dark:text-gray-400">UTC Offset:</span>
          <span className="font-mono text-gray-900 dark:text-white">
            {timezone.utcOffset}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-500 dark:text-gray-400">Time of Day:</span>
          <div className="flex items-center gap-1">
            {isNight() ? (
              <Moon className="h-4 w-4 text-indigo-500" />
            ) : (
              <Sun className="h-4 w-4 text-yellow-500" />
            )}
            <span className="text-gray-900 dark:text-white">
              {isNight() ? 'Night' : 'Day'}
            </span>
          </div>
        </div>

        {timezone.isDST && (
          <div className="flex items-center justify-between">
            <span className="text-gray-500 dark:text-gray-400">DST:</span>
            <span className="text-green-600 dark:text-green-400 font-medium">
              Active
            </span>
          </div>
        )}
        
        <div className="text-xs text-gray-400 dark:text-gray-500 mt-3 pt-2 border-t border-gray-200 dark:border-gray-600">
          {timezone.timezone}
        </div>
      </div>
    </div>
  )
}
