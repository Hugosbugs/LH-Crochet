'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { parseTags } from '@/lib/utils'
import type { ActionResult } from '@/lib/types'
import { createClient as createSessionClient } from '@/lib/supabase/server'

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

async function requireAuth(): Promise<ActionResult | null> {
  const supabase = await createSessionClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }
  return null
}

export async function createProject(formData: FormData): Promise<ActionResult> {
  const authError = await requireAuth()
  if (authError) return authError

  try {
    const name = (formData.get('name') as string | null)?.trim()
    const description = (formData.get('description') as string | null)?.trim() || null
    const tagsRaw = (formData.get('tags') as string | null) ?? ''
    const imageFile = formData.get('image') as File | null
    const patternFile = formData.get('pattern') as File | null

    // Validate
    if (!name) return { success: false, error: 'Project name is required.' }
    if (!imageFile || imageFile.size === 0) return { success: false, error: 'An image is required.' }

    const supabase = getServiceClient()

    // Upload image
    const imageExt = imageFile.name.split('.').pop()
    const imagePath = `images/${crypto.randomUUID()}.${imageExt}`
    const { error: imageError } = await supabase.storage
      .from('project-images')
      .upload(imagePath, imageFile, { contentType: imageFile.type })

    if (imageError) return { success: false, error: `Image upload failed: ${imageError.message}` }

    // Upload pattern (optional)
    let patternPath: string | null = null
    if (patternFile && patternFile.size > 0) {
      const patternExt = patternFile.name.split('.').pop()
      patternPath = `patterns/${crypto.randomUUID()}.${patternExt}`
      const { error: patternError } = await supabase.storage
        .from('project-patterns')
        .upload(patternPath, patternFile, { contentType: 'application/pdf' })

      if (patternError) return { success: false, error: `Pattern upload failed: ${patternError.message}` }
    }

    // Insert row
    const tags = parseTags(tagsRaw)
    const { data, error: dbError } = await supabase
      .from('projects')
      .insert({ name, description, image_path: imagePath, pattern_path: patternPath, tags })
      .select('id')
      .single()

    if (dbError) return { success: false, error: `Database error: ${dbError.message}` }

    revalidatePath('/')

    return { success: true, projectId: data.id }
  } catch (err) {
    console.error('[createProject]', err)
    return { success: false, error: err instanceof Error ? err.message : 'Unexpected server error.' }
  }
}

export async function updateProject(id: string, formData: FormData): Promise<ActionResult> {
  const authError = await requireAuth()
  if (authError) return authError

  try {
    const name = (formData.get('name') as string | null)?.trim()
    const description = (formData.get('description') as string | null)?.trim() || null
    const tagsRaw = (formData.get('tags') as string | null) ?? ''
    const imageFile = formData.get('image') as File | null
    const patternFile = formData.get('pattern') as File | null
    const existingImagePath = formData.get('existingImagePath') as string
    const existingPatternPath = (formData.get('existingPatternPath') as string | null) || null

    if (!name) return { success: false, error: 'Project name is required.' }

    const supabase = getServiceClient()

    // Handle image: replace if new file provided, otherwise keep existing
    let imagePath = existingImagePath
    if (imageFile && imageFile.size > 0) {
      const imageExt = imageFile.name.split('.').pop()
      const newImagePath = `images/${crypto.randomUUID()}.${imageExt}`
      const { error: imageError } = await supabase.storage
        .from('project-images')
        .upload(newImagePath, imageFile, { contentType: imageFile.type })
      if (imageError) return { success: false, error: `Image upload failed: ${imageError.message}` }
      await supabase.storage.from('project-images').remove([existingImagePath])
      imagePath = newImagePath
    }

    // Handle pattern: replace if new file provided, otherwise keep existing
    let patternPath = existingPatternPath
    if (patternFile && patternFile.size > 0) {
      const patternExt = patternFile.name.split('.').pop()
      const newPatternPath = `patterns/${crypto.randomUUID()}.${patternExt}`
      const { error: patternError } = await supabase.storage
        .from('project-patterns')
        .upload(newPatternPath, patternFile, { contentType: 'application/pdf' })
      if (patternError) return { success: false, error: `Pattern upload failed: ${patternError.message}` }
      if (existingPatternPath) {
        await supabase.storage.from('project-patterns').remove([existingPatternPath])
      }
      patternPath = newPatternPath
    }

    const tags = parseTags(tagsRaw)
    const { error: dbError } = await supabase
      .from('projects')
      .update({ name, description, image_path: imagePath, pattern_path: patternPath, tags })
      .eq('id', id)

    if (dbError) return { success: false, error: `Database error: ${dbError.message}` }

    revalidatePath('/')
    revalidatePath(`/project/${id}`)

    return { success: true, projectId: id }
  } catch (err) {
    console.error('[updateProject]', err)
    return { success: false, error: err instanceof Error ? err.message : 'Unexpected server error.' }
  }
}

export async function deleteProject(id: string): Promise<ActionResult> {
  const authError = await requireAuth()
  if (authError) return authError

  try {
    const supabase = getServiceClient()

    const { data: project } = await supabase
      .from('projects')
      .select('image_path, pattern_path')
      .eq('id', id)
      .single()

    if (!project) return { success: false, error: 'Project not found.' }

    await supabase.storage.from('project-images').remove([project.image_path])
    if (project.pattern_path) {
      await supabase.storage.from('project-patterns').remove([project.pattern_path])
    }

    const { error: dbError } = await supabase.from('projects').delete().eq('id', id)
    if (dbError) return { success: false, error: `Database error: ${dbError.message}` }

    revalidatePath('/')

    return { success: true }
  } catch (err) {
    console.error('[deleteProject]', err)
    return { success: false, error: err instanceof Error ? err.message : 'Unexpected server error.' }
  }
}
