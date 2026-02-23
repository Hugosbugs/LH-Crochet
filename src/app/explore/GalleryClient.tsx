'use client'

import { useMemo, useState } from 'react'
import FilterBar from '@/components/gallery/FilterBar'
import GalleryGrid from '@/components/gallery/GalleryGrid'
import { withImageUrls, applyFilters, buildEmptyFilterState } from '@/lib/utils'
import type { Project } from '@/lib/types'

export default function GalleryClient({ projects }: { projects: Project[] }) {
  const [filters, setFilters] = useState(buildEmptyFilterState)

  const projectsWithUrls = useMemo(() => withImageUrls(projects), [projects])
  const filtered = useMemo(() => applyFilters(projectsWithUrls, filters), [projectsWithUrls, filters])

  const isEmpty = projectsWithUrls.length === 0
  const noMatch = !isEmpty && filtered.length === 0

  return (
    <div className="px-6 py-6 space-y-4">
      <FilterBar filters={filters} onFiltersChange={setFilters} projects={projectsWithUrls} />

      {isEmpty && (
        <p className="text-charcoal/50 text-sm">No projects yet.</p>
      )}

      {noMatch && (
        <div className="py-16 text-center space-y-2">
          <p className="text-charcoal/50 text-sm">No projects match these filters.</p>
          <button
            onClick={() => setFilters(buildEmptyFilterState())}
            className="text-sm text-clay hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}

      {!isEmpty && !noMatch && <GalleryGrid projects={filtered} />}
    </div>
  )
}
