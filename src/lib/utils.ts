import { FILTER_CATEGORIES } from './filters'
import type { Project, ProjectWithUrls, FilterState } from './types'

export function getImageUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL
  return `${base}/storage/v1/object/public/project-images/${path}`
}

export function withImageUrls(projects: Project[]): ProjectWithUrls[] {
  return projects.map((p) => ({ ...p, image_url: getImageUrl(p.image_path) }))
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export function parseTags(str: string): string[] {
  return str
    .split(',')
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean)
}

export function extractAllTags(projects: Project[]): string[] {
  const set = new Set<string>()
  for (const p of projects) {
    for (const tag of p.tags) set.add(tag)
  }
  return Array.from(set).sort()
}

export function buildEmptyFilterState(): FilterState {
  return Object.fromEntries(FILTER_CATEGORIES.map(c => [c.key, new Set<string>()]))
}

export function applyFilters(projects: ProjectWithUrls[], filters: FilterState): ProjectWithUrls[] {
  return projects.filter(project => {
    for (const [key, selected] of Object.entries(filters)) {
      if (selected.size === 0) continue
      const projectCatTags = project.tags.filter(t => t.startsWith(`${key}:`))
      if (!projectCatTags.some(t => selected.has(t))) return false
    }
    return true
  })
}

export function hasActiveFilters(filters: FilterState): boolean {
  return Object.values(filters).some(s => s.size > 0)
}

export function countActiveFilters(filters: FilterState): number {
  return Object.values(filters).reduce((n, s) => n + s.size, 0)
}
