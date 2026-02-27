import { CheckCircle2, Circle, Clock, ListTodo, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useStatsQuery } from '@/hooks/useStats'

interface StatCardProps {
  label: string
  value: number
  icon: React.ReactNode
  colorClass: string
  bgClass: string
}

function StatCard({ label, value, icon, colorClass, bgClass }: StatCardProps) {
  return (
    <Card className="flex-1 min-w-[140px]">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {label}
          </span>
          <div className={`p-1.5 rounded-md ${bgClass}`}>
            <div className={colorClass}>{icon}</div>
          </div>
        </div>
        <div className="text-3xl font-bold text-foreground">{value}</div>
      </CardContent>
    </Card>
  )
}

interface PriorityBarProps {
  label: string
  value: number
  total: number
  colorClass: string
}

function PriorityBar({ label, value, total, colorClass }: PriorityBarProps) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground w-14 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground w-6 text-right">{value}</span>
    </div>
  )
}

export function StatsBar() {
  const { data: stats, isLoading } = useStatsQuery()

  if (isLoading) {
    return (
      <div className="flex gap-3 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex-1 h-24 rounded-lg bg-muted" />
        ))}
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="space-y-3">
      <div className="flex gap-3 flex-wrap">
        <StatCard
          label="Total"
          value={stats.total}
          icon={<ListTodo className="h-4 w-4" />}
          colorClass="text-primary"
          bgClass="bg-primary/10"
        />
        <StatCard
          label="Todo"
          value={stats.by_status.todo}
          icon={<Circle className="h-4 w-4" />}
          colorClass="text-slate-400"
          bgClass="bg-slate-800"
        />
        <StatCard
          label="In Progress"
          value={stats.by_status.in_progress}
          icon={<Clock className="h-4 w-4" />}
          colorClass="text-blue-400"
          bgClass="bg-blue-900/40"
        />
        <StatCard
          label="Done"
          value={stats.by_status.done}
          icon={<CheckCircle2 className="h-4 w-4" />}
          colorClass="text-emerald-400"
          bgClass="bg-emerald-900/40"
        />
      </div>

      {stats.total > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Priority Breakdown
              </span>
            </div>
            <div className="space-y-2">
              <PriorityBar
                label="High"
                value={stats.by_priority.high}
                total={stats.total}
                colorClass="bg-red-500"
              />
              <PriorityBar
                label="Medium"
                value={stats.by_priority.medium}
                total={stats.total}
                colorClass="bg-yellow-500"
              />
              <PriorityBar
                label="Low"
                value={stats.by_priority.low}
                total={stats.total}
                colorClass="bg-green-500"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
