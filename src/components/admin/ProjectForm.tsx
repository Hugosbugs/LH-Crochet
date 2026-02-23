'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import ImageUploadField from './ImageUploadField'
import PatternUploadField from './PatternUploadField'
import { createProject, updateProject } from '@/app/admin/actions'
import { getImageUrl } from '@/lib/utils'
import { MVP_CATEGORIES } from '@/lib/filters'
import type { Project } from '@/lib/types'

type ProjectFormProps = {
  initialProject?: Project
}

function buildInitialTagState(tags: string[]): Record<string, string[]> {
  const result: Record<string, string[]> = {}
  for (const cat of MVP_CATEGORIES) {
    result[cat.key] = tags.filter(t => t.startsWith(`${cat.key}:`))
  }
  return result
}

export default function ProjectForm({ initialProject }: ProjectFormProps) {
  const router = useRouter()
  const isEdit = !!initialProject
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [patternFile, setPatternFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [selectedTags, setSelectedTags] = useState<Record<string, string[]>>(
    () => buildInitialTagState(initialProject?.tags ?? [])
  )

  function toggleTag(categoryKey: string, value: string) {
    setSelectedTags(prev => {
      const current = prev[categoryKey] ?? []
      return {
        ...prev,
        [categoryKey]: current.includes(value)
          ? current.filter(v => v !== value)
          : [...current, value],
      }
    })
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const form = e.currentTarget
    const formData = new FormData(form)
    if (imageFile) formData.set('image', imageFile)
    if (patternFile) formData.set('pattern', patternFile)

    // Merge per-category tag selections into a comma-joined string for actions.ts
    const allTags = Object.values(selectedTags).flat()
    formData.set('tags', allTags.join(','))

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
        setSelectedTags(buildInitialTagState([]))
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

      {/* Tags — per-category chip selectors */}
      <div className="space-y-4">
        <p className="text-sm font-medium text-charcoal">Tags</p>
        {MVP_CATEGORIES.map(cat => (
          <div key={cat.key} className="space-y-2">
            <p className="text-xs font-medium text-charcoal/50 uppercase tracking-wide">
              {cat.label}
            </p>
            <div className="flex flex-wrap gap-2">
              {cat.options.map(opt => {
                const active = (selectedTags[cat.key] ?? []).includes(opt.value)
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggleTag(cat.key, opt.value)}
                    aria-pressed={active}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors cursor-pointer
                      ${active
                        ? 'bg-charcoal text-white'
                        : 'border border-sage/30 text-charcoal hover:border-sage'
                      }`}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
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
