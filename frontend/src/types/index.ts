export type Status = 'todo' | 'in_progress' | 'done'
export type Priority = 'low' | 'medium' | 'high'

export interface Category {
  id: number
  name: string
  color: string
  created_at: string
}

export interface Task {
  id: number
  title: string
  description: string | null
  status: Status
  priority: Priority
  due_date: string | null
  category_id: number | null
  category: Category | null
  created_at: string
  updated_at: string
}

export interface Stats {
  total: number
  by_status: {
    todo: number
    in_progress: number
    done: number
  }
  by_priority: {
    low: number
    medium: number
    high: number
  }
}

export interface TaskFilters {
  status?: Status | ''
  priority?: Priority | ''
  category_id?: number | ''
  search?: string
}

export interface CreateTaskPayload {
  title: string
  description?: string | null
  status: Status
  priority: Priority
  due_date?: string | null
  category_id?: number | null
}

export interface UpdateTaskPayload extends Partial<CreateTaskPayload> {
  id: number
}

export interface CreateCategoryPayload {
  name: string
  color: string
}
