'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-stone-100 dark:from-stone-900 dark:to-stone-800">
          <div className="text-center">
            <h2 className="text-2xl font-serif text-stone-800 dark:text-stone-100 mb-4">
              Something went wrong!
            </h2>
            <p className="text-stone-600 dark:text-stone-400 mb-6">
              {error.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={reset}
              className="px-4 py-2 bg-stone-800 dark:bg-stone-100 text-stone-100 dark:text-stone-800 rounded-md hover:bg-stone-700 dark:hover:bg-stone-200 transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
