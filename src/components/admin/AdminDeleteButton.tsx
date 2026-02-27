'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteProject } from '@/app/admin/actions'

type Props = {
  projectId: string
  projectName: string
}

export default function AdminDeleteButton({ projectId, projectName }: Props) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleDelete() {
    setDeleting(true)
    const result = await deleteProject(projectId)
    if (result.success) {
      router.refresh()
    } else {
      setDeleting(false)
      setError(result.error ?? 'Delete failed.')
    }
  }

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="text-sm font-semibold text-crimson hover:bg-red-50 transition-colors px-3 py-1.5 rounded-lg"
      >
        Delete
      </button>
    )
  }

  return (
    <div className="flex items-center gap-2">
      {error && <p className="text-xs text-crimson">{error}</p>}
      <span className="text-sm text-charcoal/50">Delete &ldquo;{projectName}&rdquo;?</span>
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="text-sm font-semibold text-crimson hover:text-red-800 transition-colors disabled:opacity-50"
      >
        {deleting ? 'Deleting…' : 'Yes'}
      </button>
      <button
        onClick={() => setConfirming(false)}
        disabled={deleting}
        className="text-sm text-charcoal/40 hover:text-charcoal transition-colors"
      >
        No
      </button>
    </div>
  )
}
