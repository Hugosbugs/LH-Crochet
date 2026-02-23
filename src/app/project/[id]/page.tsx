import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getImageUrl, formatDate } from '@/lib/utils'
import Badge from '@/components/ui/Badge'
import PatternDownload from '@/components/project/PatternDownload'
import ProjectActions from '@/components/project/ProjectActions'

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()

  if (!project) notFound()

  const imageUrl = getImageUrl(project.image_path)

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 space-y-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-charcoal/50 hover:text-charcoal transition-colors"
      >
        ← Back to home
      </Link>

      <div className="overflow-hidden rounded-2xl">
        <Image
          src={imageUrl}
          alt={project.name}
          width={800}
          height={1000}
          className="w-full h-auto object-cover"
          priority
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-semibold text-charcoal">{project.name}</h1>
          <p className="text-sm text-charcoal/50 whitespace-nowrap pt-1">
            {formatDate(project.created_at)}
          </p>
        </div>

        <ProjectActions projectId={project.id} projectName={project.name} />

        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag: string) => (
              <Badge key={tag} label={tag} />
            ))}
          </div>
        )}

        {project.description && (
          <p className="text-charcoal/70 text-sm leading-relaxed">{project.description}</p>
        )}

        {project.pattern_path && (
          <PatternDownload projectId={project.id} />
        )}
      </div>
    </div>
  )
}
