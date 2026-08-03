import { useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, FormControl, InputLabel, Select, MenuItem, TextField, Stack,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-hot-toast";
import { addBorrow } from "../../services/borrowService";
import type { BorrowRequest } from "../../types/borrow";

interface Props {
  open: boolean;
  onClose: () => void;
  users: Array<{ id: number; name: string }>;
  books: Array<{ id: number; title: string }>;
  onBorrowAdded: () => void;
}

export default function BorrowModal({ open, onClose, users, books, onBorrowAdded }: Props) {
  const { control, handleSubmit, reset, register } = useForm<BorrowRequest>({
    defaultValues: { bookId: 0, borrowerName: "" },
  });

  useEffect(() => {
    if (open) reset({ bookId: 0, borrowerName: "" });
  }, [open, reset]);

  const onSubmit = async (data: BorrowRequest) => {
    if (!data.bookId || !data.borrowerName.trim()) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      await addBorrow(data);
      toast.success("Book issued successfully!");
      onBorrowAdded();
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to issue book");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle fontWeight={700}>Issue Book</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={2} mt={1}>
          {/* Borrower name - either type or pick from users */}
          <Controller
            name="borrowerName"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>Select Borrower</InputLabel>
                <Select
                  {...field}
                  label="Select Borrower"
                  onChange={(e) => field.onChange(e.target.value)}
                >
                  {users.map((u) => (
                    <MenuItem key={u.id} value={u.name}>{u.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />

          <Controller
            name="bookId"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>Select Book</InputLabel>
                <Select
                  {...field}
                  label="Select Book"
                  onChange={(e) => field.onChange(Number(e.target.value))}
                >
                  {books.map((b) => (
                    <MenuItem key={b.id} value={b.id}>{b.title}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ borderRadius: 2 }}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          sx={{ borderRadius: 2, fontWeight: 700 }}
        >
          Issue Book
        </Button>
      </DialogActions>
    </Dialog>
  );
}
