'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'

export default function PatternDownload({ projectId }: { projectId: string }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleDownload() {
    setLoading(true)
    setError(null)

    const res = await fetch(`/api/projects/${projectId}/pattern-url`)
    const data = await res.json()

    setLoading(false)

    if (!res.ok) {
      setError(data.error ?? 'Download failed.')
      return
    }

    window.location.href = data.url
  }

  return (
    <div className="space-y-2">
      <Button onClick={handleDownload} disabled={loading} variant="secondary">
        {loading ? (
          <span className="flex items-center gap-2">
            <Spinner className="w-4 h-4" /> Preparing…
          </span>
        ) : (
          'Download Pattern'
        )}
      </Button>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
