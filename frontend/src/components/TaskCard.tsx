import { Calendar, Pencil, Trash2, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate, isOverdue, truncate } from '@/lib/utils'
import { useDeleteTask } from '@/hooks/useTasks'
import type { Task, Status, Priority } from '@/types'

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
}

const STATUS_LABELS: Record<Status, string> = {
  todo: 'Todo',
  in_progress: 'In Progress',
  done: 'Done',
}

const PRIORITY_LABELS: Record<Priority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

const PRIORITY_BORDER: Record<Priority, string> = {
  high: 'border-l-red-500',
  medium: 'border-l-yellow-500',
  low: 'border-l-green-500',
}

export function TaskCard({ task, onEdit }: TaskCardProps) {
  const deleteTask = useDeleteTask()
  const overdue = isOverdue(task.due_date) && task.status !== 'done'

  const handleDelete = () => {
    if (window.confirm(`Delete "${task.title}"?`)) {
      deleteTask.mutate(task.id)
    }
  }

  return (
    <Card
      className={`
        group animate-fade-in border-l-4 transition-all duration-200
        hover:shadow-md hover:shadow-black/20 hover:border-border/80
        ${PRIORITY_BORDER[task.priority]}
      `}
    >
      <CardContent className="p-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-foreground leading-snug flex-1 line-clamp-2">
            {task.title}
          </h3>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
              onClick={() => onEdit(task)}
              aria-label="Edit task"
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-destructive"
              onClick={handleDelete}
              disabled={deleteTask.isPending}
              aria-label="Delete task"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
            {truncate(task.description, 100)}
          </p>
        )}

        {/* Badges row */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <Badge variant={task.status as 'todo' | 'in_progress' | 'done'}>
            {STATUS_LABELS[task.status]}
          </Badge>
          <Badge variant={task.priority as 'low' | 'medium' | 'high'}>
            {PRIORITY_LABELS[task.priority]}
          </Badge>
          {task.category && (
            <Badge
              className="border-transparent"
              style={{
                backgroundColor: task.category.color + '33',
                color: task.category.color,
                borderColor: task.category.color + '44',
              }}
            >
              {task.category.name}
            </Badge>
          )}
        </div>

        {/* Footer: due date */}
        {task.due_date && (
          <div
            className={`flex items-center gap-1.5 text-xs ${
              overdue ? 'text-red-400' : 'text-muted-foreground'
            }`}
          >
            {overdue ? (
              <AlertCircle className="h-3.5 w-3.5" />
            ) : (
              <Calendar className="h-3.5 w-3.5" />
            )}
            <span>{overdue ? 'Overdue · ' : ''}{formatDate(task.due_date)}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
