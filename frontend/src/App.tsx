import { useState } from 'react'
import { Plus, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { StatsBar } from '@/components/StatsBar'
import { TaskList } from '@/components/TaskList'
import { TaskFilters } from '@/components/TaskFilters'
import { TaskForm } from '@/components/TaskForm'
import { CategoryManager } from '@/components/CategoryManager'
import type { Task, TaskFilters as Filters } from '@/types'

export default function App() {
  const [filters, setFilters] = useState<Filters>({})
  const [formOpen, setFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const handleOpenCreate = () => {
    setEditingTask(null)
    setFormOpen(true)
  }

  const handleOpenEdit = (task: Task) => {
    setEditingTask(task)
    setFormOpen(true)
  }

  const handleFormClose = (open: boolean) => {
    setFormOpen(open)
    if (!open) {
      setEditingTask(null)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-7 h-7 rounded-md bg-primary">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg tracking-tight">TaskFlow</span>
          </div>

          <Button onClick={handleOpenCreate} size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            New Task
          </Button>
        </div>
      </header>

      {/* Main layout */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6 items-start">
          {/* Main content */}
          <main className="flex-1 min-w-0 space-y-6">
            {/* Stats */}
            <section>
              <StatsBar />
            </section>

            <Separator />

            {/* Filters */}
            <section>
              <TaskFilters filters={filters} onChange={setFilters} />
            </section>

            {/* Task list */}
            <section>
              <TaskList filters={filters} onEdit={handleOpenEdit} />
            </section>
          </main>

          {/* Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0 space-y-4">
            <CategoryManager />
          </aside>
        </div>

        {/* Mobile: Category Manager at bottom */}
        <div className="lg:hidden mt-6">
          <CategoryManager />
        </div>
      </div>

      {/* Task form dialog */}
      <TaskForm
        open={formOpen}
        onOpenChange={handleFormClose}
        task={editingTask}
      />
    </div>
  )
}
