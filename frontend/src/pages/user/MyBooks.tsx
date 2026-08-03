import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Typography, Card, CardContent, Chip, Stack,
  CircularProgress, Button, Alert, Tabs, Tab,
} from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { getBorrows, deleteBorrow } from "../../services/borrowService";
import type { Borrow } from "../../types/borrow";
import { useThemeMode } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";

export default function MyBooks() {
  const navigate = useNavigate();
  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<"active" | "history">("active");
  const { mode } = useThemeMode();
  const { user } = useAuth();
  const isDark = mode === "dark";

  const loadBorrows = async () => {
    setLoading(true);
    try {
      const res = await getBorrows();
      const allBorrows: Borrow[] = res.data || [];
      // Filter to show only current user's borrows
      const myBorrows = user
        ? allBorrows.filter(b => b.borrowerName === user.name)
        : allBorrows;
      setBorrows(myBorrows);
    } catch {
      toast.error("Failed to load borrowed books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadBorrows(); }, []);

  const handleSelfReturn = async (borrow: Borrow) => {
    try {
      await deleteBorrow(borrow.id);
      toast.success("Book returned. Thanks for reading!");
      loadBorrows();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to return book");
    }
  };

  const isOverdue = (returnDate: string | null) =>
    returnDate ? new Date(returnDate) < new Date() : false;

  const activeBorrows = borrows.filter(b => !b.returned);
  const historyBorrows = borrows.filter(b => b.returned);
  const displayed = tab === "active" ? activeBorrows : historyBorrows;
  const totalSpent = historyBorrows.reduce((sum, b) => sum + (b.pricePaid ?? 0), 0);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ color: "text.primary" }}>
            My Books
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Books you currently have borrowed
          </Typography>
        </Box>
        <Chip
          icon={<MenuBookIcon sx={{ fontSize: 16 }} />}
          label={`${activeBorrows.length} currently reading`}
          sx={{
            bgcolor: isDark ? "rgba(249,115,22,0.15)" : "rgba(25,118,210,0.08)",
            color: isDark ? "#f97316" : "#1976d2",
            fontWeight: 700,
            border: isDark ? "1px solid rgba(249,115,22,0.25)" : "1px solid rgba(25,118,210,0.2)",
          }}
        />
      </Box>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tab value="active" label={`Currently Reading (${activeBorrows.length})`} icon={<AutoStoriesIcon fontSize="small" />} iconPosition="start" />
        <Tab value="history" label={`History & Billing (${historyBorrows.length})`} icon={<ReceiptLongIcon fontSize="small" />} iconPosition="start" />
      </Tabs>

      {tab === "history" && historyBorrows.length > 0 && (
        <Alert severity="info" icon={<ReceiptLongIcon />} sx={{ borderRadius: 2 }}>
          You've spent <strong>₹{totalSpent.toFixed(2)}</strong> across {historyBorrows.length} returned book{historyBorrows.length !== 1 ? "s" : ""}.
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress sx={{ color: isDark ? "#f97316" : undefined }} />
        </Box>
      ) : displayed.length === 0 ? (
        <Box
          sx={{
            textAlign: "center", py: 8, borderRadius: 3,
            border: isDark ? "1px dashed rgba(249,115,22,0.2)" : "1px dashed #cbd5e1",
            bgcolor: isDark ? "rgba(249,115,22,0.04)" : "#f8fafc",
          }}
        >
          <Typography fontSize={52} mb={1}>{tab === "active" ? "📖" : "🧾"}</Typography>
          <Typography variant="h6" fontWeight={700} color="text.primary" mb={1}>
            {tab === "active" ? "No books borrowed yet" : "No history yet"}
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            {tab === "active" ? "Head to Browse to find your next read!" : "Books you've finished and returned will show up here."}
          </Typography>
          {tab === "active" && (
            <Button
              href="/user/browse" variant="contained"
              sx={{
                borderRadius: 2, fontWeight: 700,
                background: isDark ? "linear-gradient(135deg, #f97316, #fbbf24)" : undefined,
                color: isDark ? "#0f1117" : undefined,
              }}
            >
              Browse Books
            </Button>
          )}
        </Box>
      ) : (
        <Stack spacing={2}>
          {displayed.map((borrow) => {
            const overdue = !borrow.returned && isOverdue(borrow.returnDate);
            return (
              <Card
                key={borrow.id}
                sx={{
                  borderRadius: 3,
                  border: overdue
                    ? "1px solid rgba(239,68,68,0.4)"
                    : isDark ? "1px solid rgba(249,115,22,0.12)" : "1px solid #e2e8f0",
                  transition: "transform 0.2s ease",
                  "&:hover": { transform: "translateX(4px)" },
                }}
              >
                <CardContent>
                  <Stack direction="row" alignItems="flex-start" spacing={2}>
                    <Box
                      sx={{
                        width: 52, height: 52, borderRadius: 2,
                        background: isDark
                          ? "linear-gradient(135deg, rgba(249,115,22,0.2), rgba(251,191,36,0.1))"
                          : "linear-gradient(135deg, rgba(25,118,210,0.1), rgba(66,165,245,0.06))",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <MenuBookIcon sx={{ color: isDark ? "#f97316" : "#1976d2" }} />
                    </Box>

                    <Box flex={1}>
                      <Typography variant="subtitle1" fontWeight={700}>
                        {borrow.bookTitle ?? "Unknown Book"}
                      </Typography>
                      <Stack direction="row" spacing={1} mt={0.75} flexWrap="wrap">
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <CalendarTodayIcon sx={{ fontSize: 13, color: "text.secondary" }} />
                          <Typography variant="caption" color="text.secondary">
                            Borrowed: {borrow.borrowDate ? new Date(borrow.borrowDate).toLocaleDateString() : "N/A"}
                          </Typography>
                        </Stack>
                        {borrow.returnDate && (
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <CheckCircleIcon sx={{ fontSize: 13, color: overdue ? "#ef4444" : "text.secondary" }} />
                            <Typography variant="caption" sx={{ color: overdue ? "#ef4444" : "text.secondary" }}>
                              Due: {new Date(borrow.returnDate).toLocaleDateString()}
                            </Typography>
                          </Stack>
                        )}
                      </Stack>
                    </Box>

                    <Chip
                      label={borrow.returned ? "Returned" : overdue ? "Overdue" : "Active"}
                      size="small"
                      sx={{
                        fontWeight: 700, fontSize: "0.7rem",
                        bgcolor: borrow.returned ? "rgba(148,163,184,0.2)" : overdue ? "rgba(239,68,68,0.15)" : isDark ? "rgba(34,197,94,0.15)" : "rgba(34,197,94,0.1)",
                        color: borrow.returned ? "#64748b" : overdue ? "#ef4444" : "#22c55e",
                      }}
                    />
                  </Stack>

                  {(borrow.pricePaid ?? 0) > 0 && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
                      💳 Paid ₹{borrow.pricePaid}
                    </Typography>
                  )}

                  {overdue && (
                    <Alert severity="error" sx={{ mt: 2, borderRadius: 2, py: 0.5, fontSize: "0.8rem" }}>
                      This book is overdue! Please return it as soon as possible.
                    </Alert>
                  )}

                  {!borrow.returned && (
                    <Stack direction="row" spacing={1.5} mt={2}>
                      <Button
                        size="small" variant="contained" startIcon={<AutoStoriesIcon />}
                        onClick={() => navigate(`/user/read/${borrow.bookId}`)}
                        sx={{ borderRadius: 2, fontWeight: 700, bgcolor: "#f97316", "&:hover": { bgcolor: "#ea6f0e" } }}
                      >
                        Continue Reading
                      </Button>
                      <Button
                        size="small" variant="outlined" startIcon={<KeyboardReturnIcon />}
                        onClick={() => handleSelfReturn(borrow)}
                        sx={{ borderRadius: 2, fontWeight: 700 }}
                      >
                        Return Book
                      </Button>
                    </Stack>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      )}
    </Box>
  );
}
