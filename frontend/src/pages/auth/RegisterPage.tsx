import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import {
  Box, Button, Card, CardContent, CircularProgress, Divider,
  InputAdornment, Stack, TextField, Typography, IconButton,
  ToggleButtonGroup, ToggleButton, Tooltip, Dialog, DialogTitle,
  DialogContent, DialogActions, Chip
} from "@mui/material";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import { register as registerApi } from "../../services/authService";
import { useThemeMode } from "../../context/ThemeContext";

const schema = z.object({
  name: z.string().min(2, "Full Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address (e.g. user@domain.com)"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});
type RegisterForm = z.infer<typeof schema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const { mode, toggleTheme } = useThemeMode();
  const isDark = mode === "dark";
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"USER" | "PUBLISHER">("USER");
  const [infoOpen, setInfoOpen] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      setLoading(true);
      await registerApi({ ...data, role });
      toast.success("Account created successfully! Please sign in with your email.");
      navigate("/login");
    } catch (error: any) {
      const serverMessage = error?.response?.data?.message 
        || (typeof error?.response?.data === "string" ? error.response.data : null)
        || "Registration failed. Please check your details and try again.";
      toast.error(serverMessage);
    } finally {
      setLoading(false);
    }
  };

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      ...(isDark && {
        "& fieldset": { borderColor: "rgba(249,115,22,0.25)" },
        "&:hover fieldset": { borderColor: "#f97316" },
        "&.Mui-focused fieldset": { borderColor: "#f97316" },
      }),
    },
    ...(isDark && { "& label.Mui-focused": { color: "#f97316" } }),
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        bgcolor: "background.default", p: 2, position: "relative",
        "&::before": {
          content: '""', position: "fixed", inset: 0,
          background: isDark
            ? "radial-gradient(ellipse at 80% 20%, rgba(249,115,22,0.07) 0%, transparent 60%)"
            : "radial-gradient(ellipse at 80% 20%, rgba(25,118,210,0.05) 0%, transparent 60%)",
          pointerEvents: "none", zIndex: 0,
        },
      }}
    >
      <IconButton
        onClick={toggleTheme}
        sx={{
          position: "fixed", top: 20, right: 20,
          color: isDark ? "#fbbf24" : "#64748b",
          bgcolor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
          "&:hover": { transform: "rotate(20deg)" },
          transition: "all 0.2s", zIndex: 10,
        }}
      >
        {isDark ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>

      <Card
        sx={{
          width: "100%", maxWidth: 460, borderRadius: 4,
          position: "relative", zIndex: 1,
          border: isDark ? "1px solid rgba(249,115,22,0.15)" : "1px solid #e2e8f0",
          boxShadow: isDark ? "0 24px 64px rgba(0,0,0,0.5)" : "0 24px 64px rgba(0,0,0,0.1)",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Stack alignItems="center" spacing={1.5} mb={2.5}>
            <Box
              sx={{
                width: 60, height: 60, borderRadius: 3,
                background: isDark
                  ? "linear-gradient(135deg, #f97316, #fbbf24)"
                  : "linear-gradient(135deg, #1976d2, #42a5f5)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: isDark ? "0 0 24px rgba(249,115,22,0.5)" : "0 8px 24px rgba(25,118,210,0.35)",
              }}
            >
              <LocalLibraryIcon sx={{ fontSize: 30, color: isDark ? "#0f1117" : "#fff" }} />
            </Box>
            <Box textAlign="center">
              <Typography variant="h5" fontWeight={800} sx={{ color: "text.primary" }}>
                Create Account
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={0.5}>
                Join Library Management System
              </Typography>
            </Box>

            <Chip
              icon={<InfoOutlinedIcon fontSize="small" />}
              label="Mandatory Field Rules (Click to View)"
              onClick={() => setInfoOpen(true)}
              size="small"
              clickable
              color="warning"
              variant="outlined"
              sx={{ fontWeight: 600, mt: 1 }}
            />
          </Stack>

          {/* Role Selection */}
          <Box mb={3}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
              <Typography variant="body2" color="text.secondary" fontWeight={600}>
                Register as: *
              </Typography>
              <Tooltip title="Choose User for reading & borrowing, or Publisher for adding & managing books.">
                <InfoOutlinedIcon fontSize="small" sx={{ color: "text.secondary", cursor: "pointer" }} />
              </Tooltip>
            </Box>
            <ToggleButtonGroup
              value={role}
              exclusive
              onChange={(_, val) => val && setRole(val)}
              fullWidth
              size="small"
            >
              <ToggleButton
                value="USER"
                sx={{
                  borderRadius: "8px !important",
                  fontWeight: 700,
                  gap: 0.5,
                  "&.Mui-selected": {
                    bgcolor: isDark ? "rgba(34,197,94,0.15)" : "rgba(25,118,210,0.1)",
                    color: isDark ? "#22c55e" : "#1976d2",
                    borderColor: isDark ? "#22c55e" : "#1976d2",
                  },
                }}
              >
                <PersonOutlinedIcon fontSize="small" />
                User (Reader)
              </ToggleButton>
              <ToggleButton
                value="PUBLISHER"
                sx={{
                  borderRadius: "8px !important",
                  fontWeight: 700,
                  gap: 0.5,
                  ml: "4px !important",
                  "&.Mui-selected": {
                    bgcolor: isDark ? "rgba(249,115,22,0.15)" : "rgba(249,115,22,0.1)",
                    color: "#f97316",
                    borderColor: "#f97316",
                  },
                }}
              >
                <AdminPanelSettingsIcon fontSize="small" />
                Publisher
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2.5}>
              <TextField
                label="Full Name *" fullWidth
                placeholder="e.g. John Doe"
                {...register("name")}
                error={!!errors.name} helperText={errors.name?.message || "Mandatory: Minimum 2 characters"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: isDark ? "#f97316" : "action.active", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="Full Name is mandatory (At least 2 characters)">
                        <InfoOutlinedIcon fontSize="small" sx={{ color: "text.secondary" }} />
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
                sx={fieldSx}
              />

              <TextField
                label="Email Address *" type="email" fullWidth
                placeholder="e.g. john@example.com"
                {...register("email")}
                error={!!errors.email} helperText={errors.email?.message || "Mandatory: Must be a valid email address"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: isDark ? "#f97316" : "action.active", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="Email is mandatory and must be unique in the system">
                        <InfoOutlinedIcon fontSize="small" sx={{ color: "text.secondary" }} />
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
                sx={fieldSx}
              />

              <TextField
                label="Password *"
                type={showPassword ? "text" : "password"}
                fullWidth
                placeholder="Minimum 6 characters"
                {...register("password")}
                error={!!errors.password} helperText={errors.password?.message || "Mandatory: Minimum 6 characters"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: isDark ? "#f97316" : "action.active", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setShowPassword(v => !v)} edge="end" sx={{ mr: 0.5 }}>
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                      <Tooltip title="Password is mandatory and must be at least 6 characters long">
                        <InfoOutlinedIcon fontSize="small" sx={{ color: "text.secondary" }} />
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
                sx={fieldSx}
              />

              <Button
                type="submit" variant="contained" size="large" fullWidth
                disabled={loading}
                sx={{
                  borderRadius: 2, py: 1.5, fontWeight: 700, fontSize: "1rem",
                  background: isDark ? "linear-gradient(135deg, #f97316, #fbbf24)" : undefined,
                  color: isDark ? "#0f1117" : undefined,
                  "&:hover": { transform: "translateY(-1px)" },
                  transition: "all 0.2s ease",
                }}
              >
                {loading ? <CircularProgress size={22} sx={{ color: isDark ? "#0f1117" : "#fff" }} /> : `Create ${role === "PUBLISHER" ? "Publisher" : "Reader"} Account`}
              </Button>
            </Stack>
          </form>

          <Divider sx={{ my: 3, borderColor: isDark ? "rgba(255,255,255,0.08)" : undefined }}>
            <Typography variant="caption" color="text.secondary">OR</Typography>
          </Divider>

          <Typography variant="body2" textAlign="center" color="text.secondary">
            Already have an account?{" "}
            <Box
              component={Link} to="/login"
              sx={{
                color: isDark ? "#f97316" : "#1976d2", fontWeight: 700,
                textDecoration: "none", "&:hover": { textDecoration: "underline" },
              }}
            >
              Sign In
            </Box>
          </Typography>
        </CardContent>
      </Card>

      {/* Field Requirements Dialog Popup */}
      <Dialog open={infoOpen} onClose={() => setInfoOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, display: "flex", alignItems: "center", gap: 1 }}>
          <InfoOutlinedIcon color="warning" />
          Mandatory Registration Requirements
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <Box>
              <Typography variant="subtitle2" fontWeight={700} color="primary" display="flex" alignItems="center" gap={0.5}>
                <CheckCircleOutlineIcon fontSize="small" /> 1. Full Name (Mandatory)
              </Typography>
              <Typography variant="body2" color="text.secondary" pl={3}>
                Must be at least 2 characters long.
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" fontWeight={700} color="primary" display="flex" alignItems="center" gap={0.5}>
                <CheckCircleOutlineIcon fontSize="small" /> 2. Email Address (Mandatory)
              </Typography>
              <Typography variant="body2" color="text.secondary" pl={3}>
                Must be a valid email format and unique (not registered before).
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" fontWeight={700} color="primary" display="flex" alignItems="center" gap={0.5}>
                <CheckCircleOutlineIcon fontSize="small" /> 3. Password (Mandatory)
              </Typography>
              <Typography variant="body2" color="text.secondary" pl={3}>
                Must contain at least 6 characters.
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" fontWeight={700} color="primary" display="flex" alignItems="center" gap={0.5}>
                <CheckCircleOutlineIcon fontSize="small" /> 4. Account Type (Mandatory)
              </Typography>
              <Typography variant="body2" color="text.secondary" pl={3}>
                Select <strong>User</strong> (Reader) or <strong>Publisher</strong> (Book Manager).
              </Typography>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInfoOpen(false)} variant="contained" color="warning">
            Got It!
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

