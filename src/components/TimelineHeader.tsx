import { format } from 'date-fns'

interface TimelineHeaderProps {
  hours: { hour: number; formattedHour: string; date: Date; isCurrentHour: boolean }[]
  currentTimePosition?: number
}

export function TimelineHeader({ hours, currentTimePosition }: TimelineHeaderProps) {
  return (
    <div className="sticky top-0 z-20 bg-white dark:bg-gray-800 border-b-2 border-gray-200 dark:border-gray-600 shadow-sm">
      {/* Date row */}
      <div className="flex">
        <div className="sticky left-0 z-30 w-48 flex-shrink-0 p-4 bg-gray-50 dark:bg-gray-700 border-r border-gray-200 dark:border-gray-600">
          <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
            {format(new Date(), 'MMM dd, yyyy')}
          </div>
        </div>
        <div className="flex">
          {hours.map((hourData, index) => {
            const isNewDay = index > 0 && hourData.hour === 0
            return (
              <div
                key={index}
                className="flex-shrink-0 w-16 p-2 text-center relative"
              >
                {isNewDay && (
                  <div className="absolute top-0 left-0 h-full w-px bg-blue-500"></div>
                )}
                <div className={`text-xs ${
                  isNewDay ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {isNewDay ? format(hourData.date, 'MMM dd') : ''}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Hour row */}
      <div className="flex">
        <div className="sticky left-0 z-30 w-48 flex-shrink-0 p-4 bg-gray-50 dark:bg-gray-700 border-r border-gray-200 dark:border-gray-600">
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            Time Zones
          </div>
        </div>
        <div className="flex relative">
          {hours.map((hourData, index) => (
            <div
              key={index}
              className={`flex-shrink-0 w-16 p-3 text-center border-r border-gray-200 dark:border-gray-600 ${
                hourData.isCurrentHour 
                  ? 'bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-600' 
                  : 'bg-white dark:bg-gray-800'
              }`}
            >
              <div className={`text-sm font-medium ${
                hourData.isCurrentHour 
                  ? 'text-blue-700 dark:text-blue-300' 
                  : 'text-gray-900 dark:text-white'
              }`}>
                {hourData.formattedHour}:00
              </div>
            </div>
          ))}
          
          {/* Current time indicator line */}
          {currentTimePosition !== undefined && (
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10 pointer-events-none"
              style={{ left: `${currentTimePosition - 192}px` }}
            >
              <div className="absolute -top-2 -left-2 w-4 h-4 bg-red-500 rounded-full"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
