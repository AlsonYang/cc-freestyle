import { ClipboardList, Loader2 } from 'lucide-react'
import { TaskCard } from './TaskCard'
import { useTasksQuery } from '@/hooks/useTasks'
import type { Task, TaskFilters } from '@/types'

interface TaskListProps {
  filters: TaskFilters
  onEdit: (task: Task) => void
}

export function TaskList({ filters, onEdit }: TaskListProps) {
  const { data: tasks, isLoading, isError, error } = useTasksQuery(filters)

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="text-sm">Loading tasks...</span>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-3">
        <div className="text-destructive text-sm font-medium">
          Failed to load tasks
        </div>
        <p className="text-xs text-muted-foreground">
          {error instanceof Error ? error.message : 'Unknown error'}
        </p>
      </div>
    )
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-3">
        <ClipboardList className="h-12 w-12 opacity-30" />
        <div className="text-center">
          <p className="font-medium text-foreground/60">No tasks found</p>
          <p className="text-sm mt-1">
            {Object.values(filters).some(Boolean)
              ? 'Try adjusting your filters'
              : 'Create your first task to get started'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-muted-foreground">
          {tasks.length} task{tasks.length !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onEdit={onEdit} />
        ))}
      </div>
    </div>
  )
}
