import ConfirmDialog from "../common/ConfirmDialog";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ReturnDialog({ open, onClose, onConfirm }: Props) {
  return (
    <ConfirmDialog
      open={open}
      title="Return Book"
      message="Are you sure you want to mark this book as returned? This will remove the borrow record."
      onClose={onClose}
      onConfirm={onConfirm}
      confirmLabel="Return Book"
      confirmColor="primary"
    />
  );
}
