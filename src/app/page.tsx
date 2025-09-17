'use client'

import { useState, useEffect } from 'react'
import { TimelineLayout } from '@/components/TimelineLayout'
import { Header } from '@/components/Header'
import { addTimezone, updateCurrentTime } from '@/utils/timezone'
import type { TimezoneData } from '@/types/timezone'

export default function Home() {
  const [initialTimezones, setInitialTimezones] = useState<TimezoneData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Initialize with local timezone
  useEffect(() => {
    const currentTime = new Date()
    const localTimezone = addTimezone(
      'Local', 
      Intl.DateTimeFormat().resolvedOptions().timeZone, 
      currentTime
    )
    setInitialTimezones([localTimezone])
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading World Time...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      <TimelineLayout initialTimezones={initialTimezones} />
    </div>
  )
}
