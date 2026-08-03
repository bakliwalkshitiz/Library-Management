import {
  Box, Typography, Card, CardContent, Avatar,
  Stack, Chip, Grid, Button,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { useAuth } from "../../context/AuthContext";
import { useThemeMode } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, isStaff, isAdmin } = useAuth();
  const { mode } = useThemeMode();
  const navigate = useNavigate();
  const isDark = mode === "dark";

  if (!user) return null;

  const infoItems = [
    { label: "Full Name", value: user.name, icon: <PersonIcon fontSize="small" /> },
    { label: "Email Address", value: user.email, icon: <EmailIcon fontSize="small" /> },
    { label: "Role", value: user.role, icon: <AdminPanelSettingsIcon fontSize="small" /> },
    { label: "Member Since", value: "2024", icon: <CalendarTodayIcon fontSize="small" /> },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, maxWidth: 700, mx: "auto" }}>
      <Typography variant="h4" fontWeight={800} color="text.primary">
        My Profile
      </Typography>

      {/* Avatar Card */}
      <Card
        sx={{
          borderRadius: 3,
          border: isDark ? "1px solid rgba(249,115,22,0.15)" : "1px solid #e2e8f0",
          background: isDark
            ? "linear-gradient(135deg, rgba(249,115,22,0.08), rgba(251,191,36,0.04))"
            : "linear-gradient(135deg, rgba(25,118,210,0.04), rgba(66,165,245,0.02))",
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Stack direction="row" alignItems="center" spacing={3}>
            <Avatar
              sx={{
                width: 80, height: 80, fontSize: "2rem", fontWeight: 800,
                background: isDark
                  ? "linear-gradient(135deg, #f97316, #fbbf24)"
                  : "linear-gradient(135deg, #1976d2, #42a5f5)",
                color: isDark ? "#0f1117" : "#fff",
                boxShadow: isDark
                  ? "0 0 24px rgba(249,115,22,0.4)"
                  : "0 8px 24px rgba(25,118,210,0.3)",
              }}
            >
              {user.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight={800} color="text.primary">
                {user.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={0.25}>
                {user.email}
              </Typography>
              <Box mt={1}>
                <Chip
                  label={user.role}
                  size="small"
                  sx={{
                    fontWeight: 700, fontSize: "0.7rem",
                    bgcolor: user.role === "ADMIN" ? "rgba(239,68,68,0.12)"
                      : user.role === "PUBLISHER" ? "rgba(249,115,22,0.12)"
                      : "rgba(34,197,94,0.12)",
                    color: user.role === "ADMIN" ? "#ef4444"
                      : user.role === "PUBLISHER" ? "#f97316"
                      : "#22c55e",
                  }}
                />
              </Box>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Panel access — admin/publisher only */}
      {isStaff && (
        <Card
          sx={{
            borderRadius: 3,
            border: "1px solid rgba(249,115,22,0.25)",
            background: isDark ? "rgba(249,115,22,0.06)" : "rgba(249,115,22,0.04)",
          }}
        >
          <CardContent sx={{ p: 3, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
            <Box>
              <Typography variant="subtitle1" fontWeight={700}>
                {isAdmin ? "Admin Dashboard" : "Publisher Dashboard"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {isAdmin
                  ? "Manage every book, category, user, and borrow record on the site."
                  : "Manage your own published books, categories, and borrow history."}
              </Typography>
            </Box>
            <Button
              variant="contained" startIcon={<DashboardIcon />}
              onClick={() => navigate("/admin")}
              sx={{ borderRadius: 2, fontWeight: 700, bgcolor: "#f97316", "&:hover": { bgcolor: "#ea6f0e" } }}
            >
              Open {isAdmin ? "Admin" : "Publisher"} Panel
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Info Card */}
      <Card
        sx={{
          borderRadius: 3,
          border: isDark ? "1px solid rgba(249,115,22,0.12)" : "1px solid #e2e8f0",
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography variant="subtitle1" fontWeight={700} mb={2}>
            Account Information
          </Typography>
          <Grid container spacing={2}>
            {infoItems.map((item) => (
              <Grid item xs={12} sm={6} key={item.label}>
                <Box
                  sx={{
                    p: 2, borderRadius: 2,
                    bgcolor: isDark ? "rgba(255,255,255,0.03)" : "#f8fafc",
                    border: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid #e2e8f0",
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                    <Box sx={{ color: isDark ? "#f97316" : "#1976d2" }}>{item.icon}</Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                      {item.label}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" fontWeight={700} color="text.primary">
                    {item.value}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}
