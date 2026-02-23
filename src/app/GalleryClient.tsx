'use client'

import { useMemo, useState } from 'react'
import TagFilter from '@/components/gallery/TagFilter'
import GalleryGrid from '@/components/gallery/GalleryGrid'
import { extractAllTags, withImageUrls } from '@/lib/utils'
import type { Project } from '@/lib/types'

export default function GalleryClient({ projects }: { projects: Project[] }) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  const tags = useMemo(() => extractAllTags(projects), [projects])

  const projectsWithUrls = useMemo(() => withImageUrls(projects), [projects])

  const filtered = useMemo(
    () =>
      selectedTag
        ? projectsWithUrls.filter((p) => p.tags.includes(selectedTag))
        : projectsWithUrls,
    [projectsWithUrls, selectedTag]
  )

  return (
    <div className="px-6 py-6 space-y-4">
      {tags.length > 0 && (
        <TagFilter tags={tags} selected={selectedTag} onSelect={setSelectedTag} />
      )}
      {filtered.length === 0 ? (
        <p className="text-charcoal/50 text-sm">No projects yet.</p>
      ) : (
        <GalleryGrid projects={filtered} />
      )}
    </div>
  )
}
