import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import {
  Box, Button, Card, CardContent, CircularProgress,
  Divider, InputAdornment, Stack, TextField, Typography, IconButton, Tooltip
} from "@mui/material";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import { login as loginApi } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { useThemeMode } from "../../context/ThemeContext";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type LoginForm = z.infer<typeof schema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { mode, toggleTheme } = useThemeMode();
  const isDark = mode === "dark";
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setLoading(true);
      const response = await loginApi(data);
      login(response);
      toast.success(`Welcome back, ${response.name}!`);
      if (response.role === "ADMIN" || response.role === "PUBLISHER") {
        navigate("/admin");
      } else {
        navigate("/user");
      }
    } catch (error: any) {
      const serverMessage = error?.response?.data?.message 
        || (typeof error?.response?.data === "string" ? error.response.data : null)
        || "Invalid email or password. Please check your credentials.";
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
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        p: 2,
        position: "relative",
        "&::before": {
          content: '""',
          position: "fixed",
          inset: 0,
          background: isDark
            ? "radial-gradient(ellipse at 20% 50%, rgba(249,115,22,0.08) 0%, transparent 60%)"
            : "radial-gradient(ellipse at 20% 50%, rgba(25,118,210,0.06) 0%, transparent 60%)",
          pointerEvents: "none",
          zIndex: 0,
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
          width: "100%", maxWidth: 440, borderRadius: 4,
          position: "relative", zIndex: 1,
          border: isDark ? "1px solid rgba(249,115,22,0.15)" : "1px solid #e2e8f0",
          boxShadow: isDark ? "0 24px 64px rgba(0,0,0,0.5)" : "0 24px 64px rgba(0,0,0,0.1)",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Stack alignItems="center" spacing={1.5} mb={3}>
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
                Library Management
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={0.5}>
                Sign in to access your account
              </Typography>
            </Box>
          </Stack>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2.5}>
              <TextField
                label="Email Address *" type="email" fullWidth
                placeholder="e.g. user@example.com"
                {...register("email")}
                error={!!errors.email} helperText={errors.email?.message || "Mandatory field"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: isDark ? "#f97316" : "action.active", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="Enter your registered email address">
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
                placeholder="Enter password"
                {...register("password")}
                error={!!errors.password} helperText={errors.password?.message || "Mandatory field"}
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
                      <Tooltip title="Enter your account password">
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
                  boxShadow: isDark ? "0 4px 20px rgba(249,115,22,0.35)" : "0 4px 14px rgba(25,118,210,0.35)",
                  "&:hover": { transform: "translateY(-1px)" },
                  transition: "all 0.2s ease",
                }}
              >
                {loading ? <CircularProgress size={22} sx={{ color: isDark ? "#0f1117" : "#fff" }} /> : "Sign In"}
              </Button>
            </Stack>
          </form>

          <Divider sx={{ my: 3, borderColor: isDark ? "rgba(255,255,255,0.08)" : undefined }}>
            <Typography variant="caption" color="text.secondary">OR</Typography>
          </Divider>

          <Typography variant="body2" textAlign="center" color="text.secondary">
            Don't have an account?{" "}
            <Box
              component={Link} to="/register"
              sx={{
                color: isDark ? "#f97316" : "#1976d2", fontWeight: 700,
                textDecoration: "none", "&:hover": { textDecoration: "underline" },
              }}
            >
              Register here
            </Box>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

