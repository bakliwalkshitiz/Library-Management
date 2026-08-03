import { useEffect, useState } from "react";
import {
  Box, Typography, Grid, Card, CardContent, CardMedia, Stack, Chip,
  TextField, InputAdornment, CircularProgress, FormControl,
  InputLabel, Select, MenuItem, Button, CardActions,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useLocation, useNavigate } from "react-router-dom";
import { getBooks, getBooksByCategory, searchBooks } from "../../services/bookService";
import { getCategories } from "../../services/categoryService";
import { useThemeMode } from "../../context/ThemeContext";
import type { Book } from "../../types/book";

export default function Browse() {
  const { mode } = useThemeMode();
  const isDark = mode === "dark";
  const location = useLocation();
  const navigate = useNavigate();

  const [displayBooks, setDisplayBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const s = params.get("search");
    const c = params.get("category");
    if (s) setSearch(s);
    if (c) setSelectedCategory(c);
  }, []);

  useEffect(() => {
    getCategories().then(res => setCategories(res.data ?? [])).catch(() => {});
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        let books: Book[] = [];
        if (search.trim()) {
          const res = await searchBooks(search.trim());
          books = res.data ?? [];
        } else if (selectedCategory !== "All") {
          const res = await getBooksByCategory(selectedCategory);
          books = res.data ?? [];
        } else {
          const res = await getBooks();
          books = res.data ?? [];
        }
        setDisplayBooks(books);
      } catch { setDisplayBooks([]); }
      finally { setLoading(false); }
    };
    load();
  }, [search, selectedCategory]);

  const bookColors = ["#8B4513","#2F4F4F","#800000","#1a237e","#1b5e20","#4a148c","#bf360c","#006064"];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box>
        <Typography variant="h4" fontWeight={800} color="text.primary">All Books</Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>Discover and borrow from our collection</Typography>
      </Box>

      {/* Filters */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }} flexWrap="wrap">
        <TextField
          placeholder="Search by title..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); if (e.target.value) setSelectedCategory("All"); }}
          size="small"
          sx={{ flex: 1, maxWidth: 360,
            "& .MuiOutlinedInput-root": { borderRadius: 2,
              ...(isDark && { "& fieldset": { borderColor: "rgba(249,115,22,0.2)" }, "&:hover fieldset": { borderColor: "#f97316" } }) } }}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18 }} /></InputAdornment> }}
        />
        <Stack direction="row" spacing={1} alignItems="center">
          <FilterListIcon sx={{ color: "text.secondary", fontSize: 18 }} />
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Category</InputLabel>
            <Select value={selectedCategory} label="Category"
              onChange={(e) => { setSelectedCategory(e.target.value); if (e.target.value !== "All") setSearch(""); }}
              sx={{ borderRadius: 2 }}>
              <MenuItem value="All">All Categories</MenuItem>
              {categories.map((cat: any) => <MenuItem key={cat.id} value={cat.name}>{cat.name}</MenuItem>)}
            </Select>
          </FormControl>
          {(search || selectedCategory !== "All") && (
            <Button size="small" variant="outlined"
              onClick={() => { setSearch(""); setSelectedCategory("All"); }}
              sx={{ borderRadius: 2, fontWeight: 600 }}>Clear</Button>
          )}
        </Stack>
        <Chip label={`${displayBooks.length} books`} size="small"
          sx={{ fontWeight: 700, bgcolor: isDark ? "rgba(249,115,22,0.12)" : "rgba(25,118,210,0.08)", color: isDark ? "#f97316" : "#1976d2" }} />
      </Stack>

      {/* Books Grid */}
      {loading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress sx={{ color: isDark ? "#f97316" : undefined }} />
        </Box>
      ) : displayBooks.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8, borderRadius: 3,
          border: isDark ? "1px dashed rgba(249,115,22,0.2)" : "1px dashed #cbd5e1" }}>
          <Typography fontSize={48} mb={1}>📭</Typography>
          <Typography variant="h6" fontWeight={700} color="text.primary">No books found</Typography>
          <Typography variant="body2" color="text.secondary">Try adjusting your search or filters</Typography>
        </Box>
      ) : (
        <Grid container spacing={2.5}>
          {displayBooks.map((book) => {
            const spineColor = bookColors[book.id % bookColors.length];
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={book.id}>
                <Card sx={{
                  borderRadius: 3, height: "100%", display: "flex", flexDirection: "column",
                  border: isDark ? "1px solid rgba(249,115,22,0.1)" : "1px solid #e2e8f0",
                  transition: "all 0.25s ease",
                  "&:hover": { transform: "translateY(-4px)",
                    boxShadow: isDark ? "0 16px 40px rgba(249,115,22,0.15)" : "0 16px 40px rgba(0,0,0,0.1)",
                    border: isDark ? "1px solid rgba(249,115,22,0.4)" : "1px solid #1976d2" },
                }}>
                  {/* Book Cover */}
                  {book.imageUrl ? (
                    <CardMedia component="img" height="160" image={book.imageUrl} alt={book.title}
                      sx={{ objectFit: "cover", borderRadius: "12px 12px 0 0" }} />
                  ) : (
                    <Box sx={{
                      height: 160, background: `linear-gradient(160deg, ${spineColor}dd, ${spineColor}88)`,
                      borderRadius: "12px 12px 0 0", display: "flex", flexDirection: "column",
                      alignItems: "center", justifyContent: "center", position: "relative",
                      "&::before": { content: '""', position: "absolute", left: 0, top: 0, bottom: 0,
                        width: 8, bgcolor: "rgba(0,0,0,0.25)", borderRadius: "12px 0 0 0" },
                    }}>
                      <MenuBookIcon sx={{ fontSize: 44, color: "rgba(255,255,255,0.6)", mb: 1 }} />
                      <Typography variant="caption" sx={{
                        color: "rgba(255,255,255,0.85)", fontWeight: 700, px: 2, textAlign: "center",
                        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                      }}>
                        {book.title}
                      </Typography>
                    </Box>
                  )}

                  <CardContent sx={{ flex: 1, p: 2 }}>
                    <Typography variant="subtitle2" fontWeight={700} color="text.primary"
                      sx={{ mb: 0.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {book.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      by {book.authorName ?? "Unknown Author"}
                    </Typography>
                    {book.ownerName && (
                      <Typography variant="caption" display="block" mb={1}
                        sx={{ color: isDark ? "#f97316" : "#1976d2", fontWeight: 600 }}>
                        Published by {book.ownerName}
                      </Typography>
                    )}
                    <Stack direction="row" flexWrap="wrap" gap={0.5} mb={1}>
                      {(book.categories ?? []).slice(0, 2).map(cat => (
                        <Chip key={cat} label={cat} size="small"
                          sx={{ fontSize: "0.62rem", height: 18, fontWeight: 600,
                            bgcolor: isDark ? "rgba(249,115,22,0.1)" : "rgba(25,118,210,0.08)",
                            color: isDark ? "#f97316" : "#1976d2" }} />
                      ))}
                    </Stack>
                    <Chip
                      label={book.availableCopies > 0 ? `${book.availableCopies} Available` : "All Issued"}
                      size="small"
                      sx={{ fontWeight: 700, fontSize: "0.65rem",
                        bgcolor: book.availableCopies > 0 ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
                        color: book.availableCopies > 0 ? "#22c55e" : "#ef4444" }} />
                  </CardContent>

                  <CardActions sx={{ px: 2, pb: 2 }}>
                    <Button fullWidth variant="contained" startIcon={<AutoStoriesIcon />}
                      onClick={() => navigate(`/user/read/${book.id}`)}
                      sx={{
                        borderRadius: 2, fontWeight: 700, fontSize: "0.8rem",
                        background: isDark ? "linear-gradient(135deg, #f97316, #fbbf24)" : undefined,
                        color: isDark ? "#0f1117" : undefined,
                      }}>
                      {(book as any).price > 0 ? `Read — ₹${(book as any).price}` : "Read Now"}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
}
