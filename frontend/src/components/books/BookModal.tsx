import { useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  TextField, Stack, FormControl, InputLabel, Select, MenuItem,
  OutlinedInput, Chip, Box, Typography, InputAdornment, Divider,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import LinkIcon from "@mui/icons-material/Link";
import { toast } from "react-hot-toast";
import { addBook, updateBook } from "../../services/bookService";
import type { Book, BookRequest } from "../../types/book";
import type { Author } from "../../types/author";
import type { Category } from "../../types/category";

interface Props {
  open: boolean;
  onClose: () => void;
  book: Book | null;
  authors: Author[];
  categories: Category[];
  onSaved: () => void;
}

export default function BookModal({ open, onClose, book, authors, categories, onSaved }: Props) {
  const [title, setTitle] = useState("");
  const [authorId, setAuthorId] = useState<number>(0);
  const [categoryIds, setCategoryIds] = useState<number[]>([]);
  const [availableCopies, setAvailableCopies] = useState(1);
  const [imageUrl, setImageUrl] = useState("");
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      if (book) {
        setTitle(book.title);
        const author = authors.find(a => a.name === book.authorName);
        setAuthorId(author?.id ?? 0);
        const ids = categories.filter(c => (book.categories ?? []).includes(c.name)).map(c => c.id);
        setCategoryIds(ids);
        setAvailableCopies(book.availableCopies ?? 1);
        setImageUrl(book.imageUrl ?? "");
        setPrice(book.price ?? 0);
      } else {
        setTitle(""); setAuthorId(0); setCategoryIds([]); setAvailableCopies(1); setImageUrl(""); setPrice(0);
      }
    }
  }, [open, book, authors, categories]);

  const handleSave = async () => {
    if (!title.trim()) { toast.error("Title is required"); return; }
    if (!authorId) { toast.error("Please select an author"); return; }
    if (categoryIds.length === 0) { toast.error("Please select at least one category"); return; }

    const payload: BookRequest = { title, authorId, categoryIds, availableCopies, imageUrl, price };
    setLoading(true);
    try {
      if (book) {
        await updateBook(book.id, payload);
        toast.success("Book updated!");
      } else {
        await addBook(payload);
        toast.success("Book added!");
      }
      onSaved();
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to save book");
    } finally { setLoading(false); }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle fontWeight={700}>{book ? "Edit Book" : "Add Book"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} mt={1}>
          <TextField label="Book Title" fullWidth value={title} onChange={(e) => setTitle(e.target.value)} />

          <FormControl fullWidth>
            <InputLabel>Author</InputLabel>
            <Select value={authorId || ""} label="Author" onChange={(e) => setAuthorId(Number(e.target.value))}>
              {authors.map((a) => <MenuItem key={a.id} value={a.id}>{a.name}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Categories</InputLabel>
            <Select multiple value={categoryIds}
              onChange={(e) => setCategoryIds(e.target.value as number[])}
              input={<OutlinedInput label="Categories" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {(selected as number[]).map((id) => {
                    const cat = categories.find(c => c.id === id);
                    return <Chip key={id} label={cat?.name ?? id} size="small" />;
                  })}
                </Box>
              )}>
              {categories.map((c) => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
            </Select>
          </FormControl>

          <TextField label="Available Copies" type="number" fullWidth
            value={availableCopies}
            onChange={(e) => setAvailableCopies(Math.max(1, parseInt(e.target.value) || 1))}
            inputProps={{ min: 1 }} />

          <TextField label="Price (₹) — 0 = Free" type="number" fullWidth
            value={price}
            onChange={(e) => setPrice(Math.max(0, parseFloat(e.target.value) || 0))}
            helperText="Leave 0 for a free book. Paid books show a UPI QR code to the reader."
            inputProps={{ min: 0, step: "0.01" }} />

          <Divider>
            <Typography variant="caption" color="text.secondary">Book Cover Image</Typography>
          </Divider>

          <TextField
            label="Image URL (from web)"
            fullWidth
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/book-cover.jpg"
            helperText="Paste image URL from Google Images or any website"
            InputProps={{
              startAdornment: <InputAdornment position="start"><LinkIcon sx={{ fontSize: 18 }} /></InputAdornment>,
            }}
          />

          {imageUrl && (
            <Box sx={{ textAlign: "center" }}>
              <img
                key={imageUrl}
                src={imageUrl}
                alt="Preview"
                onError={(e) => {
                  (e.target as any).src = "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300";
                }}
                style={{ maxHeight: 150, maxWidth: "100%", borderRadius: 8, objectFit: "cover" }}
              />
              <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>Preview</Typography>
            </Box>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ borderRadius: 2 }}>Cancel</Button>
        <Button variant="contained" onClick={handleSave} disabled={loading} sx={{ borderRadius: 2, fontWeight: 700 }}>
          {loading ? "Saving..." : book ? "Update Book" : "Save Book"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
