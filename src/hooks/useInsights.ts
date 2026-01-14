import { useMemo } from 'react';
import { useUserStore } from '../store/useUserStore';
import { getInsights } from '../insights';

export function useInsights() {
  const logs = useUserStore((state) => state.logs);

  // Memoiza os insights para não recalcular em cada re-render irrelevante
  const insights = useMemo(() => {
    return getInsights(logs);
  }, [logs]);

  return insights;
}