import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Tag, Plus, Trash2, ChevronDown, ChevronUp, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  useCategoriesQuery,
  useCreateCategory,
  useDeleteCategory,
} from '@/hooks/useCategories'

const PRESET_COLORS = [
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#14b8a6', // teal
  '#06b6d4', // cyan
  '#a855f7', // purple
]

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name too long'),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Invalid color'),
})

type CategoryFormData = z.infer<typeof categorySchema>

export function CategoryManager() {
  const [isExpanded, setIsExpanded] = useState(false)
  const { data: categories, isLoading } = useCategoriesQuery()
  const createCategory = useCreateCategory()
  const deleteCategory = useDeleteCategory()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      color: PRESET_COLORS[0],
    },
  })

  const selectedColor = watch('color')

  const onSubmit = async (data: CategoryFormData) => {
    try {
      await createCategory.mutateAsync(data)
      reset({ name: '', color: PRESET_COLORS[0] })
    } catch (err) {
      console.error('Failed to create category:', err)
    }
  }

  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`Delete category "${name}"? Tasks in this category will be uncategorized.`)) {
      deleteCategory.mutate(id)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <button
          className="flex items-center justify-between w-full group"
          onClick={() => setIsExpanded((v) => !v)}
          aria-expanded={isExpanded}
        >
          <CardTitle className="flex items-center gap-2 text-base">
            <Tag className="h-4 w-4 text-primary" />
            Categories
            {categories && (
              <span className="text-xs font-normal text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                {categories.length}
              </span>
            )}
          </CardTitle>
          <div className="text-muted-foreground group-hover:text-foreground transition-colors">
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </div>
        </button>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0 space-y-4">
          {/* Existing categories */}
          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : categories && categories.length > 0 ? (
            <div className="space-y-2">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-2 rounded-md bg-muted/50 hover:bg-muted transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-3 h-3 rounded-full shrink-0 ring-1 ring-white/20"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="text-sm font-medium">{cat.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                    onClick={() => handleDelete(cat.id, cat.name)}
                    disabled={deleteCategory.isPending}
                    aria-label={`Delete ${cat.name}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-2">
              No categories yet
            </p>
          )}

          <Separator />

          {/* Add new category */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Add Category
            </p>

            <div className="space-y-1.5">
              <Label htmlFor="cat-name">Name</Label>
              <Input
                id="cat-name"
                placeholder="e.g. Design, Engineering..."
                {...register('name')}
                className={`h-9 ${errors.name ? 'border-destructive' : ''}`}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            {/* Color picker */}
            <div className="space-y-1.5">
              <Label>Color</Label>
              <div className="flex items-center gap-2 flex-wrap">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`w-6 h-6 rounded-full transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background ${
                      selectedColor === color
                        ? 'ring-2 ring-white ring-offset-2 ring-offset-background scale-110'
                        : ''
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setValue('color', color)}
                    aria-label={`Select color ${color}`}
                  />
                ))}
                <input
                  type="color"
                  {...register('color')}
                  className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent p-0"
                  title="Custom color"
                />
              </div>
              {errors.color && (
                <p className="text-xs text-destructive">{errors.color.message}</p>
              )}
            </div>

            <Button
              type="submit"
              size="sm"
              className="w-full gap-1.5"
              disabled={createCategory.isPending}
            >
              {createCategory.isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Plus className="h-3.5 w-3.5" />
              )}
              Add Category
            </Button>
          </form>
        </CardContent>
      )}
    </Card>
  )
}
