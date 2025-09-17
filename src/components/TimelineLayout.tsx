'use client'

import { useState, useEffect, useRef } from 'react'
import { TimelineHeader } from './TimelineHeader'
import { TimezoneRow } from './TimezoneRow'
import { TimeNavigation } from './TimeNavigation'
import { TimezoneSelector } from './TimezoneSelector'
import { 
  generateTimelineData, 
  getTimelineHeaderHours, 
  addTimezone, 
  updateCurrentTime 
} from '@/utils/timezone'
import type { TimezoneData, TimelineData } from '@/types/timezone'

interface TimelineLayoutProps {
  initialTimezones: TimezoneData[]
}

export function TimelineLayout({ initialTimezones }: TimelineLayoutProps) {
  const [timezones, setTimezones] = useState<TimezoneData[]>(initialTimezones)
  const [baseTime, setBaseTime] = useState(new Date())
  const [timelineData, setTimelineData] = useState<TimelineData[]>([])
  const [headerHours, setHeaderHours] = useState<any[]>([])
  const [currentTimePosition, setCurrentTimePosition] = useState<number>()
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const hoursToShow = 48
  const startOffset = -24

  // Update timeline data when timezones or baseTime changes
  useEffect(() => {
    const data = generateTimelineData(timezones, baseTime, hoursToShow, startOffset)
    const hours = getTimelineHeaderHours(baseTime, hoursToShow, startOffset)
    
    setTimelineData(data)
    setHeaderHours(hours)

    // Calculate current time position (relative to scrollable timeline area)
    const now = new Date()
    const minutesSinceBase = (now.getTime() - baseTime.getTime()) / (1000 * 60)
    const hoursFromStart = minutesSinceBase / 60 - startOffset
    const position = 192 + (hoursFromStart * 64) // 192px for sticky timezone column + hours * 64px per hour
    setCurrentTimePosition(position)
  }, [timezones, baseTime])

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      setTimezones(prevTimezones => 
        prevTimezones.map(tz => updateCurrentTime(tz, now))
      )
      
      // Update current time position (relative to scrollable timeline area)
      const minutesSinceBase = (now.getTime() - baseTime.getTime()) / (1000 * 60)
      const hoursFromStart = minutesSinceBase / 60 - startOffset
      const position = 192 + (hoursFromStart * 64) // 192px for sticky timezone column + hours * 64px per hour
      setCurrentTimePosition(position)
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [baseTime, startOffset])

  // Scroll to current time on initial load
  useEffect(() => {
    if (scrollContainerRef.current && currentTimePosition) {
      const container = scrollContainerRef.current
      const scrollPosition = Math.max(0, currentTimePosition - container.clientWidth / 2)
      container.scrollLeft = scrollPosition
    }
  }, [currentTimePosition])

  const handleAddTimezone = (name: string, timezone: string) => {
    const newTimezone = addTimezone(name, timezone, new Date())
    setTimezones(prev => [...prev, newTimezone])
  }

  const handleRemoveTimezone = (id: string) => {
    setTimezones(prev => prev.filter(tz => tz.id !== id))
  }

  const handleTimeChange = (newTime: Date) => {
    setBaseTime(newTime)
  }

  const handleResetToNow = () => {
    setBaseTime(new Date())
  }

  const syncScroll = (event: React.UIEvent<HTMLDivElement>) => {
    // No need for complex sync since everything is in one container now
    // This is just a placeholder for potential future enhancements
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <TimeNavigation 
        currentTime={baseTime}
        onTimeChange={handleTimeChange}
        onResetToNow={handleResetToNow}
      />

      <div className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col overflow-hidden">
          <div 
            ref={scrollContainerRef}
            className="flex-1 overflow-auto custom-scrollbar"
            onScroll={syncScroll}
          >
            <div className="min-w-max">
              <TimelineHeader 
                hours={headerHours} 
                currentTimePosition={currentTimePosition}
              />

              {timelineData.map((data) => (
                <TimezoneRow
                  key={data.timezone.id}
                  timelineData={data}
                  onRemove={handleRemoveTimezone}
                  showRemove={timezones.length > 1}
                  currentTimePosition={currentTimePosition}
                />
              ))}

              {timezones.length === 0 && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
                      No timezones added yet
                    </p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm">
                      Add a timezone below to get started
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add timezone section */}
      <div className="border-t border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-4">
        <div className="max-w-6xl mx-auto">
          <TimezoneSelector onAddTimezone={handleAddTimezone} />
        </div>
      </div>
    </div>
  )
}
