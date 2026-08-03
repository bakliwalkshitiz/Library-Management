import { useEffect, useState } from "react";
import { Button, Paper, Typography, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { toast } from "react-hot-toast";
import type { Borrow } from "../../types/borrow";
import type { Book } from "../../types/book";
import { getBorrows, deleteBorrow } from "../../services/borrowService";
import { getUsers } from "../../services/userService";
import { getBooks } from "../../services/bookService";
import BorrowTable from "../../components/borrow/BorrowTable";
import BorrowModal from "../../components/borrow/BorrowModal";
import ReturnDialog from "../../components/borrow/ReturnDialog";

export default function BorrowRecords() {
  const [borrowList, setBorrowList] = useState<Borrow[]>([]);
  const [users, setUsers] = useState<Array<{ id: number; name: string }>>([]);
  const [books, setBooks] = useState<Array<{ id: number; title: string }>>([]);
  const [open, setOpen] = useState(false);
  const [returnOpen, setReturnOpen] = useState(false);
  const [selectedBorrow, setSelectedBorrow] = useState<Borrow | null>(null);

  const loadBorrows = async () => {
    try {
      const res = await getBorrows();
      setBorrowList(res.data || []);
    } catch { toast.error("Failed to load borrow records"); }
  };

  const loadUsers = async () => {
    try {
      const res = await getUsers();
      setUsers((res.data || []).map((u: any) => ({ id: u.id, name: u.name })));
    } catch { toast.error("Failed to load users"); }
  };

  const loadBooks = async () => {
    try {
      const res = await getBooks();
      const data: Book[] = res.data || [];
      setBooks(data.map((b) => ({ id: b.id, title: b.title })));
    } catch { toast.error("Failed to load books"); }
  };

  const handleReturnClick = (borrow: Borrow) => {
    setSelectedBorrow(borrow);
    setReturnOpen(true);
  };

  const handleReturnConfirm = async () => {
    if (!selectedBorrow) return;
    try {
      await deleteBorrow(selectedBorrow.id);
      toast.success("Book returned successfully!");
      loadBorrows();
    } catch { toast.error("Return failed"); }
    setReturnOpen(false);
  };

  const handleDeleteClick = async (borrow: Borrow) => {
    try {
      await deleteBorrow(borrow.id);
      toast.success("Record deleted");
      loadBorrows();
    } catch { toast.error("Delete failed"); }
  };

  useEffect(() => {
    loadBorrows();
    loadUsers();
    loadBooks();
  }, []);

  return (
    <Paper sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={700}>Borrow Records</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
          Issue Book
        </Button>
      </Box>

      <BorrowTable
        borrows={borrowList}
        onReturn={handleReturnClick}
        onDelete={handleDeleteClick}
      />

      <BorrowModal
        open={open}
        onClose={() => setOpen(false)}
        users={users}
        books={books}
        onBorrowAdded={loadBorrows}
      />

      <ReturnDialog
        open={returnOpen}
        onClose={() => setReturnOpen(false)}
        onConfirm={handleReturnConfirm}
      />
    </Paper>
  );
}
