import { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import { Priority, Status, Task } from '@/types';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (value: Omit<Task, 'id'> & { id?: string }) => void;
  existingTitles: string[];
  initial?: Task | null;
}

const priorities: Priority[] = ['High', 'Medium', 'Low'];
const statuses: Status[] = ['Todo', 'In Progress', 'Done'];

export default function TaskForm({ open, onClose, onSubmit, existingTitles, initial }: Props) {
  const [title, setTitle] = useState('');
  const [revenue, setRevenue] = useState<number | ''>('');
  const [timeTaken, setTimeTaken] = useState<number | ''>('');
  const [priority, setPriority] = useState<Priority | ''>('');
  const [status, setStatus] = useState<Status | ''>('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!open) return;
    if (initial) {
      setTitle(initial.title);
      setRevenue(initial.revenue);
      setTimeTaken(initial.timeTaken);
      setPriority(initial.priority);
      setStatus(initial.status);
      setNotes(initial.notes ?? '');
    } else {
      setTitle('');
      setRevenue('');
      setTimeTaken('');
      setPriority('');
      setStatus('');
      setNotes('');
    }
  }, [open, initial]);

  const duplicateTitle = useMemo(() => {
    const current = title.trim().toLowerCase();
    if (!current) return false;
    const others = initial ? existingTitles.filter(t => t.toLowerCase() !== initial.title.toLowerCase()) : existingTitles;
    return others.map(t => t.toLowerCase()).includes(current);
  }, [title, existingTitles, initial]);

  const canSubmit =
    !!title.trim() &&
    !duplicateTitle &&
    typeof revenue === 'number' && revenue >= 0 &&
    typeof timeTaken === 'number' && timeTaken > 0 &&
    !!priority &&
    !!status;

  const handleSubmit = () => {
    const safeTime = typeof timeTaken === 'number' && timeTaken > 0 ? timeTaken : 1; // auto-correct
    const payload: Omit<Task, 'id'> & { id?: string } = {
      title: title.trim(),
      revenue: typeof revenue === 'number' ? revenue : 0,
      timeTaken: safeTime,
      priority: ((priority || 'Medium') as Priority),
      status: ((status || 'Todo') as Status),
      notes: notes.trim() || undefined,
      ...(initial ? { id: initial.id } : {}),
    };
    onSubmit(payload);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initial ? 'Edit Task' : 'Add Task'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            error={!!title && duplicateTitle}
            helperText={duplicateTitle ? 'Duplicate title not allowed' : ' '}
            required
            autoFocus
          />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              label="Revenue"
              type="number"
              value={revenue}
              onChange={e => setRevenue(e.target.value === '' ? '' : Number(e.target.value))}
              inputProps={{ min: 0, step: 1 }}
              required
              fullWidth
            />
            <TextField
              label="Time Taken (h)"
              type="number"
              value={timeTaken}
              onChange={e => setTimeTaken(e.target.value === '' ? '' : Number(e.target.value))}
              inputProps={{ min: 1, step: 1 }}
              required
              fullWidth
            />
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <FormControl fullWidth required>
              <InputLabel id="priority-label">Priority</InputLabel>
              <Select labelId="priority-label" label="Priority" value={priority} onChange={e => setPriority(e.target.value as Priority)}>
                {priorities.map(p => (
                  <MenuItem key={p} value={p}>{p}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth required>
              <InputLabel id="status-label">Status</InputLabel>
              <Select labelId="status-label" label="Status" value={status} onChange={e => setStatus(e.target.value as Status)}>
                {statuses.map(s => (
                  <MenuItem key={s} value={s}>{s}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
          <TextField label="Notes" value={notes} onChange={e => setNotes(e.target.value)} multiline minRows={2} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!canSubmit}>
          {initial ? 'Save Changes' : 'Add Task'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}


