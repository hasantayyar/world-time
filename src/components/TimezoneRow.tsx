import { X, MapPin, Sun, Moon } from 'lucide-react'
import type { TimelineData } from '@/types/timezone'

interface TimezoneRowProps {
  timelineData: TimelineData
  onRemove: (id: string) => void
  showRemove: boolean
  currentTimePosition?: number
}

export function TimezoneRow({ timelineData, onRemove, showRemove, currentTimePosition }: TimezoneRowProps) {
  const { timezone, hours } = timelineData

  const getHourCellBackground = (hour: any) => {
    if (hour.isCurrentHour) {
      return 'bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-600'
    }
    if (hour.isPastHour) {
      return 'bg-gray-50 dark:bg-gray-800'
    }
    return 'bg-white dark:bg-gray-700'
  }

  const getHourCellTextColor = (hour: any) => {
    if (hour.isCurrentHour) {
      return 'text-blue-700 dark:text-blue-300 font-semibold'
    }
    if (hour.isPastHour) {
      return 'text-gray-500 dark:text-gray-400'
    }
    return 'text-gray-900 dark:text-white'
  }

  const isNightHour = (hour: number) => {
    return hour < 6 || hour >= 20
  }

  return (
    <div className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
      <div className="flex">
        {/* Timezone info column */}
        <div className="sticky left-0 z-10 w-48 flex-shrink-0 p-4 bg-gray-50 dark:bg-gray-700 border-r border-gray-200 dark:border-gray-600">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                <div className="min-w-0">
                  <h3 className="font-medium text-gray-900 dark:text-white truncate text-sm">
                    {timezone.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {timezone.timezone}
                  </p>
                </div>
              </div>
              {showRemove && (
                <button
                  onClick={() => onRemove(timezone.id)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition-colors flex-shrink-0"
                  aria-label={`Remove ${timezone.name} timezone`}
                >
                  <X className="h-3 w-3 text-gray-400" />
                </button>
              )}
            </div>
            
            <div className="text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">UTC:</span>
                <span className="font-mono text-gray-700 dark:text-gray-300">
                  {timezone.utcOffset}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Now:</span>
                <span className="font-mono text-gray-900 dark:text-white font-medium">
                  {timezone.formattedTime}
                </span>
              </div>
              
              {timezone.isDST && (
                <div className="text-green-600 dark:text-green-400 text-xs font-medium">
                  DST Active
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Hours timeline */}
        <div className="flex relative">
          {hours.map((hour, index) => (
            <div
              key={index}
              className={`flex-shrink-0 w-16 p-2 text-center border-r border-gray-200 dark:border-gray-600 relative ${getHourCellBackground(hour)}`}
            >
              <div className="space-y-1">
                <div className={`text-sm font-mono ${getHourCellTextColor(hour)}`}>
                  {hour.formattedTime}
                </div>
                <div className="flex items-center justify-center">
                  {isNightHour(hour.hour) ? (
                    <Moon className="h-3 w-3 text-indigo-400" />
                  ) : (
                    <Sun className="h-3 w-3 text-yellow-500" />
                  )}
                </div>
              </div>
              
              {/* Hour separator for new day */}
              {hour.hour === 0 && index > 0 && (
                <div className="absolute top-0 left-0 h-full w-px bg-blue-500"></div>
              )}
            </div>
          ))}
          
          {/* Current time indicator line */}
          {currentTimePosition !== undefined && (
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10 pointer-events-none"
              style={{ left: `${currentTimePosition - 192}px` }}
            />
          )}
        </div>
      </div>
    </div>
  )
}
