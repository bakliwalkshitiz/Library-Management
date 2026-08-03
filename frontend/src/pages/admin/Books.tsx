import { useEffect, useState } from "react";
import {
  Box, Button, Paper, Typography, Table, TableHead, TableBody,
  TableRow, TableCell, TableContainer, IconButton, Tooltip,
  Chip, TextField, InputAdornment, CircularProgress, Stack, Avatar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import ArticleIcon from "@mui/icons-material/Article";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getBooks, getMyBooks, deleteBook } from "../../services/bookService";
import { getAuthors } from "../../services/authorService";
import { getCategories } from "../../services/categoryService";
import type { Book } from "../../types/book";
import type { Author } from "../../types/author";
import type { Category } from "../../types/category";
import BookModal from "../../components/books/BookModal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { useAuth } from "../../context/AuthContext";

export default function Books() {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editBook, setEditBook] = useState<Book | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [bRes, aRes, cRes] = await Promise.all([
        isAdmin ? getBooks() : getMyBooks(),
        getAuthors(),
        getCategories(),
      ]);
      const fetchedBooks: Book[] = bRes.data ?? [];
      const allAuthors: Author[] = aRes.data ?? [];
      const allCategories: Category[] = cRes.data ?? [];

      setBooks(fetchedBooks);

      if (!isAdmin) {
        const myAuthorNames = new Set(fetchedBooks.map((b) => b.authorName).filter(Boolean));
        const localAuthors: string[] = JSON.parse(localStorage.getItem(`publisher_authors_${user?.id}`) || "[]");
        localAuthors.forEach((n) => myAuthorNames.add(n));
        setAuthors(allAuthors.filter((a) => myAuthorNames.has(a.name)));

        const myCategoryNames = new Set(fetchedBooks.flatMap((b) => b.categories ?? []).filter(Boolean));
        const localCategories: string[] = JSON.parse(localStorage.getItem(`publisher_categories_${user?.id}`) || "[]");
        localCategories.forEach((n) => myCategoryNames.add(n));
        setCategories(allCategories.filter((c) => myCategoryNames.has(c.name)));
      } else {
        setAuthors(allAuthors);
        setCategories(allCategories);
      }
    } catch { toast.error("Failed to load data"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteBook(deleteId);
      toast.success("Book deleted");
      load();
    } catch { toast.error("Failed to delete"); }
    finally { setDeleteId(null); }
  };

  const filtered = books.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    (b.authorName ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h5" fontWeight={700}>Books</Typography>
          <Typography variant="body2" color="text.secondary">{books.length} total books</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />}
          onClick={() => { setEditBook(null); setModalOpen(true); }}
          sx={{ borderRadius: 2, fontWeight: 700 }}>
          Add Book
        </Button>
      </Box>

      <TextField placeholder="Search books..." value={search}
        onChange={(e) => setSearch(e.target.value)} size="small"
        sx={{ mb: 2, maxWidth: 320 }}
        InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18 }} /></InputAdornment> }} />

      {loading ? (
        <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>
      ) : (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Cover</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Author</TableCell>
                <TableCell>Categories</TableCell>
                <TableCell>Copies</TableCell>
                <TableCell>Content</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4, color: "text.secondary" }}>
                    No books found
                  </TableCell>
                </TableRow>
              ) : filtered.map((book, idx) => (
                <TableRow key={book.id} hover>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>
                    <Avatar
                      src={book.imageUrl}
                      variant="rounded"
                      sx={{ width: 36, height: 48, bgcolor: `hsl(${book.id * 53 % 360}, 50%, 35%)` }}
                    >
                      <MenuBookIcon sx={{ fontSize: 18 }} />
                    </Avatar>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, maxWidth: 160 }}>
                    <Typography variant="body2" fontWeight={600} noWrap>{book.title}</Typography>
                  </TableCell>
                  <TableCell>{book.authorName}</TableCell>
                  <TableCell>
                    <Stack direction="row" flexWrap="wrap" gap={0.5}>
                      {(book.categories ?? []).map(cat => (
                        <Chip key={cat} label={cat} size="small"
                          sx={{ fontSize: "0.62rem", height: 18, fontWeight: 600, bgcolor: "rgba(249,115,22,0.1)", color: "#f97316" }} />
                      ))}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip label={book.availableCopies ?? 0} size="small"
                      sx={{ fontWeight: 700, bgcolor: (book.availableCopies ?? 0) > 0 ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
                        color: (book.availableCopies ?? 0) > 0 ? "#22c55e" : "#ef4444" }} />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={book.content ? "✓ Added" : "Empty"}
                      size="small"
                      sx={{ fontSize: "0.65rem", fontWeight: 700,
                        bgcolor: book.content ? "rgba(34,197,94,0.1)" : "rgba(249,115,22,0.1)",
                        color: book.content ? "#22c55e" : "#f97316" }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Edit Book">
                      <IconButton size="small" color="primary"
                        onClick={() => { setEditBook(book); setModalOpen(true); }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Content">
                      <IconButton size="small" sx={{ color: "#f97316" }}
                        onClick={() => navigate(`/admin/books/${book.id}/content`)}>
                        <ArticleIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" color="error" onClick={() => setDeleteId(book.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <BookModal open={modalOpen} onClose={() => { setModalOpen(false); setEditBook(null); }}
        book={editBook} authors={authors} categories={categories} onSaved={load} />
      <ConfirmDialog open={deleteId !== null} title="Delete Book"
        message="Are you sure you want to delete this book?"
        onClose={() => setDeleteId(null)} onConfirm={handleDelete} />
    </Paper>
  );
}
