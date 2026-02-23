'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import { deleteProject } from '@/app/admin/actions'

type ProjectActionsProps = {
  projectId: string
  projectName: string
}

export default function ProjectActions({ projectId, projectName }: ProjectActionsProps) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleDelete() {
    setDeleting(true)
    setError(null)
    const result = await deleteProject(projectId)
    if (result.success) {
      router.push('/')
    } else {
      setDeleting(false)
      setError(result.error ?? 'Delete failed.')
    }
  }

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <Link href={`/admin/${projectId}/edit`}>
        <Button variant="secondary" type="button">Edit</Button>
      </Link>

      {!confirming ? (
        <Button variant="ghost" type="button" onClick={() => setConfirming(true)}>
          Delete
        </Button>
      ) : (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-charcoal/60">Delete &ldquo;{projectName}&rdquo;?</span>
          <Button
            variant="ghost"
            type="button"
            disabled={deleting}
            onClick={handleDelete}
            className="text-red-500 border-red-200 hover:border-red-400"
          >
            {deleting ? <span className="flex items-center gap-1"><Spinner className="w-3 h-3" /> Deleting…</span> : 'Confirm'}
          </Button>
          <Button variant="ghost" type="button" onClick={() => setConfirming(false)} disabled={deleting}>
            Cancel
          </Button>
        </div>
      )}

      {error && <p className="text-sm text-red-500 w-full">{error}</p>}
    </div>
  )
}
