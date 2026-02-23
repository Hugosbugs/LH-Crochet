import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = getServiceClient()

  const { data: project, error: dbError } = await supabase
    .from('projects')
    .select('pattern_path')
    .eq('id', id)
    .single()

  if (dbError || !project) {
    return NextResponse.json({ error: 'Project not found.' }, { status: 404 })
  }

  if (!project.pattern_path) {
    return NextResponse.json({ error: 'No pattern for this project.' }, { status: 404 })
  }

  const { data: signed, error: signError } = await supabase.storage
    .from('project-patterns')
    .createSignedUrl(project.pattern_path, 60)

  if (signError || !signed) {
    return NextResponse.json({ error: 'Could not generate download link.' }, { status: 500 })
  }

  return NextResponse.json({ url: signed.signedUrl })
}
