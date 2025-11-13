import { Snackbar, Button } from '@mui/material';

interface Props {
  open: boolean;
  onClose: () => void;
  onUndo: () => void;
  onExited?: () => void;
}

export default function UndoSnackbar({ open, onClose, onUndo, onExited }: Props) {
  return (
    <Snackbar
      open={open}
      onClose={onClose}
      autoHideDuration={4000}
      message="Task deleted"
      action={<Button color="secondary" size="small" onClick={onUndo}>Undo</Button>}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      TransitionProps={{ onExited: onExited }}
    />
  );
}


