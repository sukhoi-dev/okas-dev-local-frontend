import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, CircularProgress } from '@mui/material';

export default function ConfirmDialog({ open, title, message, onConfirm, onClose, loading = false, confirmColor = 'error' }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={loading} variant="outlined">Cancel</Button>
        <Button onClick={onConfirm} color={confirmColor} variant="contained" disabled={loading}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}>
          {loading ? 'Processing...' : 'Confirm'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
