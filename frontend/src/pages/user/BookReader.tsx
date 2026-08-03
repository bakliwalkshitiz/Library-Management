import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box, Typography, IconButton, Stack, Slider, Tooltip,
  CircularProgress, Paper, Fab, Chip, Divider,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import FormatSizeIcon from "@mui/icons-material/FormatSize";
import { getBookById, askAiAboutBook } from "../../services/bookService";
import { getBorrows, addBorrow } from "../../services/borrowService";
import { useAuth } from "../../context/AuthContext";
import { useThemeMode } from "../../context/ThemeContext";
import type { Book } from "../../types/book";
import type { Borrow } from "../../types/borrow";
import toast from "react-hot-toast";
import LockIcon from "@mui/icons-material/Lock";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function BookReader() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { mode } = useThemeMode();
  const { user, isLoggedIn } = useAuth();
  const isDark = mode === "dark";

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [issuing, setIssuing] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiQuery, setAiQuery] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);

  const WORDS_PER_PAGE = 300;

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getBookById(Number(id));
        setBook(res.data);
        if (res.data.content) {
          const words = res.data.content.split(" ").length;
          setTotalPages(Math.max(1, Math.ceil(words / WORDS_PER_PAGE)));
        }

        if (isLoggedIn && user) {
          try {
            const borrowRes = await getBorrows();
            const mine: Borrow[] = (borrowRes.data || []).filter(
              (b: Borrow) => b.bookId === Number(id) && b.borrowerName === user.name
            );
            setHasAccess(mine.length > 0);
          } catch { setHasAccess(false); }
        } else {
          setHasAccess(false);
        }

      } catch { toast.error("Failed to load book"); }
      finally { setLoading(false); setCheckingAccess(false); }
    };
    load();
  }, [id, isLoggedIn]);

  const handleIssue = async () => {
    if (!isLoggedIn || !user) {
      toast.error("Please login to access this content");
      navigate("/login");
      return;
    }
    if (!book) return;
    setIssuing(true);
    try {
      await addBorrow({ bookId: book.id, borrowerName: user.name });
      toast.success("Book issued! Enjoy reading.");
      setHasAccess(true);
      setPaymentOpen(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to issue book. It may be fully checked out.");
    } finally { setIssuing(false); }
  };

  const handleReadClick = () => {
    if (!isLoggedIn) {
      toast.error("Please login to access this content");
      navigate("/login");
      return;
    }
    if ((book?.price ?? 0) > 0) {
      setPaymentOpen(true);
    } else {
      handleIssue();
    }
  };

  const getPageContent = () => {
    if (!book?.content) return null;
    const words = book.content.split(" ");
    const start = (currentPage - 1) * WORDS_PER_PAGE;
    const end = start + WORDS_PER_PAGE;
    return words.slice(start, end).join(" ");
  };

  const handleTextSelect = () => {
    const sel = window.getSelection()?.toString();
    if (sel && sel.trim().length > 0) {
      const text = sel.trim();
      setSelectedText(text);
      setAiQuery("Explain this in simple terms");
      setAiAnswer("");
      setAiOpen(true);
      askAI(text, "Explain this in simple terms");
    }
  };

  const askAI = async (textOverride?: string, queryOverride?: string) => {
    const question = queryOverride ?? aiQuery;
    const context = textOverride ?? selectedText;
    if (!question.trim() || !book) return;
    setAiLoading(true);
    try {
      const res = await askAiAboutBook(book.id, question, context || undefined);
      setAiAnswer(res.data?.answer ?? "No answer received.");
    } catch (err: any) {
      setAiAnswer(err?.response?.data?.message ?? "Failed to get AI response. Please try again.");
    } finally { setAiLoading(false); }
  };

  if (loading) return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <CircularProgress sx={{ color: "#f97316" }} />
    </Box>
  );

  if (!book) return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Typography>Book not found</Typography>
    </Box>
  );

  const pageContent = getPageContent();

  return (
    <Box sx={{
      minHeight: "100vh",
      bgcolor: isDark ? "#0d0a05" : "#f5f0e8",
      display: "flex", flexDirection: "column",
    }}>
      {/* Reader Toolbar */}
      <Paper elevation={0} sx={{
        position: "sticky", top: 0, zIndex: 100,
        bgcolor: isDark ? "#1a1208" : "#3e2723",
        borderBottom: "1px solid rgba(249,115,22,0.2)",
        px: 3, py: 1.5,
      }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <IconButton onClick={() => navigate(-1)} sx={{ color: "#fbbf24" }}>
              <ArrowBackIcon />
            </IconButton>
            <Box>
              <Typography variant="subtitle1" fontWeight={700} sx={{ color: "#fff" }}>
                {book.title}
              </Typography>
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)" }}>
                {book.authorName}
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1}>
            <Chip label={`Page ${currentPage} of ${totalPages}`} size="small"
              sx={{ bgcolor: "rgba(249,115,22,0.2)", color: "#fbbf24", fontWeight: 700 }} />
            <Tooltip title="Decrease font">
              <IconButton size="small" onClick={() => setFontSize(f => Math.max(12, f - 2))} sx={{ color: "#fbbf24" }}>
                <ZoomOutIcon />
              </IconButton>
            </Tooltip>
            <Typography variant="caption" sx={{ color: "#fbbf24", minWidth: 30, textAlign: "center" }}>
              {fontSize}px
            </Typography>
            <Tooltip title="Increase font">
              <IconButton size="small" onClick={() => setFontSize(f => Math.min(32, f + 2))} sx={{ color: "#fbbf24" }}>
                <ZoomInIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </Paper>

      {/* Book Content */}
      <Box sx={{ flex: 1, display: "flex", justifyContent: "center", py: 6, px: 2 }}>
        <Box sx={{ width: "100%", maxWidth: 720 }}>
          {checkingAccess ? (
            <Box display="flex" justifyContent="center" py={12}>
              <CircularProgress sx={{ color: "#f97316" }} />
            </Box>
          ) : !hasAccess ? (
            <Box sx={{
              textAlign: "center", py: 10, px: 4,
              border: "2px dashed rgba(249,115,22,0.35)",
              borderRadius: 4,
              bgcolor: isDark ? "#1a1208" : "#fffbf4",
            }}>
              <LockIcon sx={{ fontSize: 64, color: "#f97316", mb: 2 }} />
              <Typography variant="h5" fontWeight={800} color="text.primary" mb={1}>
                {(book.price ?? 0) > 0 ? `This book costs ₹${book.price}` : "Issue this book to start reading"}
              </Typography>
              <Typography color="text.secondary" mb={3}>
                {(book.price ?? 0) > 0
                  ? "Scan the QR code to pay, then confirm to get instant access."
                  : "It's free — issue it to yourself and start reading right away."}
              </Typography>
              <Button
                variant="contained" size="large"
                startIcon={(book.price ?? 0) > 0 ? <QrCode2Icon /> : <AutoStoriesIcon />}
                onClick={handleReadClick}
                disabled={issuing || (book.availableCopies ?? 0) <= 0}
                sx={{ borderRadius: 2, fontWeight: 700, px: 4, py: 1.5, bgcolor: "#f97316", "&:hover": { bgcolor: "#ea6f0e" } }}
              >
                {(book.availableCopies ?? 0) <= 0
                  ? "All copies issued"
                  : (book.price ?? 0) > 0 ? "Pay & Issue Book" : "Issue Book — Free"}
              </Button>
            </Box>
          ) : !book.content ? (
            <Box sx={{
              textAlign: "center", py: 12,
              border: "2px dashed rgba(249,115,22,0.3)",
              borderRadius: 4,
            }}>
              <AutoStoriesIcon sx={{ fontSize: 72, color: "rgba(249,115,22,0.3)", mb: 2 }} />
              <Typography variant="h5" fontWeight={700} color="text.primary" mb={1}>
                No content available yet
              </Typography>
              <Typography color="text.secondary">
                Admin hasn't added reading content for this book.
              </Typography>
            </Box>
          ) : (
            <Paper elevation={0} sx={{
              p: { xs: 3, md: 6 },
              bgcolor: isDark ? "#1a1208" : "#fffbf4",
              borderRadius: 4,
              border: isDark ? "1px solid rgba(249,115,22,0.1)" : "1px solid #d4b896",
              boxShadow: isDark ? "0 20px 60px rgba(0,0,0,0.5)" : "0 20px 60px rgba(0,0,0,0.12)",
              minHeight: 600,
            }}>
              {/* Page header */}
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="caption" sx={{ color: isDark ? "#f97316" : "#8d6e63", fontWeight: 700, letterSpacing: 2 }}>
                  {book.title.toUpperCase()}
                </Typography>
                <Typography variant="caption" sx={{ color: isDark ? "#f97316" : "#8d6e63", fontWeight: 700 }}>
                  {currentPage}
                </Typography>
              </Stack>

              <Divider sx={{ mb: 4, borderColor: isDark ? "rgba(249,115,22,0.15)" : "#d4b896" }} />

              {/* Readable content */}
              <Box
                ref={contentRef}
                onMouseUp={handleTextSelect}
                sx={{
                  fontSize, lineHeight: 1.9,
                  color: isDark ? "#e8d5b7" : "#3e2723",
                  fontFamily: "'Georgia', 'Times New Roman', serif",
                  letterSpacing: "0.02em",
                  "& p": { mb: 2 },
                  userSelect: "text",
                }}
              >
                {pageContent?.split("\n").map((para, i) => (
                  <Typography key={i} component="p" sx={{
                    fontSize, lineHeight: 1.9, mb: 2,
                    color: isDark ? "#e8d5b7" : "#3e2723",
                    fontFamily: "'Georgia', serif",
                    textIndent: "2em",
                  }}>
                    {para}
                  </Typography>
                ))}
              </Box>

              <Divider sx={{ mt: 4, mb: 3, borderColor: isDark ? "rgba(249,115,22,0.15)" : "#d4b896" }} />

              {/* Page navigation */}
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={3}>
                <Button variant="outlined" disabled={currentPage === 1}
                  onClick={() => { setCurrentPage(p => p - 1); window.scrollTo(0, 0); }}
                  sx={{ borderRadius: 2, borderColor: "#f97316", color: "#f97316" }}>
                  ← Previous
                </Button>
                <Typography variant="body2" color="text.secondary">
                  Page {currentPage} / {totalPages}
                </Typography>
                <Button variant="outlined" disabled={currentPage === totalPages}
                  onClick={() => { setCurrentPage(p => p + 1); window.scrollTo(0, 0); }}
                  sx={{ borderRadius: 2, borderColor: "#f97316", color: "#f97316" }}>
                  Next →
                </Button>
              </Stack>
            </Paper>
          )}
        </Box>
      </Box>

      {/* AI Floating Button */}
      {hasAccess && book.content && (
        <Fab
          onClick={() => setAiOpen(true)}
          sx={{
            position: "fixed", bottom: 32, right: 32,
            bgcolor: "#f97316", color: "#fff",
            "&:hover": { bgcolor: "#ea6f0e", transform: "scale(1.1)" },
            transition: "all 0.2s",
            boxShadow: "0 8px 24px rgba(249,115,22,0.4)",
          }}>
          <SmartToyIcon />
        </Fab>
      )}

      {/* AI Dialog */}
      <Dialog open={aiOpen} onClose={() => { setAiOpen(false); setAiAnswer(""); setAiQuery(""); setSelectedText(""); }}
        fullWidth maxWidth="sm">
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <SmartToyIcon sx={{ color: "#f97316" }} />
          <Typography fontWeight={700}>Ask AI about this book</Typography>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            {selectedText && (
              <Box sx={{ p: 1.5, bgcolor: "rgba(249,115,22,0.08)", borderRadius: 2, borderLeft: "3px solid #f97316" }}>
                <Typography variant="caption" color="text.secondary">Selected text:</Typography>
                <Typography variant="body2" sx={{ mt: 0.5, fontStyle: "italic" }}>
                  "{selectedText.slice(0, 150)}{selectedText.length > 150 ? "..." : ""}"
                </Typography>
              </Box>
            )}
            <TextField
              label="Ask anything about this book..."
              multiline rows={3} fullWidth
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              placeholder={selectedText ? `Ask about the selected text...` : `What does "${book.title}" mean? Who is the author? Explain this concept...`}
            />
            {aiAnswer && (
              <Box sx={{ p: 2, bgcolor: "rgba(34,197,94,0.08)", borderRadius: 2, border: "1px solid rgba(34,197,94,0.2)" }}>
                <Typography variant="caption" color="text.secondary" fontWeight={700}>AI Answer:</Typography>
                <Typography variant="body2" sx={{ mt: 1, lineHeight: 1.7 }}>{aiAnswer}</Typography>
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => { setAiOpen(false); setAiAnswer(""); setAiQuery(""); setSelectedText(""); }}>Close</Button>
          <Button variant="contained" onClick={() => askAI()} disabled={aiLoading || !aiQuery.trim()}
            sx={{ bgcolor: "#f97316", "&:hover": { bgcolor: "#ea6f0e" }, borderRadius: 2, fontWeight: 700 }}>
            {aiLoading ? "Thinking..." : "Ask AI"}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Payment Dialog for paid books */}
      <Dialog open={paymentOpen} onClose={() => setPaymentOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <QrCode2Icon sx={{ color: "#f97316" }} />
          <Typography fontWeight={700}>Pay ₹{book.price} to Issue</Typography>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} alignItems="center">
            {book.ownerQrImageUrl ? (
              <>
                <Box
                  component="img"
                  alt="Publisher's payment QR code"
                  src={book.ownerQrImageUrl}
                  sx={{ width: 220, height: 220, borderRadius: 2, border: "1px solid rgba(249,115,22,0.2)", objectFit: "contain" }}
                />
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  Scan with any UPI app and pay <strong>{book.ownerName}</strong> ₹{book.price}
                </Typography>
              </>
            ) : book.ownerUpiId ? (
              <>
                <Box
                  component="img"
                  alt="UPI payment QR code"
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
                    `upi://pay?pa=${book.ownerUpiId}&pn=${encodeURIComponent(book.ownerName ?? "Publisher")}&am=${book.price}&cu=INR&tn=${encodeURIComponent("Book: " + book.title)}`
                  )}`}
                  sx={{ width: 220, height: 220, borderRadius: 2, border: "1px solid rgba(249,115,22,0.2)" }}
                />
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  Scan with any UPI app (GPay, PhonePe, Paytm) and pay to <strong>{book.ownerUpiId}</strong>
                </Typography>
              </>
            ) : (
              <Typography variant="body2" color="text.secondary" textAlign="center">
                This publisher hasn't set up payment info yet. Ask them to add a UPI ID in Settings.
              </Typography>
            )}
            <Typography variant="caption" color="text.secondary" textAlign="center" sx={{ fontStyle: "italic" }}>
              This is a self-declared confirmation — there's no live payment gateway wired in, so click below only after you've actually paid.
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setPaymentOpen(false)}>Cancel</Button>
          <Button
            variant="contained" startIcon={<CheckCircleIcon />}
            onClick={handleIssue} disabled={issuing}
            sx={{ bgcolor: "#22c55e", "&:hover": { bgcolor: "#16a34a" }, borderRadius: 2, fontWeight: 700 }}
          >
            {issuing ? "Issuing..." : "I've Paid — Issue Book"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
