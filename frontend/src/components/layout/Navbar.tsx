import {
  AppBar, Toolbar, Typography, Box, IconButton, Avatar,
  Menu, MenuItem, Divider, Chip, Tooltip,
} from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useThemeMode } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

import PublicIcon from "@mui/icons-material/Public";
import { Button } from "@mui/material";

export default function Navbar() {
  const { mode, toggleTheme } = useThemeMode();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isDark = mode === "dark";
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: isDark ? "#18181b" : "#fff",
        borderBottom: isDark ? "1px solid rgba(249,115,22,0.1)" : "1px solid #e2e8f0",
        color: "text.primary",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, sm: 3 } }}>
        <Typography variant="h6" fontWeight={700} sx={{ color: "text.primary" }}>
          Dashboard
        </Typography>

        <Box display="flex" alignItems="center" gap={1.5}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<PublicIcon />}
            onClick={() => navigate("/user")}
            sx={{
              borderRadius: 2,
              fontWeight: 700,
              fontSize: "0.8rem",
              borderColor: isDark ? "#f97316" : "#1976d2",
              color: isDark ? "#f97316" : "#1976d2",
              "&:hover": {
                bgcolor: isDark ? "rgba(245,245,245,0.12)" : "rgba(25,118,210,0.08)",
                borderColor: isDark ? "#f97316" : "#1976d2",
              },
            }}
          >
            Go to Website
          </Button>

          <Tooltip title={isDark ? "Light Mode" : "Dark Mode"}>
            <IconButton onClick={toggleTheme} size="small"
              sx={{ color: isDark ? "#fbbf24" : "#64748b" }}>
              {isDark ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Account">
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} size="small">
              <Avatar
                sx={{
                  width: 34, height: 34, fontSize: "0.875rem", fontWeight: 700,
                  background: isDark
                    ? "linear-gradient(135deg, #f97316, #fbbf24)"
                    : "linear-gradient(135deg, #1976d2, #42a5f5)",
                  color: isDark ? "#0f1117" : "#fff",
                }}
              >
                {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{ sx: { mt: 1, minWidth: 220, borderRadius: 2 } }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="body2" fontWeight={700}>{user?.name}</Typography>
          <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
          <Box mt={0.75}>
            <Chip
              icon={<PersonIcon sx={{ fontSize: "14px !important" }} />}
              label={user?.role}
              size="small"
              sx={{
                fontSize: "0.7rem", fontWeight: 700, height: 22,
                bgcolor: user?.role === "ADMIN" ? "rgba(239,68,68,0.1)" : "rgba(34,197,94,0.1)",
                color: user?.role === "ADMIN" ? "#ef4444" : "#22c55e",
              }}
            />
          </Box>
        </Box>
        <Divider />
        <MenuItem onClick={handleLogout} sx={{ gap: 1.5, py: 1.25, color: "error.main" }}>
          <LogoutIcon fontSize="small" />
          <Typography variant="body2" fontWeight={600}>Sign Out</Typography>
        </MenuItem>
      </Menu>
    </AppBar>
  );
}
