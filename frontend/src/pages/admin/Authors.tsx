import { useEffect, useState } from "react";
import {
  Box, Button, Paper, Typography, Table, TableHead, TableBody,
  TableRow, TableCell, TableContainer, IconButton, Tooltip,
  TextField, InputAdornment, CircularProgress,
  DialogActions,
  Stack,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import { toast } from "react-hot-toast";
import type { Author } from "../../types/author";
import { getAuthors, addAuthor, updateAuthor, deleteAuthor } from "../../services/authorService";
import { useAuth } from "../../context/AuthContext";
import { getMyBooks } from "../../services/bookService";
import { ConfirmDialog } from "../../components";

function AuthorFormDialog({
  open, onClose, author, onSaved,
}: {
  open: boolean;
  onClose: () => void;
  author: Author | null;
  onSaved: () => void;
}) {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (open) {
      setName(author?.name ?? "");
      setEmail(author?.email ?? "");
    }
  }, [open, author]);

  const handleSave = async () => {
    if (!name.trim()) { toast.error("Name is required"); return; }
    const cleanEmail = email.trim() ? email.trim() : null;
    try {
      if (author) {
        await updateAuthor(author.id, { name: name.trim(), email: cleanEmail });
        if (user?.id) {
          const localSaved: string[] = JSON.parse(localStorage.getItem(`publisher_authors_${user.id}`) || "[]");
          const idx = localSaved.indexOf(author.name);
          if (idx !== -1) {
            localSaved[idx] = name.trim();
          } else {
            localSaved.push(name.trim());
          }
          localStorage.setItem(`publisher_authors_${user.id}`, JSON.stringify(localSaved));

          const localIds: number[] = JSON.parse(localStorage.getItem(`publisher_author_ids_${user.id}`) || "[]");
          if (!localIds.includes(author.id)) {
            localIds.push(author.id);
            localStorage.setItem(`publisher_author_ids_${user.id}`, JSON.stringify(localIds));
          }
        }
        toast.success("Author updated!");
      } else {
        await addAuthor({ name: name.trim(), email: cleanEmail });
        if (user?.id) {
          const localSaved: string[] = JSON.parse(localStorage.getItem(`publisher_authors_${user.id}`) || "[]");
          if (!localSaved.includes(name.trim())) {
            localSaved.push(name.trim());
            localStorage.setItem(`publisher_authors_${user.id}`, JSON.stringify(localSaved));
          }
          try {
            const res = await getAuthors();
            const created = (res.data ?? []).find((a: Author) => a.name === name.trim());
            if (created) {
              const localIds: number[] = JSON.parse(localStorage.getItem(`publisher_author_ids_${user.id}`) || "[]");
              if (!localIds.includes(created.id)) {
                localIds.push(created.id);
                localStorage.setItem(`publisher_author_ids_${user.id}`, JSON.stringify(localIds));
              }
            }
          } catch {}
        }
        toast.success("Author added!");
      }
      onSaved();
      onClose();
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || err?.response?.data?.error || (typeof err?.response?.data === 'string' ? err.response.data : "Failed to save author");
      toast.error(errorMsg);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle fontWeight={700}>{author ? "Edit Author" : "Add Author"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Name" fullWidth value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Email" fullWidth value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ borderRadius: 2 }}>Cancel</Button>
        <Button variant="contained" onClick={handleSave} sx={{ borderRadius: 2, fontWeight: 700 }}>
          {author ? "Update" : "Add"} Author
        </Button>
      </DialogActions>
    </Dialog>
  );
}
export default function Authors() {
  const { isPublisher, user } = useAuth();
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editAuthor, setEditAuthor] = useState<Author | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      if (isPublisher) {
        const [aRes, bRes] = await Promise.all([getAuthors(), getMyBooks()]);
        const allAuthors: Author[] = aRes.data ?? [];
        const myBooks = bRes.data ?? [];
        const myAuthorNames = new Set(myBooks.map((b: any) => b.authorName).filter(Boolean));
        let localSavedNames: string[] = [];
        let localSavedIds: number[] = [];
        if (user?.id) {
          localSavedNames = JSON.parse(localStorage.getItem(`publisher_authors_${user.id}`) || "[]");
          localSavedIds = JSON.parse(localStorage.getItem(`publisher_author_ids_${user.id}`) || "[]");
        }
        const localSavedSet = new Set(localSavedNames);
        const localSavedIdsSet = new Set(localSavedIds);

        const filteredAuthors = allAuthors.filter(
          (a) => myAuthorNames.has(a.name) || localSavedSet.has(a.name) || localSavedIdsSet.has(a.id)
        );
        setAuthors(filteredAuthors);
      } else {
        const res = await getAuthors();
        setAuthors(res.data ?? []);
      }
    } catch {
      toast.error("Failed to load authors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteAuthor(deleteId);
      toast.success("Author deleted");
      load();
    } catch {
      toast.error("Failed to delete author");
    }
  };

  const filtered = authors.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    (a.email ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h5" fontWeight={700}>Authors</Typography>
          <Typography variant="body2" color="text.secondary">{authors.length} total authors</Typography>
        </Box>
        <Button
          variant="contained" startIcon={<AddIcon />}
          onClick={() => { setEditAuthor(null); setModalOpen(true); }}
          sx={{ borderRadius: 2, fontWeight: 700 }}
        >
          Add Author
        </Button>
      </Box>

      <TextField
        placeholder="Search authors..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        size="small"
        sx={{ mb: 2, maxWidth: 320 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ fontSize: 18 }} />
            </InputAdornment>
          ),
        }}
      />

      {loading ? (
        <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>
      ) : (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4, color: "text.secondary" }}>
                    No authors found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((author, idx) => (
                  <TableRow key={author.id} hover>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{author.name}</TableCell>
                    <TableCell>{author.email}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit">
                        <IconButton size="small" color="primary"
                          onClick={() => { setEditAuthor(author); setModalOpen(true); }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" color="error"
                          onClick={() => setDeleteId(author.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <AuthorFormDialog
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditAuthor(null); }}
        author={editAuthor}
        onSaved={load}
      />

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete Author"
        message="Are you sure you want to delete this author?"
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </Paper>
  );
}
