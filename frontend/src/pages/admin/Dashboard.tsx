import { useEffect, useState } from "react";
import { Card, CardContent, Typography, Grid, Box, Stack, useTheme } from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import GroupIcon from "@mui/icons-material/Group";
import PersonIcon from "@mui/icons-material/Person";
import CategoryIcon from "@mui/icons-material/Category";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { getDashboard } from "../../services/dashboardService";
import { getBooks } from "../../services/bookService";
import { getCategories } from "../../services/categoryService";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as RTooltip,
  PieChart, Pie, Cell, ResponsiveContainer, Legend,
} from "recharts";
import type { Book } from "../../types/book";

export default function Dashboard() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [stats, setStats] = useState({ books: 0, users: 0, authors: 0, borrowed: 0 });
  const [categoryData, setCategoryData] = useState<{ name: string; count: number }[]>([]);
  const [bookStatusData, setBookStatusData] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        // Use dedicated /dashboard endpoint
        const dashRes = await getDashboard();
        const d = dashRes.data;
        setStats({
          books: d.books ?? 0,
          users: d.users ?? 0,
          authors: d.authors ?? 0,
          borrowed: d.borrowed ?? 0,
        });

        // Get books for category chart
        const booksRes = await getBooks();
        const books: Book[] = booksRes.data ?? [];

        // category chart from book.categories[]
        const catMap: Record<string, number> = {};
        books.forEach((b) => {
          (b.categories ?? []).forEach((cat) => {
            catMap[cat] = (catMap[cat] ?? 0) + 1;
          });
        });
        setCategoryData(
          Object.entries(catMap)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 6)
        );

        // Book status pie: borrowed vs available
        const borrowed = d.borrowed ?? 0;
        const total = d.books ?? 0;
        const available = Math.max(0, total - borrowed);
        setBookStatusData([
          { name: "Available", value: available },
          { name: "Borrowed", value: borrowed },
        ]);
      } catch {}
    };
    load();
  }, []);

  const statCards = [
    { label: "Total Books", value: stats.books, icon: <MenuBookIcon sx={{ fontSize: 34 }} />, gradient: "linear-gradient(135deg, #3b82f6, #1d4ed8)", shadow: "0 8px 24px rgba(59,130,246,0.4)" },
    { label: "Total Users", value: stats.users, icon: <GroupIcon sx={{ fontSize: 34 }} />, gradient: "linear-gradient(135deg, #8b5cf6, #6d28d9)", shadow: "0 8px 24px rgba(139,92,246,0.4)" },
    { label: "Authors", value: stats.authors, icon: <PersonIcon sx={{ fontSize: 34 }} />, gradient: "linear-gradient(135deg, #10b981, #065f46)", shadow: "0 8px 24px rgba(16,185,129,0.4)" },
    { label: "Borrowed", value: stats.borrowed, icon: <SwapHorizIcon sx={{ fontSize: 34 }} />, gradient: "linear-gradient(135deg, #f97316, #c2410c)", shadow: "0 8px 24px rgba(249,115,22,0.4)" },
  ];

  const PIE_COLORS = ["#22c55e", "#f97316"];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <Box>
        <Typography variant="h4" fontWeight={800} color="text.primary">Dashboard</Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>Welcome back! Here's your library overview.</Typography>
        <Box mt={1}>
          <Box component="span" sx={{
            display: "inline-flex", alignItems: "center", gap: 0.5,
            bgcolor: "rgba(34,197,94,0.12)", color: "#22c55e",
            px: 1.5, py: 0.4, borderRadius: 2, fontSize: "0.75rem", fontWeight: 700,
          }}>
            <TrendingUpIcon sx={{ fontSize: 14 }} /> Live Data
          </Box>
        </Box>
      </Box>

      {/* Stat Cards */}
      <Grid container spacing={3}>
        {statCards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.label}>
            <Card sx={{
              borderRadius: 4, background: card.gradient, boxShadow: card.shadow,
              transition: "transform 0.2s ease",
              "&:hover": { transform: "translateY(-6px)" },
            }}>
              <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
                <Box sx={{ color: "rgba(255,255,255,0.9)", mb: 1.5 }}>{card.icon}</Box>
                <Typography variant="h3" fontWeight={900} sx={{ color: "#fff", lineHeight: 1 }}>
                  {card.value}
                </Typography>
                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)", mt: 0.5, fontWeight: 600 }}>
                  {card.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{
            borderRadius: 4, border: isDark ? "1px solid rgba(249,115,22,0.1)" : "1px solid #e2e8f0",
            height: 400,
          }}>
            <CardContent sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column" }}>
              <Typography variant="h6" fontWeight={700} mb={2}>📊 Books per Category</Typography>
              <Box flex={1} minHeight={0}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: isDark ? "#9ca3af" : "#64748b" }} angle={-20} textAnchor="end" />
                    <YAxis tick={{ fontSize: 12, fill: isDark ? "#9ca3af" : "#64748b" }} allowDecimals={false} />
                    <RTooltip contentStyle={{ background: isDark ? "#1a1f2e" : "#fff", border: "1px solid rgba(249,115,22,0.2)", borderRadius: 8 }} />
                    <Bar dataKey="count" fill="#f97316" radius={[6, 6, 0, 0]} name="Books" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{
            borderRadius: 4, border: isDark ? "1px solid rgba(249,115,22,0.1)" : "1px solid #e2e8f0",
            height: 400,
          }}>
            <CardContent sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column" }}>
              <Typography variant="h6" fontWeight={700} mb={2}>📈 Book Status</Typography>
              <Box flex={1} minHeight={0}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={bookStatusData} cx="50%" cy="45%" innerRadius={70} outerRadius={110} dataKey="value"
                      label={({ name, percent }: any) => (percent ?? 0) > 0 ? `${name} ${((percent ?? 0) * 100).toFixed(0)}%` : ""}>
                      {bookStatusData.map((_, idx) => (
                        <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend formatter={(v) => <span style={{ color: isDark ? "#9ca3af" : "#64748b", fontSize: 13 }}>{v}</span>} />
                    <RTooltip contentStyle={{ background: isDark ? "#1a1f2e" : "#fff", border: "1px solid rgba(249,115,22,0.2)", borderRadius: 8 }} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
