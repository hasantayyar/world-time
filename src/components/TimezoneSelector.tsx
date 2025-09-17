'use client'

import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { COMMON_TIMEZONES } from '@/utils/timezone'

interface TimezoneSelectorProps {
  onAddTimezone: (name: string, timezone: string) => void
}

export function TimezoneSelector({ onAddTimezone }: TimezoneSelectorProps) {
  const [selectedTimezone, setSelectedTimezone] = useState('')
  const [customName, setCustomName] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredTimezones = COMMON_TIMEZONES.filter(tz =>
    tz.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tz.value.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTimezone) return

    const timezoneData = COMMON_TIMEZONES.find(tz => tz.value === selectedTimezone)
    const name = customName.trim() || timezoneData?.label.split(' (')[0] || selectedTimezone
    
    onAddTimezone(name, selectedTimezone)
    setSelectedTimezone('')
    setCustomName('')
    setSearchTerm('')
  }

  // Group timezones by region
  const groupedTimezones = filteredTimezones.reduce((acc, tz) => {
    const group = tz.group || 'Other'
    if (!acc[group]) acc[group] = []
    acc[group].push(tz)
    return acc
  }, {} as Record<string, typeof COMMON_TIMEZONES>)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search timezones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        {/* Timezone Selector */}
        <div>
          <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Timezone
          </label>
          <select
            id="timezone"
            value={selectedTimezone}
            onChange={(e) => setSelectedTimezone(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required
          >
            <option value="">Choose a timezone...</option>
            {Object.entries(groupedTimezones).map(([group, timezones]) => (
              <optgroup key={group} label={group}>
                {timezones.map(tz => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {/* Custom Name Input */}
        <div>
          <label htmlFor="customName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Custom Name (Optional)
          </label>
          <input
            type="text"
            id="customName"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="e.g., Home, Office, Client Location"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        {/* Add Button */}
        <button
          type="submit"
          disabled={!selectedTimezone}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Timezone
        </button>
      </form>

      {/* Quick Add Popular Timezones */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Quick Add Popular Timezones
        </h4>
        <div className="flex flex-wrap gap-2">
          {['America/New_York', 'Europe/London', 'Asia/Tokyo', 'Australia/Sydney'].map(tz => {
            const timezoneData = COMMON_TIMEZONES.find(t => t.value === tz)
            return (
              <button
                key={tz}
                onClick={() => {
                  const name = timezoneData?.label.split(' (')[0] || tz
                  onAddTimezone(name, tz)
                }}
                className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full transition-colors duration-200"
              >
                {timezoneData?.label.split(' (')[0] || tz}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
