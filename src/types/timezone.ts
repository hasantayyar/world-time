export interface TimezoneData {
  id: string
  name: string
  timezone: string
  currentTime: Date
  formattedTime: string
  formattedDate: string
  utcOffset: string
  isDST: boolean
}

export interface TimezoneOption {
  value: string
  label: string
  group?: string
}

export interface TimelineHour {
  hour: number
  formattedTime: string
  date: Date
  isCurrentHour: boolean
  isPastHour: boolean
  isFutureHour: boolean
}

export interface TimelineData {
  timezone: TimezoneData
  hours: TimelineHour[]
}