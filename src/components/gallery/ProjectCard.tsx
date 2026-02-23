import Image from 'next/image'
import Link from 'next/link'
import Badge from '@/components/ui/Badge'
import type { ProjectWithUrls } from '@/lib/types'

export default function ProjectCard({ project }: { project: ProjectWithUrls }) {
  return (
    <Link href={`/project/${project.id}`} className="group block">
      <div className="overflow-hidden rounded-2xl transition-transform duration-300 group-hover:scale-[1.02]">
        <Image
          src={project.image_url}
          alt={project.name}
          width={600}
          height={800}
          className="w-full h-auto object-cover"
        />
      </div>
      <div className="pt-2 px-1">
        <p className="text-charcoal text-sm font-semibold mb-1">{project.name}</p>
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {project.tags.map((tag) => (
              <Badge key={tag} label={tag} />
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
