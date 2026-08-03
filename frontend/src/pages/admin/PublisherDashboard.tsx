import { useEffect, useState } from "react";
import { Card, CardContent, Typography, Grid, Box, Stack, useTheme, Chip } from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CategoryIcon from "@mui/icons-material/Category";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import PaidIcon from "@mui/icons-material/Paid";
import { getMyBooks } from "../../services/bookService";
import { getBorrows } from "../../services/borrowService";
import type { Book } from "../../types/book";
import type { Borrow } from "../../types/borrow";
import { useAuth } from "../../context/AuthContext";

export default function PublisherDashboard() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { user } = useAuth();

  const [books, setBooks] = useState<Book[]>([]);
  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [bRes, rRes] = await Promise.all([getMyBooks(), getBorrows()]);
        setBooks(bRes.data ?? []);
        setBorrows(rRes.data ?? []); // backend already scopes this to records on MY books
      } catch { /* handled by empty states below */ }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const categoriesUsed = new Set(books.flatMap((b) => b.categories ?? [])).size;
  const activeBorrows = borrows.filter((b) => !b.returned).length;
  const totalEarned = borrows
    .filter((b) => b.returned)
    .reduce((sum, b) => sum + (b.pricePaid ?? 0), 0);

  const cards = [
    { label: "My Books", value: books.length, icon: <MenuBookIcon />, color: "#3b82f6" },
    { label: "Categories Used", value: categoriesUsed, icon: <CategoryIcon />, color: "#8b5cf6" },
    { label: "Currently Borrowed", value: activeBorrows, icon: <SwapHorizIcon />, color: "#f97316" },
    { label: "Total Earned", value: `₹${totalEarned.toFixed(2)}`, icon: <PaidIcon />, color: "#22c55e" },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box>
        <Typography variant="h4" fontWeight={800} color="text.primary">
          Publisher Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          Welcome back, {user?.name} — here's how your books are doing.
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {cards.map((c) => (
          <Grid item xs={12} sm={6} md={3} key={c.label}>
            <Card sx={{ borderRadius: 3, border: isDark ? "1px solid rgba(249,115,22,0.15)" : "1px solid #e2e8f0" }}>
              <CardContent sx={{ p: 2.5 }}>
                <Stack direction="row" alignItems="center" spacing={1.5} mb={1}>
                  <Box sx={{
                    width: 40, height: 40, borderRadius: 2, display: "flex",
                    alignItems: "center", justifyContent: "center",
                    bgcolor: `${c.color}22`, color: c.color,
                  }}>
                    {c.icon}
                  </Box>
                </Stack>
                <Typography variant="h5" fontWeight={800} color="text.primary">
                  {loading ? "—" : c.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">{c.label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card sx={{ borderRadius: 3, border: isDark ? "1px solid rgba(249,115,22,0.15)" : "1px solid #e2e8f0" }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="subtitle1" fontWeight={700} mb={2}>My Books</Typography>
          {books.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              You haven't published any books yet — head to "Books" to add your first one.
            </Typography>
          ) : (
            <Stack spacing={1.5}>
              {books.map((b) => (
                <Box key={b.id} sx={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  p: 1.5, borderRadius: 2, bgcolor: isDark ? "rgba(255,255,255,0.03)" : "#f8fafc",
                }}>
                  <Box>
                    <Typography variant="body2" fontWeight={700}>{b.title}</Typography>
                    <Typography variant="caption" color="text.secondary">by {b.authorName}</Typography>
                  </Box>
                  <Stack direction="row" spacing={1}>
                    <Chip size="small" label={`${b.availableCopies} available`} />
                    <Chip size="small" label={(b.price ?? 0) > 0 ? `₹${b.price}` : "Free"}
                      sx={{ bgcolor: (b.price ?? 0) > 0 ? "rgba(249,115,22,0.1)" : "rgba(34,197,94,0.1)",
                            color: (b.price ?? 0) > 0 ? "#f97316" : "#22c55e", fontWeight: 700 }} />
                  </Stack>
                </Box>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
