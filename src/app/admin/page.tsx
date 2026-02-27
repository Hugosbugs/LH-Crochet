import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/app/login/actions'
import { getImageUrl, formatDate } from '@/lib/utils'
import AdminDeleteButton from '@/components/admin/AdminDeleteButton'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-charcoal">Projects</h1>
        <div className="flex items-center gap-4">
          <Link
            href="/admin/new"
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold bg-charcoal text-white hover:bg-charcoal/85 transition-colors"
          >
            + New Project
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="text-sm text-charcoal/50 hover:text-charcoal transition-colors"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>

      {!projects || projects.length === 0 ? (
        <p className="text-charcoal/50 text-sm">No projects yet.</p>
      ) : (
        <table className="text-sm">
          <thead>
            <tr className="border-b border-charcoal/10 text-left">
              <th className="pb-3 pr-8 font-medium text-charcoal/40 w-14">Image</th>
              <th className="pb-3 pr-8 font-medium text-charcoal/40 whitespace-nowrap">Name</th>
              <th className="pb-3 pr-8 font-medium text-charcoal/40">Tags</th>
              <th className="pb-3 pr-8 font-medium text-charcoal/40 whitespace-nowrap">Pattern</th>
              <th className="pb-3 pr-8 font-medium text-charcoal/40 whitespace-nowrap">Added</th>
              <th className="pb-3 font-medium text-charcoal/40 whitespace-nowrap pl-8">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal/5">
            {projects.map((project) => (
              <tr key={project.id} className="group">
                <td className="py-3 pr-8">
                  <div className="relative w-10 h-10 rounded-md overflow-hidden bg-surface shrink-0">
                    <Image
                      src={getImageUrl(project.image_path)}
                      alt={project.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </td>
                <td className="py-3 pr-8 whitespace-nowrap">
                  <span className="font-medium text-charcoal">{project.name}</span>
                </td>
                <td className="py-3 pr-8">
                  <div className="flex flex-wrap gap-1">
                    {project.tags.slice(0, 3).map((tag: string) => (
                      <span key={tag} className="px-2 py-0.5 rounded-full bg-surface text-charcoal/60 text-xs">
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="px-2 py-0.5 rounded-full bg-surface text-charcoal/40 text-xs">
                        +{project.tags.length - 3}
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3 pr-8">
                  {project.pattern_path ? (
                    <span className="text-sage font-medium">Yes</span>
                  ) : (
                    <span className="text-charcoal/30">—</span>
                  )}
                </td>
                <td className="py-3 pr-8 text-charcoal/50">{formatDate(project.created_at)}</td>
                <td className="py-3 pl-8">
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/admin/${project.id}/edit`}
                      className="text-sm font-semibold text-charcoal/70 hover:text-charcoal hover:bg-surface transition-colors px-3 py-1.5 rounded-lg"
                    >
                      Edit
                    </Link>
                    <AdminDeleteButton projectId={project.id} projectName={project.name} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
