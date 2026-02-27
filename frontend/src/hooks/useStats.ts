import { useQuery } from '@tanstack/react-query'
import { fetchStats } from '@/lib/api'

export function useStatsQuery() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: fetchStats,
    refetchInterval: 30000, // refresh every 30 seconds
  })
}
