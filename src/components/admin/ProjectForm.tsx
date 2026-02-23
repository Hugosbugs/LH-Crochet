'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import ImageUploadField from './ImageUploadField'
import PatternUploadField from './PatternUploadField'
import { createProject, updateProject } from '@/app/admin/actions'
import { getImageUrl } from '@/lib/utils'
import type { Project } from '@/lib/types'

type ProjectFormProps = {
  initialProject?: Project
}

export default function ProjectForm({ initialProject }: ProjectFormProps) {
  const router = useRouter()
  const isEdit = !!initialProject
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [patternFile, setPatternFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const form = e.currentTarget
    const formData = new FormData(form)
    if (imageFile) formData.set('image', imageFile)
    if (patternFile) formData.set('pattern', patternFile)

    setLoading(true)

    if (isEdit) {
      const result = await updateProject(initialProject.id, formData)
      setLoading(false)
      if (result.success) {
        setSuccess(true)
        router.push(`/project/${initialProject.id}`)
      } else {
        setError(result.error ?? 'Something went wrong.')
      }
    } else {
      const result = await createProject(formData)
      setLoading(false)
      if (result.success) {
        setSuccess(true)
        form.reset()
        setImageFile(null)
        setPatternFile(null)
        router.refresh()
      } else {
        setError(result.error ?? 'Something went wrong.')
      }
    }
  }

  const existingPatternFilename = initialProject?.pattern_path
    ? initialProject.pattern_path.split('/').pop()
    : undefined

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Hidden fields for edit mode */}
      {isEdit && (
        <>
          <input type="hidden" name="existingImagePath" value={initialProject.image_path} />
          <input type="hidden" name="existingPatternPath" value={initialProject.pattern_path ?? ''} />
        </>
      )}

      {/* Name */}
      <div className="space-y-1">
        <label htmlFor="name" className="block text-sm font-medium text-charcoal">
          Project Name <span className="text-clay">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={initialProject?.name}
          className="w-full rounded-xl border border-sage/30 bg-white px-4 py-2.5 text-sm text-charcoal placeholder:text-charcoal/40 focus:border-sage focus:outline-none"
          placeholder="e.g. Granny Square Cardigan"
        />
      </div>

      {/* Description */}
      <div className="space-y-1">
        <label htmlFor="description" className="block text-sm font-medium text-charcoal">
          Description <span className="text-charcoal/40 font-normal">(optional)</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={initialProject?.description ?? ''}
          className="w-full rounded-xl border border-sage/30 bg-white px-4 py-2.5 text-sm text-charcoal placeholder:text-charcoal/40 focus:border-sage focus:outline-none resize-none"
          placeholder="A little about this project..."
        />
      </div>

      {/* Tags */}
      <div className="space-y-1">
        <label htmlFor="tags" className="block text-sm font-medium text-charcoal">
          Tags <span className="text-charcoal/40 font-normal">(comma-separated)</span>
        </label>
        <input
          id="tags"
          name="tags"
          type="text"
          defaultValue={initialProject?.tags.join(', ')}
          className="w-full rounded-xl border border-sage/30 bg-white px-4 py-2.5 text-sm text-charcoal placeholder:text-charcoal/40 focus:border-sage focus:outline-none"
          placeholder="e.g. cardigan, granny square, wearable"
        />
      </div>

      {/* Image */}
      <ImageUploadField
        onChange={setImageFile}
        initialPreview={initialProject ? getImageUrl(initialProject.image_path) : undefined}
      />

      {/* Pattern */}
      <PatternUploadField
        onChange={setPatternFile}
        initialFilename={existingPatternFilename}
      />

      {/* Feedback */}
      {error && <p className="text-sm text-red-500">{error}</p>}
      {success && (
        <p className="text-sm text-sage font-medium">
          {isEdit ? 'Project updated!' : 'Project created!'}
        </p>
      )}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? (
          <span className="flex items-center gap-2">
            <Spinner className="w-4 h-4" /> Uploading…
          </span>
        ) : isEdit ? (
          'Update Project'
        ) : (
          'Add Project'
        )}
      </Button>
    </form>
  )
}
