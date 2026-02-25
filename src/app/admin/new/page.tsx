import ProjectForm from '@/components/admin/ProjectForm'
import { signOut } from '@/app/login/actions'

export default function NewProjectPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-charcoal">New Project</h1>
        <form action={signOut}>
          <button
            type="submit"
            className="text-sm text-charcoal/50 hover:text-charcoal transition-colors"
          >
            Sign out
          </button>
        </form>
      </div>
      <ProjectForm />
    </div>
  )
}
