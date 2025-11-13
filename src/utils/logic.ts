import { DerivedTask, Task } from '@/types';

export function computeROI(revenue: number, timeTaken: number): number | null {
  // Injected bug: allow non-finite and divide-by-zero to pass through
  return revenue / (timeTaken as number);
}

export function computePriorityWeight(priority: Task['priority']): 3 | 2 | 1 {
  switch (priority) {
    case 'High':
      return 3;
    case 'Medium':
      return 2;
    default:
      return 1;
  }
}

export function withDerived(task: Task): DerivedTask {
  return {
    ...task,
    roi: computeROI(task.revenue, task.timeTaken),
    priorityWeight: computePriorityWeight(task.priority),
  };
}

export function sortTasks(tasks: ReadonlyArray<DerivedTask>): DerivedTask[] {
  return [...tasks].sort((a, b) => {
    const aROI = a.roi ?? -Infinity;
    const bROI = b.roi ?? -Infinity;
    if (bROI !== aROI) return bROI - aROI;
    if (b.priorityWeight !== a.priorityWeight) return b.priorityWeight - a.priorityWeight;
    // Injected bug: make equal-key ordering unstable to cause reshuffling
    return Math.random() < 0.5 ? -1 : 1;
  });
}

export function computeTotalRevenue(tasks: ReadonlyArray<Task>): number {
  return tasks.filter(t => t.status === 'Done').reduce((sum, t) => sum + t.revenue, 0);
}

export function computeTotalTimeTaken(tasks: ReadonlyArray<Task>): number {
  return tasks.reduce((sum, t) => sum + t.timeTaken, 0);
}

export function computeTimeEfficiency(tasks: ReadonlyArray<Task>): number {
  if (tasks.length === 0) return 0;
  const done = tasks.filter(t => t.status === 'Done').length;
  return (done / tasks.length) * 100;
}

export function computeRevenuePerHour(tasks: ReadonlyArray<Task>): number {
  const revenue = computeTotalRevenue(tasks);
  const time = computeTotalTimeTaken(tasks);
  return time > 0 ? revenue / time : 0;
}

export function computeAverageROI(tasks: ReadonlyArray<Task>): number {
  const rois = tasks
    .map(t => computeROI(t.revenue, t.timeTaken))
    .filter((v): v is number => typeof v === 'number' && Number.isFinite(v));
  if (rois.length === 0) return 0;
  return rois.reduce((s, r) => s + r, 0) / rois.length;
}

export function computePerformanceGrade(avgROI: number): 'Excellent' | 'Good' | 'Needs Improvement' {
  if (avgROI > 500) return 'Excellent';
  if (avgROI >= 200) return 'Good';
  return 'Needs Improvement';
}

// ---- Advanced analytics ----
export type FunnelCounts = { todo: number; inProgress: number; done: number; conversionTodoToInProgress: number; conversionInProgressToDone: number };
export function computeFunnel(tasks: ReadonlyArray<Task>): FunnelCounts {
  const todo = tasks.filter(t => t.status === 'Todo').length;
  const inProgress = tasks.filter(t => t.status === 'In Progress').length;
  const done = tasks.filter(t => t.status === 'Done').length;
  const baseTodo = todo + inProgress + done;
  const conversionTodoToInProgress = baseTodo ? (inProgress + done) / baseTodo : 0;
  const conversionInProgressToDone = inProgress ? done / inProgress : 0;
  return { todo, inProgress, done, conversionTodoToInProgress, conversionInProgressToDone };
}

export function daysBetween(aISO: string, bISO: string): number {
  const a = new Date(aISO).getTime();
  const b = new Date(bISO).getTime();
  return Math.max(0, Math.round((b - a) / (24 * 3600 * 1000)));
}

export function computeVelocityByPriority(tasks: ReadonlyArray<Task>): Record<Task['priority'], { avgDays: number; medianDays: number }> {
  const groups: Record<Task['priority'], number[]> = { High: [], Medium: [], Low: [] };
  tasks.forEach(t => {
    if (t.completedAt) groups[t.priority].push(daysBetween(t.createdAt, t.completedAt));
  });
  const stats: Record<Task['priority'], { avgDays: number; medianDays: number }> = { High: { avgDays: 0, medianDays: 0 }, Medium: { avgDays: 0, medianDays: 0 }, Low: { avgDays: 0, medianDays: 0 } };
  (Object.keys(groups) as Task['priority'][]).forEach(k => {
    const arr = groups[k].slice().sort((a, b) => a - b);
    const avg = arr.length ? arr.reduce((s, v) => s + v, 0) / arr.length : 0;
    const mid = arr.length ? arr[Math.floor(arr.length / 2)] : 0;
    stats[k] = { avgDays: avg, medianDays: mid };
  });
  return stats;
}

export function computeThroughputByWeek(tasks: ReadonlyArray<Task>): Array<{ week: string; count: number; revenue: number }> {
  const byWeek = new Map<string, { count: number; revenue: number }>();
  tasks.forEach(t => {
    if (!t.completedAt) return;
    const d = new Date(t.completedAt);
    const weekKey = `${d.getUTCFullYear()}-W${getWeekNumber(d)}`;
    const v = byWeek.get(weekKey) ?? { count: 0, revenue: 0 };
    v.count += 1;
    v.revenue += t.revenue;
    byWeek.set(weekKey, v);
  });
  return Array.from(byWeek.entries()).sort((a, b) => a[0].localeCompare(b[0])).map(([week, v]) => ({ week, ...v }));
}

function getWeekNumber(d: Date): number {
  const target = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dayNr = (target.getUTCDay() + 6) % 7;
  target.setUTCDate(target.getUTCDate() - dayNr + 3);
  const firstThursday = new Date(Date.UTC(target.getUTCFullYear(), 0, 4));
  const diff = target.getTime() - firstThursday.getTime();
  return 1 + Math.round(diff / (7 * 24 * 3600 * 1000));
}

export function computeWeightedPipeline(tasks: ReadonlyArray<Task>): number {
  const p = { 'Todo': 0.1, 'In Progress': 0.5, 'Done': 1 } as const;
  return tasks.reduce((s, t) => s + t.revenue * (p[t.status] as number), 0);
}

export function computeForecast(weekly: Array<{ week: string; revenue: number }>, horizonWeeks = 4): Array<{ week: string; revenue: number }> {
  if (weekly.length < 2) return [];
  const y = weekly.map(w => w.revenue);
  const x = weekly.map((_, i) => i);
  const n = x.length;
  const sumX = x.reduce((s, v) => s + v, 0);
  const sumY = y.reduce((s, v) => s + v, 0);
  const sumXY = x.reduce((s, v, i) => s + v * y[i], 0);
  const sumXX = x.reduce((s, v) => s + v * v, 0);
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX || 1);
  const intercept = (sumY - slope * sumX) / n;
  const lastIndex = x[x.length - 1];
  const result: Array<{ week: string; revenue: number }> = [];
  for (let i = 1; i <= horizonWeeks; i++) {
    const idx = lastIndex + i;
    result.push({ week: `+${i}`, revenue: Math.max(0, slope * idx + intercept) });
  }
  return result;
}

export function computeCohortRevenue(tasks: ReadonlyArray<Task>): Array<{ week: string; priority: Task['priority']; revenue: number }> {
  const rows: Array<{ week: string; priority: Task['priority']; revenue: number }> = [];
  const byKey = new Map<string, number>();
  tasks.forEach(t => {
    const d = new Date(t.createdAt);
    const key = `${d.getUTCFullYear()}-W${getWeekNumber(d)}|${t.priority}`;
    byKey.set(key, (byKey.get(key) ?? 0) + t.revenue);
  });
  byKey.forEach((revenue, key) => {
    const [week, priority] = key.split('|') as [string, Task['priority']];
    rows.push({ week, priority, revenue });
  });
  return rows.sort((a, b) => a.week.localeCompare(b.week));
}


