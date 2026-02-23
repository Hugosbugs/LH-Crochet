import Image from 'next/image'
import Link from 'next/link'
import type { ProjectWithUrls } from '@/lib/types'

export default function ProjectCard({ project }: { project: ProjectWithUrls }) {
  return (
    <Link href={`/project/${project.id}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl transition-transform duration-300 group-hover:scale-[1.02]">
        <Image
          src={project.image_url}
          alt={project.name}
          width={600}
          height={800}
          className="w-full h-auto object-cover"
        />
        <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="inline-flex items-center gap-1.5 bg-white text-charcoal text-xs font-semibold px-3 py-2 rounded-full shadow-md">
            ↗ View project
          </span>
        </div>
      </div>

    </Link>
  )
}
