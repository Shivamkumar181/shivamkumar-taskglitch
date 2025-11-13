import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import { BarChart, LineChart, PieChart } from '@mui/x-charts';
import { DerivedTask, Task } from '@/types';
import {
  computeFunnel,
  computeThroughputByWeek,
  computeWeightedPipeline,
  computeForecast,
  computeVelocityByPriority,
} from '@/utils/logic';

interface Props {
  tasks: DerivedTask[];
}

export default function AnalyticsDashboard({ tasks }: Props) {
  const baseTasks = tasks as unknown as Task[];
  const funnel = computeFunnel(baseTasks);
  const weekly = computeThroughputByWeek(baseTasks);
  const weightedPipeline = computeWeightedPipeline(baseTasks);
  const forecast = computeForecast(weekly.map(w => ({ week: w.week, revenue: w.revenue })), 4);
  const velocity = computeVelocityByPriority(baseTasks);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight={700} gutterBottom>Analytics</Typography>
        <Stack spacing={3}>
          <Box>
            <Typography variant="body2" color="text.secondary">Funnel</Typography>
            <BarChart
              height={240}
              xAxis={[{ scaleType: 'band', data: ['Todo', 'In Progress', 'Done'] }]}
              series={[{ data: [funnel.todo, funnel.inProgress, funnel.done], color: '#4F6BED' }]}
            />
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">Throughput (weekly completed)</Typography>
            <LineChart
              height={240}
              xAxis={[{ scaleType: 'band', data: weekly.map(w => w.week) }]}
              series={[{ data: weekly.map(w => w.count), color: '#22A699' }]}
            />
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">Weighted Pipeline</Typography>
            <PieChart height={240} series={[{ data: [
              { id: 0, label: 'Weighted Revenue', value: weightedPipeline },
            ] }]} />
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">Forecast (next 4 weeks)</Typography>
            <LineChart
              height={240}
              xAxis={[{ scaleType: 'band', data: forecast.map(f => f.week) }]}
              series={[{ data: forecast.map(f => f.revenue), color: '#F59E0B' }]}
            />
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">Velocity by Priority (avg days)</Typography>
            <BarChart
              height={240}
              xAxis={[{ scaleType: 'band', data: ['High', 'Medium', 'Low'] }]}
              series={[{ data: [velocity.High.avgDays, velocity.Medium.avgDays, velocity.Low.avgDays], color: '#8B5CF6' }]}
            />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}


