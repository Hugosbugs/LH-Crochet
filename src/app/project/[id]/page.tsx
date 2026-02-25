import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getImageUrl, formatDate } from '@/lib/utils'
import PatternDownload from '@/components/project/PatternDownload'
import ProjectActions from '@/components/project/ProjectActions'
import { FILTER_CATEGORIES, getLabelForTag } from '@/lib/filters'

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: project }, { data: { user } }] = await Promise.all([
    supabase.from('projects').select('*').eq('id', id).single(),
    supabase.auth.getUser(),
  ])

  if (!project) notFound()

  const isAdmin = !!user
  const imageUrl = getImageUrl(project.image_path)

  return (
    <div className="h-screen flex p-6">
      <div className="flex-1 flex rounded-2xl overflow-hidden border border-gray-200">
        {/* Left: image with floating back button */}
        <div className="shrink-0 flex items-stretch">
          <div className="relative overflow-hidden aspect-[3/4]">
            <Image
              src={imageUrl}
              alt={project.name}
              fill
              className="object-cover"
              priority
            />
            {/* Floating back button */}
            <Link
              href="/explore"
              className="absolute top-3 left-3 w-11 h-11 flex items-center justify-center rounded-2xl bg-white hover:bg-gray-100 transition-colors shadow-sm"
              aria-label="Back to gallery"
            >
              <ArrowLeft className="w-5 h-5 text-charcoal" />
            </Link>
          </div>
        </div>

        {/* Right: white panel */}
        <div className="flex-1 flex flex-col min-h-0 bg-white border-l border-gray-100">
          {/* Action bar */}
          <div className="flex items-center justify-end px-8 py-4 border-b border-gray-100 shrink-0">
            <ProjectActions projectId={project.id} projectName={project.name} isAdmin={isAdmin} />
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-8 py-8 space-y-6">
            <div>
              <h1 className="text-2xl font-semibold text-charcoal">{project.name}</h1>
              <p className="text-sm text-charcoal/40 mt-1">{formatDate(project.created_at)}</p>
            </div>

            {project.description && (
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-charcoal/40 uppercase tracking-wide">Description</p>
                <p className="text-charcoal/70 text-sm leading-relaxed">{project.description}</p>
              </div>
            )}

            {project.tags.length > 0 && (() => {
              const groups = FILTER_CATEGORIES
                .map(cat => ({
                  label: cat.label,
                  values: project.tags.filter((t: string) => t.startsWith(cat.key + ':')),
                }))
                .filter(g => g.values.length > 0)

              return (
                <table className="text-sm border-collapse w-full">
                  <tbody>
                    {groups.map(group => (
                      <tr key={group.label} className="border-b border-gray-100">
                        <td className="font-semibold text-charcoal pr-6 py-2.5 whitespace-nowrap align-top w-36">
                          {group.label}
                        </td>
                        <td className="text-charcoal/70 py-2.5">
                          {group.values.map((t: string) => getLabelForTag(t)).join(', ')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            })()}

            {project.pattern_path && <PatternDownload projectId={project.id} />}
          </div>
        </div>
      </div>
    </div>
  )
}
