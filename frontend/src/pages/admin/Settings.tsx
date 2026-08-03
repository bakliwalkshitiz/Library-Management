import { useState } from "react";
import {
  Box, Typography, Card, CardContent, Stack,
  Switch, FormControlLabel, Divider, TextField, Button, Alert,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import { useThemeMode } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { updateAdminCredentials, updateMyPaymentInfo } from "../../services/userService";
import toast from "react-hot-toast";

export default function Settings() {
  const { mode, toggleTheme } = useThemeMode();
  const { user, logout } = useAuth();
  const isDark = mode === "dark";
  const isAdmin = user?.role === "ADMIN";
  const isPublisher = user?.role === "PUBLISHER";

  // Admin credential change
  const [currentPassword, setCurrentPassword] = useState("");
  const [newEmail, setNewEmail] = useState(user?.email ?? "");
  const [newPassword, setNewPassword] = useState("");
  const [savingCreds, setSavingCreds] = useState(false);

  // Publisher payment info
  const [upiId, setUpiId] = useState("");
  const [qrImageUrl, setQrImageUrl] = useState("");
  const [savingPayment, setSavingPayment] = useState(false);

  const handleSaveCredentials = async () => {
    if (!currentPassword) {
      toast.error("Enter your current password to confirm this change");
      return;
    }
    setSavingCreds(true);
    try {
      await updateAdminCredentials({
        currentPassword,
        email: newEmail !== user?.email ? newEmail : undefined,
        password: newPassword || undefined,
      });
      toast.success("Credentials updated. Please log in again.");
      setTimeout(() => logout(), 1200);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to update credentials");
    } finally { setSavingCreds(false); }
  };

  const handleSavePayment = async () => {
    setSavingPayment(true);
    try {
      await updateMyPaymentInfo({ upiId, qrImageUrl });
      toast.success("Payment info saved. Readers of your paid books will now see this QR.");
    } catch {
      toast.error("Failed to save payment info");
    } finally { setSavingPayment(false); }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, maxWidth: 600 }}>
      <Box>
        <Typography variant="h4" fontWeight={800} color="text.primary">Settings</Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          Manage your preferences
        </Typography>
      </Box>

      {/* Profile info */}
      <Card sx={{ borderRadius: 3, border: isDark ? "1px solid rgba(249,115,22,0.15)" : "1px solid #e2e8f0" }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="subtitle1" fontWeight={700} mb={2}>Account</Typography>
          <Stack spacing={1.5}>
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>Name</Typography>
              <Typography variant="body2" fontWeight={700}>{user?.name}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>Email</Typography>
              <Typography variant="body2" fontWeight={700}>{user?.email}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>Role</Typography>
              <Typography variant="body2" fontWeight={700}>{user?.role}</Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Admin-only: change own login credentials */}
      {isAdmin && (
        <Card sx={{ borderRadius: 3, border: isDark ? "1px solid rgba(249,115,22,0.15)" : "1px solid #e2e8f0" }}>
          <CardContent sx={{ p: 3 }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
              <LockIcon sx={{ color: "#f97316" }} fontSize="small" />
              <Typography variant="subtitle1" fontWeight={700}>Change Admin Login</Typography>
            </Stack>
            <Divider sx={{ mb: 2 }} />
            <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
              This is the ONE fixed admin account. Only you can change it, and only from here.
            </Alert>
            <Stack spacing={2}>
              <TextField label="New Email" fullWidth value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
              <TextField label="New Password (leave blank to keep current)" type="password" fullWidth
                value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              <TextField label="Current Password (required to confirm)" type="password" fullWidth
                value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
              <Button variant="contained" onClick={handleSaveCredentials} disabled={savingCreds}
                sx={{ borderRadius: 2, fontWeight: 700, alignSelf: "flex-start", bgcolor: "#f97316", "&:hover": { bgcolor: "#ea6f0e" } }}>
                {savingCreds ? "Saving..." : "Update Credentials"}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Publisher-only: payment QR / UPI */}
      {isPublisher && (
        <Card sx={{ borderRadius: 3, border: isDark ? "1px solid rgba(249,115,22,0.15)" : "1px solid #e2e8f0" }}>
          <CardContent sx={{ p: 3 }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
              <QrCode2Icon sx={{ color: "#f97316" }} fontSize="small" />
              <Typography variant="subtitle1" fontWeight={700}>Payment for Your Paid Books</Typography>
            </Stack>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary" mb={2}>
              Readers pay YOU directly. Give a UPI ID (we'll auto-generate a scannable QR) — or paste a URL to your
              own QR code image if you'd rather use one from your bank app.
            </Typography>
            <Stack spacing={2}>
              <TextField label="Your UPI ID" placeholder="yourname@okhdfcbank" fullWidth
                value={upiId} onChange={(e) => setUpiId(e.target.value)} />
              <TextField label="Or: your own QR code image URL (optional)" placeholder="https://..." fullWidth
                value={qrImageUrl} onChange={(e) => setQrImageUrl(e.target.value)}
                helperText="Leave blank to auto-generate a QR from your UPI ID above" />
              <Button variant="contained" onClick={handleSavePayment} disabled={savingPayment}
                sx={{ borderRadius: 2, fontWeight: 700, alignSelf: "flex-start", bgcolor: "#f97316", "&:hover": { bgcolor: "#ea6f0e" } }}>
                {savingPayment ? "Saving..." : "Save Payment Info"}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Appearance */}
      <Card sx={{ borderRadius: 3, border: isDark ? "1px solid rgba(249,115,22,0.15)" : "1px solid #e2e8f0" }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="subtitle1" fontWeight={700} mb={2}>Appearance</Typography>
          <Divider sx={{ mb: 2 }} />
          <FormControlLabel
            control={
              <Switch
                checked={isDark}
                onChange={toggleTheme}
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": { color: "#f97316" },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: "#f97316" },
                }}
              />
            }
            label={
              <Box>
                <Typography variant="body2" fontWeight={600}>Dark Mode</Typography>
                <Typography variant="caption" color="text.secondary">
                  {isDark ? "Currently using dark theme" : "Currently using light theme"}
                </Typography>
              </Box>
            }
          />
        </CardContent>
      </Card>
    </Box>
  );
}
