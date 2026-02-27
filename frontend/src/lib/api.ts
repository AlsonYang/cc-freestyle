import axios from 'axios'
import type {
  Task,
  Category,
  Stats,
  TaskFilters,
  CreateTaskPayload,
  CreateCategoryPayload,
} from '@/types'

const api = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Tasks
export async function fetchTasks(filters?: TaskFilters): Promise<Task[]> {
  const params = new URLSearchParams()
  if (filters?.status) params.set('status', filters.status)
  if (filters?.priority) params.set('priority', filters.priority)
  if (filters?.category_id) params.set('category_id', String(filters.category_id))
  if (filters?.search) params.set('search', filters.search)

  const query = params.toString()
  const url = query ? `/api/tasks?${query}` : '/api/tasks'
  const { data } = await api.get<Task[]>(url)
  return data
}

export async function fetchTask(id: number): Promise<Task> {
  const { data } = await api.get<Task>(`/api/tasks/${id}`)
  return data
}

export async function createTask(payload: CreateTaskPayload): Promise<Task> {
  const { data } = await api.post<Task>('/api/tasks', payload)
  return data
}

export async function updateTask(
  id: number,
  payload: Partial<CreateTaskPayload>
): Promise<Task> {
  const { data } = await api.put<Task>(`/api/tasks/${id}`, payload)
  return data
}

export async function deleteTask(id: number): Promise<void> {
  await api.delete(`/api/tasks/${id}`)
}

// Categories
export async function fetchCategories(): Promise<Category[]> {
  const { data } = await api.get<Category[]>('/api/categories')
  return data
}

export async function createCategory(
  payload: CreateCategoryPayload
): Promise<Category> {
  const { data } = await api.post<Category>('/api/categories', payload)
  return data
}

export async function deleteCategory(id: number): Promise<void> {
  await api.delete(`/api/categories/${id}`)
}

// Stats
export async function fetchStats(): Promise<Stats> {
  const { data } = await api.get<Stats>('/api/stats')
  return data
}
