import ProjectForm from '@/components/admin/ProjectForm'

export default function AdminPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold text-charcoal mb-8">Add Project</h1>
      <ProjectForm />
    </div>
  )
}
