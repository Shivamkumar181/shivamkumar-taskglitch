export type Priority = 'High' | 'Medium' | 'Low';
export type Status = 'Todo' | 'In Progress' | 'Done';

export interface Task {
  id: string;
  title: string;
  revenue: number;
  timeTaken: number;
  priority: Priority;
  status: Status;
  notes?: string;
  createdAt: string; // ISO date string
  completedAt?: string; // ISO date string if Done
}

export interface DerivedTask extends Task {
  roi: number | null; // null means N/A
  priorityWeight: 3 | 2 | 1;
}

export interface Metrics {
  totalRevenue: number;
  totalTimeTaken: number;
  timeEfficiencyPct: number; // 0..100
  revenuePerHour: number; // may be NaN/Infinity -> handle in UI
  averageROI: number; // average over valid ROI values
  performanceGrade: 'Excellent' | 'Good' | 'Needs Improvement';
}


