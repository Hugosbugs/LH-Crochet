import type { Project, ProjectWithUrls } from './types'

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
