export interface Project {
  id: string
  name: string
  description: string | null
  image_path: string
  pattern_path: string | null
  tags: string[]
  created_at: string
}

export interface ProjectWithUrls extends Project {
  image_url: string
}

export interface ActionResult {
  success: boolean
  error?: string
  projectId?: string
}

// Multi-category filter state. Key = FilterCategory.key, value = Set of active namespaced tag values.
export type FilterState = Record<string, Set<string>>
