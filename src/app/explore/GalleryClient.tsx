'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import FilterBar from '@/components/gallery/FilterBar'
import GalleryGrid from '@/components/gallery/GalleryGrid'
import { withImageUrls, applyFilters, buildEmptyFilterState } from '@/lib/utils'
import type { Project } from '@/lib/types'

export default function GalleryClient({ projects, isAdmin }: { projects: Project[], isAdmin?: boolean }) {
  const [filters, setFilters] = useState(buildEmptyFilterState)

  const projectsWithUrls = useMemo(() => withImageUrls(projects), [projects])
  const filtered = useMemo(() => applyFilters(projectsWithUrls, filters), [projectsWithUrls, filters])

  const isEmpty = projectsWithUrls.length === 0
  const noMatch = !isEmpty && filtered.length === 0

  return (
    <div className="px-6 py-6 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <FilterBar filters={filters} onFiltersChange={setFilters} projects={projectsWithUrls} />
        {isAdmin && (
          <Link
            href="/admin/new"
            className="shrink-0 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold bg-charcoal text-white hover:bg-charcoal/85 transition-colors"
          >
            + New Project
          </Link>
        )}
      </div>

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
