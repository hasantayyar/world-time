import { format, utcToZonedTime } from 'date-fns-tz'
import { addHours, startOfHour, isSameHour, isAfter, isBefore } from 'date-fns'
import type { TimezoneData, TimelineHour, TimelineData } from '@/types/timezone'

export function addTimezone(name: string, timezone: string, currentTime: Date): TimezoneData {
  const id = `${timezone}-${Date.now()}`
  return updateCurrentTime({
    id,
    name,
    timezone,
    currentTime,
    formattedTime: '',
    formattedDate: '',
    utcOffset: '',
    isDST: false
  }, currentTime)
}

export function updateCurrentTime(timezone: TimezoneData, currentTime: Date): TimezoneData {
  try {
    const zonedTime = utcToZonedTime(currentTime, timezone.timezone)

    return {
      ...timezone,
      currentTime: zonedTime,
      formattedTime: format(zonedTime, 'HH:mm:ss', { timeZone: timezone.timezone }),
      formattedDate: format(zonedTime, 'MMM dd, yyyy', { timeZone: timezone.timezone }),
      utcOffset: format(zonedTime, 'xxx', { timeZone: timezone.timezone }),
      isDST: isDaylightSavingTime(currentTime, timezone.timezone)
    }
  } catch (error) {
    console.error(`Error updating time for timezone ${timezone.timezone}:`, error)
    return timezone
  }
}

export function removeTimezone(timezones: TimezoneData[], id: string): TimezoneData[] {
  return timezones.filter(tz => tz.id !== id)
}

function isDaylightSavingTime(date: Date, timezone: string): boolean {
  try {
    const jan = new Date(date.getFullYear(), 0, 1)
    const jul = new Date(date.getFullYear(), 6, 1)

    const janOffset = format(utcToZonedTime(jan, timezone), 'xxx', { timeZone: timezone })
    const julOffset = format(utcToZonedTime(jul, timezone), 'xxx', { timeZone: timezone })
    const currentOffset = format(utcToZonedTime(date, timezone), 'xxx', { timeZone: timezone })

    return currentOffset !== janOffset || currentOffset !== julOffset
  } catch {
    return false
  }
}

// Common timezone options for the selector
export const COMMON_TIMEZONES = [
  { value: 'America/New_York', label: 'New York (EST/EDT)', group: 'North America' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (PST/PDT)', group: 'North America' },
  { value: 'America/Chicago', label: 'Chicago (CST/CDT)', group: 'North America' },
  { value: 'America/Denver', label: 'Denver (MST/MDT)', group: 'North America' },
  { value: 'America/Toronto', label: 'Toronto (EST/EDT)', group: 'North America' },
  { value: 'America/Vancouver', label: 'Vancouver (PST/PDT)', group: 'North America' },

  { value: 'Europe/London', label: 'London (GMT/BST)', group: 'Europe' },
  { value: 'Europe/Paris', label: 'Paris (CET/CEST)', group: 'Europe' },
  { value: 'Europe/Berlin', label: 'Berlin (CET/CEST)', group: 'Europe' },
  { value: 'Europe/Rome', label: 'Rome (CET/CEST)', group: 'Europe' },
  { value: 'Europe/Madrid', label: 'Madrid (CET/CEST)', group: 'Europe' },
  { value: 'Europe/Amsterdam', label: 'Amsterdam (CET/CEST)', group: 'Europe' },
  { value: 'Europe/Stockholm', label: 'Stockholm (CET/CEST)', group: 'Europe' },
  { value: 'Europe/Moscow', label: 'Moscow (MSK)', group: 'Europe' },
  { value: 'Europe/Istanbul', label: 'Istanbul (TRT)', group: 'Europe' },

  { value: 'Asia/Tokyo', label: 'Tokyo (JST)', group: 'Asia' },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)', group: 'Asia' },
  { value: 'Asia/Seoul', label: 'Seoul (KST)', group: 'Asia' },
  { value: 'Asia/Hong_Kong', label: 'Hong Kong (HKT)', group: 'Asia' },
  { value: 'Asia/Singapore', label: 'Singapore (SGT)', group: 'Asia' },
  { value: 'Asia/Dubai', label: 'Dubai (GST)', group: 'Asia' },
  { value: 'Asia/Kolkata', label: 'Mumbai (IST)', group: 'Asia' },
  { value: 'Asia/Bangkok', label: 'Bangkok (ICT)', group: 'Asia' },

  { value: 'Australia/Sydney', label: 'Sydney (AEST/AEDT)', group: 'Australia' },
  { value: 'Australia/Melbourne', label: 'Melbourne (AEST/AEDT)', group: 'Australia' },
  { value: 'Australia/Perth', label: 'Perth (AWST)', group: 'Australia' },

  { value: 'Pacific/Auckland', label: 'Auckland (NZST/NZDT)', group: 'Pacific' },
  { value: 'Pacific/Honolulu', label: 'Honolulu (HST)', group: 'Pacific' },

  { value: 'Africa/Cairo', label: 'Cairo (EET/EEST)', group: 'Africa' },
  { value: 'Africa/Johannesburg', label: 'Johannesburg (SAST)', group: 'Africa' },

  { value: 'America/Sao_Paulo', label: 'São Paulo (BRT/BRST)', group: 'South America' },
  { value: 'America/Argentina/Buenos_Aires', label: 'Buenos Aires (ART)', group: 'South America' },
]

// Timeline utility functions
export function generateTimelineHours(
  timezone: string, 
  baseTime: Date, 
  hoursToShow: number = 24,
  startOffset: number = -12
): TimelineHour[] {
  const hours: TimelineHour[] = []
  const now = new Date()
  
  for (let i = startOffset; i < startOffset + hoursToShow; i++) {
    const hourTime = addHours(baseTime, i)
    const zonedTime = utcToZonedTime(hourTime, timezone)
    const currentZonedTime = utcToZonedTime(now, timezone)
    
    hours.push({
      hour: zonedTime.getHours(),
      formattedTime: format(zonedTime, 'HH:mm', { timeZone: timezone }),
      date: zonedTime,
      isCurrentHour: isSameHour(zonedTime, currentZonedTime),
      isPastHour: isBefore(zonedTime, startOfHour(currentZonedTime)),
      isFutureHour: isAfter(zonedTime, startOfHour(currentZonedTime))
    })
  }
  
  return hours
}

export function generateTimelineData(
  timezones: TimezoneData[], 
  baseTime: Date, 
  hoursToShow: number = 24,
  startOffset: number = -12
): TimelineData[] {
  return timezones.map(timezone => ({
    timezone,
    hours: generateTimelineHours(timezone.timezone, baseTime, hoursToShow, startOffset)
  }))
}

export function getTimelineHeaderHours(
  baseTime: Date, 
  hoursToShow: number = 24,
  startOffset: number = -12
): { hour: number; formattedHour: string; date: Date; isCurrentHour: boolean }[] {
  const hours = []
  const now = new Date()
  
  for (let i = startOffset; i < startOffset + hoursToShow; i++) {
    const hourTime = addHours(baseTime, i)
    hours.push({
      hour: hourTime.getHours(),
      formattedHour: format(hourTime, 'HH'),
      date: hourTime,
      isCurrentHour: isSameHour(hourTime, now)
    })
  }
  
  return hours
}
