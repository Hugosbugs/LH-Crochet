'use client'

import Masonry from 'react-masonry-css'
import ProjectCard from './ProjectCard'
import type { ProjectWithUrls } from '@/lib/types'

const breakpointCols = {
  default: 4,
  1280: 4,
  1024: 3,
  768: 2,
  640: 1,
}

export default function GalleryGrid({ projects }: { projects: ProjectWithUrls[] }) {
  return (
    <Masonry
      breakpointCols={breakpointCols}
      className="masonry-grid"
      columnClassName="masonry-grid-column"
    >
      {projects.map((project) => (
        <div key={project.id}>
          <ProjectCard project={project} />
        </div>
      ))}
    </Masonry>
  )
}
