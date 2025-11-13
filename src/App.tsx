import { Alert, Avatar, Box, Button, CircularProgress, Container, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import MetricsBar from '@/components/MetricsBar';
import TaskTable from '@/components/TaskTable';
import UndoSnackbar from '@/components/UndoSnackbar';
import { useCallback, useMemo, useState } from 'react';
import { UserProvider, useUser } from '@/context/UserContext';
import { TasksProvider, useTasksContext } from '@/context/TasksContext';
import ChartsDashboard from '@/components/ChartsDashboard';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import ActivityLog, { ActivityItem } from '@/components/ActivityLog';
import { downloadCSV, toCSV } from '@/utils/csv';
import type { Task } from '@/types';
import {
  computeAverageROI,
  computePerformanceGrade,
  computeRevenuePerHour,
  computeTimeEfficiency,
  computeTotalRevenue,
} from '@/utils/logic';

function AppContent() {
  const { loading, error, metrics, derivedSorted, addTask, updateTask, deleteTask, undoDelete, lastDeleted } = useTasksContext();
  const handleCloseUndo = () => {};
  const [q, setQ] = useState('');
  const [fStatus, setFStatus] = useState<string>('All');
  const [fPriority, setFPriority] = useState<string>('All');
  const { user } = useUser();
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const createActivity = useCallback((type: ActivityItem['type'], summary: string): ActivityItem => ({
    id: (typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`),
    ts: Date.now(),
    type,
    summary,
  }), []);

  const filtered = useMemo(() => {
    return derivedSorted.filter(t => {
      if (q && !t.title.toLowerCase().includes(q.toLowerCase())) return false;
      if (fStatus !== 'All' && t.status !== fStatus) return false;
      if (fPriority !== 'All' && t.priority !== fPriority) return false;
      return true;
    });
  }, [derivedSorted, q, fStatus, fPriority]);

  const handleAdd = useCallback((payload: Omit<Task, 'id'>) => {
    addTask(payload);
    setActivity(prev => [createActivity('add', `Added: ${payload.title}`), ...prev].slice(0, 50));
  }, [addTask, createActivity]);
  const handleUpdate = useCallback((id: string, patch: Partial<Task>) => {
    updateTask(id, patch);
    setActivity(prev => [createActivity('update', `Updated: ${Object.keys(patch).join(', ')}`), ...prev].slice(0, 50));
  }, [updateTask, createActivity]);
  const handleDelete = useCallback((id: string) => {
    deleteTask(id);
    setActivity(prev => [createActivity('delete', `Deleted task ${id}`), ...prev].slice(0, 50));
  }, [deleteTask, createActivity]);
  const handleUndo = useCallback(() => {
    undoDelete();
    setActivity(prev => [createActivity('undo', 'Undo delete'), ...prev].slice(0, 50));
  }, [undoDelete, createActivity]);
  return (
    <Box sx={{ minHeight: '100dvh', bgcolor: 'background.default' }}>
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        <Stack spacing={3}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="h3" fontWeight={700} gutterBottom>
                TaskGlitch
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Welcome back, {user.name.split(' ')[0]}.
              </Typography>
            </Box>
            <Stack direction="row" spacing={2} alignItems="center">
              <Button variant="outlined" onClick={() => {
                const csv = toCSV(filtered);
                downloadCSV('tasks.csv', csv);
              }}>Export CSV</Button>
              <Avatar sx={{ width: 40, height: 40 }}>{user.name.charAt(0)}</Avatar>
            </Stack>
          </Stack>
          {loading && (
            <Stack alignItems="center" py={6}>
              <CircularProgress />
            </Stack>
          )}
          {error && <Alert severity="error">{error}</Alert>}
          {!loading && !error && (
            <MetricsBar
              metricsOverride={{
                totalRevenue: computeTotalRevenue(filtered),
                totalTimeTaken: filtered.reduce((s, t) => s + t.timeTaken, 0),
                timeEfficiencyPct: computeTimeEfficiency(filtered),
                revenuePerHour: computeRevenuePerHour(filtered),
                averageROI: computeAverageROI(filtered),
                performanceGrade: computePerformanceGrade(computeAverageROI(filtered)),
              }}
            />
          )}
          {!loading && !error && (
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }}>
              <TextField placeholder="Search by title" value={q} onChange={e => setQ(e.target.value)} fullWidth />
              <Select value={fStatus} onChange={e => setFStatus(e.target.value)} displayEmpty sx={{ minWidth: 180 }}>
                <MenuItem value="All">All Statuses</MenuItem>
                <MenuItem value="Todo">Todo</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Done">Done</MenuItem>
              </Select>
              <Select value={fPriority} onChange={e => setFPriority(e.target.value)} displayEmpty sx={{ minWidth: 180 }}>
                <MenuItem value="All">All Priorities</MenuItem>
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
              </Select>

            </Stack>
          )}
          {!loading && !error && (
            <TaskTable
              tasks={filtered}
              onAdd={handleAdd}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          )}
          {!loading && !error && <ChartsDashboard tasks={filtered} />}
          {!loading && !error && <AnalyticsDashboard tasks={filtered} />}
          {!loading && !error && <ActivityLog items={activity} />}
          <UndoSnackbar open={!!lastDeleted} onClose={handleCloseUndo} onUndo={handleUndo} />
         </Stack>
      </Container>
    </Box>
  );
}

export default function App() {
  return (
    <UserProvider>
      <TasksProvider>
        <AppContent />
      </TasksProvider>
    </UserProvider>
  );
}


