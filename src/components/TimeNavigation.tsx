import { ChevronLeft, ChevronRight, RotateCcw, Calendar, SkipBack, SkipForward, Rewind, FastForward } from 'lucide-react'
import { format } from 'date-fns'

interface TimeNavigationProps {
  currentTime: Date
  onTimeChange: (newTime: Date) => void
  onResetToNow: () => void
}

export function TimeNavigation({ currentTime, onTimeChange, onResetToNow }: TimeNavigationProps) {
  const moveTime = (hours: number) => {
    const newTime = new Date(currentTime.getTime() + (hours * 60 * 60 * 1000))
    onTimeChange(newTime)
  }

  const isCurrentTime = Math.abs(currentTime.getTime() - new Date().getTime()) < 60000 // Within 1 minute

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-600 p-4">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        {/* Left side - Time navigation */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => moveTime(-24)}
              className="flex items-center gap-1 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Go back 24 hours (1 day)"
            >
              <SkipBack className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">24h</span>
            </button>
            <button
              onClick={() => moveTime(-1)}
              className="flex items-center gap-1 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Go back 1 hour"
            >
              <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">1h</span>
            </button>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {format(currentTime, 'MMM dd, yyyy - HH:mm')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => moveTime(1)}
              className="flex items-center gap-1 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Go forward 1 hour"
            >
              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">1h</span>
              <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            </button>
            <button
              onClick={() => moveTime(24)}
              className="flex items-center gap-1 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Go forward 24 hours (1 day)"
            >
              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">24h</span>
              <SkipForward className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>

        {/* Center - Current time indicator */}
        {!isCurrentTime && (
          <div className="text-sm text-orange-600 dark:text-orange-400 font-medium">
            Viewing {currentTime > new Date() ? 'future' : 'past'} time
          </div>
        )}

        {/* Right side - Reset button */}
        <button
          onClick={onResetToNow}
          disabled={isCurrentTime}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            isCurrentTime
              ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800'
          }`}
          title="Return to current time"
        >
          <RotateCcw className="h-4 w-4" />
          <span className="text-sm font-medium">Now</span>
        </button>
      </div>

      {/* Quick navigation buttons */}
      <div className="flex justify-center gap-2 mt-4">
        <div className="flex gap-1">
          {[-24, -12, -6, -3, -1].map(hours => (
            <button
              key={hours}
              onClick={() => moveTime(hours)}
              className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded transition-colors"
            >
              {hours}h
            </button>
          ))}
        </div>
        <div className="px-2 py-1 text-xs text-gray-400">|</div>
        <div className="flex gap-1">
          {[1, 3, 6, 12, 24].map(hours => (
            <button
              key={hours}
              onClick={() => moveTime(hours)}
              className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded transition-colors"
            >
              +{hours}h
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
