import { createClient } from '@/lib/supabase/server'
import GalleryClient from './GalleryClient'

export default async function ExplorePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  return <GalleryClient projects={projects ?? []} isAdmin={!!user} />
}
