import { useEffect, useState } from "react";
import {
  Box, Typography, Button, Grid, Card, CardContent, CardMedia, CardActions,
  Stack, CircularProgress, TextField, InputAdornment, Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import { useNavigate } from "react-router-dom";
import { getBooks } from "../../services/bookService";
import { getCategories } from "../../services/categoryService";
import { useThemeMode } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import type { Book } from "../../types/book";

export default function Home() {
  const { mode } = useThemeMode();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isDark = mode === "dark";
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [bRes, cRes] = await Promise.allSettled([getBooks(), getCategories()]);
        if (bRes.status === "fulfilled") setBooks(bRes.value.data ?? []);
        if (cRes.status === "fulfilled") setCategories(cRes.value.data ?? []);
      } finally { setLoading(false); }
    };
    load();
  }, []);

  const handleSearch = () => {
    navigate(search.trim() ? `/user/browse?search=${encodeURIComponent(search.trim())}` : "/user/browse");
  };

  const catEmojis: Record<string, string> = {
    "Computer Science": "💻", Engineering: "⚙️", Science: "🔬",
    Management: "📊", Mathematics: "🔢", Literature: "📝",
    History: "🏛️", Physics: "⚛️", Biology: "🧬", CSE: "💻",
  };

  const bookColors = ["#8B4513","#2F4F4F","#800000","#1a237e","#1b5e20","#4a148c","#bf360c","#006064"];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 5, pb: 6 }}>

      {/* Hero - Library Vibe */}
      <Box sx={{
        borderRadius: 4, overflow: "hidden", position: "relative",
        background: "linear-gradient(135deg, #3e2723 0%, #5d4037 40%, #4e342e 100%)",
        p: { xs: 4, md: 7 }, minHeight: 280,
        display: "flex", flexDirection: "column", justifyContent: "center",
        "&::before": {
          content: '""', position: "absolute", inset: 0,
          backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(255,255,255,0.012) 60px, rgba(255,255,255,0.012) 61px)`,
        },
      }}>
        {/* Decorative book spines */}
        <Box sx={{
          position: "absolute", right: { xs: -40, md: 80 }, top: "50%",
          transform: "translateY(-50%)", display: { xs: "none", md: "flex" },
          gap: 1.5, alignItems: "flex-end",
        }}>
          {bookColors.map((color, i) => (
            <Box key={i} sx={{
              width: 26 + (i % 3) * 8, height: 110 + (i % 4) * 22,
              bgcolor: color, borderRadius: "3px 3px 0 0", opacity: 0.65,
              boxShadow: "3px 3px 10px rgba(0,0,0,0.5)",
              transform: `rotate(${(i % 3 - 1) * 2.5}deg)`,
            }} />
          ))}
        </Box>

        <Box sx={{ position: "relative", zIndex: 1, maxWidth: 580 }}>
          <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
            <LocalLibraryIcon sx={{ color: "#fbbf24", fontSize: 28 }} />
            <Typography variant="overline" sx={{ color: "#fbbf24", fontWeight: 700, letterSpacing: 3 }}>
              YOUR DIGITAL LIBRARY
            </Typography>
          </Stack>
          <Typography variant="h3" fontWeight={900} sx={{ color: "#fff", mb: 1.5, lineHeight: 1.15 }}>
            Welcome,{" "}
            <Box component="span" sx={{ color: "#fbbf24" }}>{user?.name?.split(" ")[0]}! 👋</Box>
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.65)", mb: 3.5, fontSize: "1rem" }}>
            Search, explore and read your favourite books
          </Typography>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <TextField
              placeholder="Search by title, author..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              size="small"
              sx={{
                flex: 1, maxWidth: 400,
                "& .MuiOutlinedInput-root": {
                  bgcolor: "rgba(255,255,255,0.08)", borderRadius: 2, height: 46,
                  "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                  "&:hover fieldset": { borderColor: "rgba(255,255,255,0.5)" },
                  "&.Mui-focused fieldset": { borderColor: "#fbbf24" },
                  input: { color: "#fff", "&::placeholder": { color: "rgba(255,255,255,0.45)" } },
                },
              }}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: "rgba(255,255,255,0.45)" }} /></InputAdornment> }}
            />
            <Button variant="contained" onClick={handleSearch}
              sx={{ borderRadius: 2, fontWeight: 800, px: 4, height: 46, bgcolor: "#f97316", "&:hover": { bgcolor: "#ea6f0e" } }}>
              Search
            </Button>
          </Stack>

          <Stack direction="row" spacing={3} mt={3}>
            <Box>
              <Typography variant="h5" fontWeight={800} sx={{ color: "#fbbf24" }}>{books.length}</Typography>
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.55)" }}>Books</Typography>
            </Box>
            <Divider orientation="vertical" flexItem sx={{ borderColor: "rgba(255,255,255,0.15)" }} />
            <Box>
              <Typography variant="h5" fontWeight={800} sx={{ color: "#fbbf24" }}>{categories.length}</Typography>
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.55)" }}>Categories</Typography>
            </Box>
            <Divider orientation="vertical" flexItem sx={{ borderColor: "rgba(255,255,255,0.15)" }} />
            <Box>
              <Typography variant="h5" fontWeight={800} sx={{ color: "#fbbf24" }}>24/7</Typography>
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.55)" }}>Access</Typography>
            </Box>
          </Stack>
        </Box>
      </Box>

      {/* Categories */}
      {categories.length > 0 && (
        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2.5}>
            <Box>
              <Typography variant="h5" fontWeight={800} color="text.primary">Browse by Category</Typography>
              <Typography variant="body2" color="text.secondary">Find books by area of interest</Typography>
            </Box>
            <Button endIcon={<ArrowForwardIcon />} onClick={() => navigate("/user/browse")}
              sx={{ fontWeight: 700, color: "#f97316" }}>View All</Button>
          </Stack>
          <Grid container spacing={2}>
            {categories.slice(0, 6).map((cat: any) => (
              <Grid item xs={6} sm={4} md={2} key={cat.id}>
                <Card onClick={() => navigate(`/user/browse?category=${cat.name}`)}
                  sx={{
                    borderRadius: 3, cursor: "pointer", textAlign: "center",
                    border: isDark ? "1px solid rgba(249,115,22,0.12)" : "1px solid #d7ccc8",
                    bgcolor: isDark ? "#1a1208" : "#fdf6f0",
                    transition: "all 0.2s ease",
                    "&:hover": { transform: "translateY(-4px)", border: "1px solid #f97316", boxShadow: "0 8px 24px rgba(249,115,22,0.2)" },
                  }}>
                  <CardContent sx={{ py: 3, px: 1.5 }}>
                    <Typography fontSize={34} mb={1}>{catEmojis[cat.name] ?? "📚"}</Typography>
                    <Typography variant="caption" fontWeight={700} color="text.primary" display="block">{cat.name}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* New Arrivals */}
      <Box>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2.5}>
          <Box>
            <Typography variant="h5" fontWeight={800} color="text.primary">New Arrivals</Typography>
            <Typography variant="body2" color="text.secondary">Latest books added to the library</Typography>
          </Box>
          <Button endIcon={<ArrowForwardIcon />} onClick={() => navigate("/user/browse")}
            sx={{ fontWeight: 700, color: "#f97316" }}>View All</Button>
        </Stack>

        {loading ? (
          <Box display="flex" justifyContent="center" py={6}><CircularProgress sx={{ color: "#f97316" }} /></Box>
        ) : books.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8, borderRadius: 3,
            border: isDark ? "1px dashed rgba(249,115,22,0.2)" : "1px dashed #bcaaa4",
            bgcolor: isDark ? "rgba(249,115,22,0.03)" : "#fdf6f0" }}>
            <AutoStoriesIcon sx={{ fontSize: 52, color: "rgba(249,115,22,0.3)", mb: 1 }} />
            <Typography variant="h6" color="text.primary" fontWeight={700}>No books yet</Typography>
            <Typography variant="body2" color="text.secondary">Admin will add books soon</Typography>
          </Box>
        ) : (
          <Grid container spacing={2.5}>
            {books.slice(0, 8).map((book) => {
              const spineColor = bookColors[book.id % bookColors.length];
              return (
                <Grid item xs={6} sm={4} md={3} key={book.id}>
                  <Card sx={{
                    borderRadius: 3, height: "100%", display: "flex", flexDirection: "column",
                    border: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid #e8d5c4",
                    transition: "all 0.25s ease",
                    "&:hover": { transform: "translateY(-5px)", boxShadow: `0 20px 40px ${spineColor}35` },
                  }}>
                    {book.imageUrl ? (
                      <CardMedia component="img" height="150" image={book.imageUrl} alt={book.title}
                        sx={{ objectFit: "cover", borderRadius: "12px 12px 0 0" }} />
                    ) : (
                      <Box sx={{
                        height: 150, background: `linear-gradient(160deg, ${spineColor}dd, ${spineColor}88)`,
                        borderRadius: "12px 12px 0 0", display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center", position: "relative",
                        "&::before": { content: '""', position: "absolute", left: 0, top: 0, bottom: 0, width: 7, bgcolor: "rgba(0,0,0,0.25)", borderRadius: "12px 0 0 0" },
                      }}>
                        <MenuBookIcon sx={{ fontSize: 40, color: "rgba(255,255,255,0.6)", mb: 1 }} />
                        <Typography variant="caption" sx={{
                          color: "rgba(255,255,255,0.85)", fontWeight: 700, px: 1.5, textAlign: "center",
                          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                        }}>{book.title}</Typography>
                      </Box>
                    )}

                    <CardContent sx={{ flex: 1, p: 2, bgcolor: isDark ? "#1a1208" : "#fdf6f0" }}>
                      <Typography variant="subtitle2" fontWeight={700} color="text.primary"
                        sx={{ mb: 0.5, display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {book.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        by {book.authorName ?? "Unknown"}
                      </Typography>
                      {book.ownerName && (
                        <Typography variant="caption" display="block"
                          sx={{ color: isDark ? "#f97316" : "#1976d2", fontWeight: 600, fontSize: "0.65rem" }}>
                          {book.ownerName}
                        </Typography>
                      )}
                    </CardContent>

                    <CardActions sx={{ px: 2, pb: 2, bgcolor: isDark ? "#1a1208" : "#fdf6f0" }}>
                      <Button fullWidth variant="contained" size="small" startIcon={<AutoStoriesIcon fontSize="small" />}
                        onClick={() => navigate(`/user/read/${book.id}`)}
                        sx={{ borderRadius: 2, fontWeight: 700, bgcolor: "#f97316", "&:hover": { bgcolor: "#ea6f0e" } }}>
                        {book.content ? "Read Now" : "Preview"}
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>
    </Box>
  );
}
