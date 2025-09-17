import { Clock } from 'lucide-react'

export function Header() {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              World Time
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Compare time zones around the world
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}
