import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography,
} from "@mui/material";

interface Props {
  open: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
  confirmColor?: "error" | "primary" | "warning";
}

export default function ConfirmDialog({
  open, title, message, onClose, onConfirm,
  confirmLabel = "Confirm", confirmColor = "error",
}: Props) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle fontWeight={700}>{title}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary">{message}</Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ borderRadius: 2 }}>Cancel</Button>
        <Button
          variant="contained" color={confirmColor}
          onClick={() => { onConfirm(); onClose(); }}
          sx={{ borderRadius: 2, fontWeight: 700 }}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
