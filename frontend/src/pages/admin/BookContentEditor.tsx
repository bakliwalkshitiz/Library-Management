import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box, Typography, Button, Paper, Stack, TextField,
  CircularProgress, Divider, Chip, Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import { getBookById, updateBookContent } from "../../services/bookService";
import type { Book } from "../../types/book";
import toast from "react-hot-toast";

export default function BookContentEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getBookById(Number(id));
        setBook(res.data);
        setContent(res.data.content ?? "");
      } catch { toast.error("Failed to load book"); }
      finally { setLoading(false); }
    };
    load();
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateBookContent(Number(id), content);
      toast.success("Content saved!");
    } catch { toast.error("Failed to save content"); }
    finally { setSaving(false); }
  };

  if (loading) return <Box display="flex" justifyContent="center" py={8}><CircularProgress /></Box>;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/admin/books")} sx={{ borderRadius: 2 }}>
          Back to Books
        </Button>
        <Box flex={1}>
          <Typography variant="h5" fontWeight={700}>{book?.title}</Typography>
          <Typography variant="body2" color="text.secondary">Edit Book Content</Typography>
        </Box>
        <Chip label={`${wordCount} words`} size="small"
          sx={{ bgcolor: "rgba(249,115,22,0.1)", color: "#f97316", fontWeight: 700 }} />
        <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave} disabled={saving}
          sx={{ borderRadius: 2, fontWeight: 700 }}>
          {saving ? "Saving..." : "Save Content"}
        </Button>
      </Stack>

      <Alert severity="info" sx={{ borderRadius: 2 }}>
        Paste the book content here. Users will be able to read it page by page (~300 words per page).
        You can paste from any source — Google Books, Project Gutenberg, etc.
      </Alert>

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <TextField
          multiline fullWidth
          minRows={25}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Paste book content here...

Chapter 1
The story begins..."
          sx={{
            "& .MuiOutlinedInput-root": { fontFamily: "'Georgia', serif", fontSize: 15, lineHeight: 1.8 },
          }}
        />
      </Paper>

      <Stack direction="row" justifyContent="flex-end">
        <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave} disabled={saving}
          sx={{ borderRadius: 2, fontWeight: 700, px: 4 }}>
          {saving ? "Saving..." : "Save Content"}
        </Button>
      </Stack>
    </Box>
  );
}
