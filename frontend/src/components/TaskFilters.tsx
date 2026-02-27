import { useEffect, useState, useCallback } from 'react'
import { Search, X, SlidersHorizontal } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCategoriesQuery } from '@/hooks/useCategories'
import type { TaskFilters as Filters, Status, Priority } from '@/types'

interface TaskFiltersProps {
  filters: Filters
  onChange: (filters: Filters) => void
}

export function TaskFilters({ filters, onChange }: TaskFiltersProps) {
  const { data: categories } = useCategoriesQuery()
  const [searchValue, setSearchValue] = useState(filters.search ?? '')

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange({ ...filters, search: searchValue || undefined })
    }, 300)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue])

  const hasActiveFilters =
    filters.status || filters.priority || filters.category_id || filters.search

  const clearFilters = useCallback(() => {
    setSearchValue('')
    onChange({})
  }, [onChange])

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <SlidersHorizontal className="h-4 w-4" />
        <span className="text-sm font-medium hidden sm:block">Filters</span>
      </div>

      {/* Search */}
      <div className="relative flex-1 min-w-[180px] max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Search tasks..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="pl-9 h-9"
        />
        {searchValue && (
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => setSearchValue('')}
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Status filter */}
      <Select
        value={filters.status ?? 'all'}
        onValueChange={(val) =>
          onChange({ ...filters, status: val === 'all' ? '' : (val as Status) })
        }
      >
        <SelectTrigger className="h-9 w-[130px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="todo">Todo</SelectItem>
          <SelectItem value="in_progress">In Progress</SelectItem>
          <SelectItem value="done">Done</SelectItem>
        </SelectContent>
      </Select>

      {/* Priority filter */}
      <Select
        value={filters.priority ?? 'all'}
        onValueChange={(val) =>
          onChange({
            ...filters,
            priority: val === 'all' ? '' : (val as Priority),
          })
        }
      >
        <SelectTrigger className="h-9 w-[130px]">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priorities</SelectItem>
          <SelectItem value="high">High</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="low">Low</SelectItem>
        </SelectContent>
      </Select>

      {/* Category filter */}
      <Select
        value={filters.category_id ? String(filters.category_id) : 'all'}
        onValueChange={(val) =>
          onChange({
            ...filters,
            category_id: val === 'all' ? '' : Number(val),
          })
        }
      >
        <SelectTrigger className="h-9 w-[140px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories?.map((cat) => (
            <SelectItem key={cat.id} value={String(cat.id)}>
              <span className="flex items-center gap-2">
                <span
                  className="inline-block w-2 h-2 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                {cat.name}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Clear filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="h-9 gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
          Clear
        </Button>
      )}
    </div>
  )
}
