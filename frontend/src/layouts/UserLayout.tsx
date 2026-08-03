import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import {
  AppBar, Toolbar, Typography, Box, IconButton, Avatar,
  Tabs, Tab, Menu, MenuItem, Divider, Chip, Tooltip, Button,
} from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { useState } from "react";
import { useThemeMode } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const navTabs = [
  { label: "Home", path: "/user" },
  { label: "Books", path: "/user/browse" },
  { label: "My Books", path: "/user/my-books" },
  { label: "Profile", path: "/user/profile" },
];

export default function UserLayout() {
  const { mode, toggleTheme } = useThemeMode();
  const { user, logout, isLoggedIn, isStaff, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isDark = mode === "dark";
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const currentTab = navTabs.findIndex((t) =>
    t.path === "/user" ? pathname === "/user" : pathname.startsWith(t.path)
  );

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
    setAnchorEl(null);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: isDark ? "#18181b" : "#fff",
          borderBottom: isDark ? "1px solid rgba(249,115,22,0.1)" : "1px solid #e2e8f0",
          color: "text.primary",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, sm: 3 } }}>
          {/* Logo */}
          <Box display="flex" alignItems="center" gap={1.5}>
            <Box
              sx={{
                width: 32, height: 32, borderRadius: 1.5,
                background: isDark
                  ? "linear-gradient(135deg, #f97316, #fbbf24)"
                  : "linear-gradient(135deg, #1976d2, #42a5f5)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <LocalLibraryIcon sx={{ fontSize: 18, color: isDark ? "#0f1117" : "#fff" }} />
            </Box>
            <Typography variant="subtitle1" fontWeight={800} sx={{ color: "text.primary" }}>
              LibraryMS
            </Typography>
          </Box>

          {/* Tabs */}
          <Tabs
            value={currentTab === -1 ? 0 : currentTab}
            sx={{
              "& .MuiTab-root": { fontWeight: 600, fontSize: "0.875rem", minHeight: 48 },
              "& .MuiTabs-indicator": {
                bgcolor: isDark ? "#f97316" : "#1976d2",
              },
              "& .Mui-selected": { color: isDark ? "#f97316 !important" : "#1976d2 !important" },
            }}
          >
            {navTabs.map((tab) => (
              <Tab key={tab.path} label={tab.label} component={Link} to={tab.path} />
            ))}
          </Tabs>

          {/* Right actions */}
          <Box display="flex" alignItems="center" gap={1.5}>
            {isStaff && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<DashboardIcon />}
                onClick={() => navigate("/admin")}
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
                {isAdmin ? "Admin Panel" : "Publisher Panel"}
              </Button>
            )}

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
      </AppBar>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{ sx: { mt: 1, minWidth: 220, borderRadius: 2 } }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="body2" fontWeight={700}>{isLoggedIn ? user?.name : "Guest"}</Typography>
          <Typography variant="caption" color="text.secondary">{isLoggedIn ? user?.email : "Browsing without an account"}</Typography>
          <Box mt={0.75}>
            <Chip
              icon={<PersonIcon sx={{ fontSize: "14px !important" }} />}
              label={isLoggedIn ? user?.role ?? "USER" : "GUEST"}
              size="small"
              sx={{
                fontSize: "0.7rem", fontWeight: 700, height: 22,
                bgcolor: !isLoggedIn ? "rgba(148,163,184,0.15)"
                  : user?.role === "ADMIN" ? "rgba(239,68,68,0.1)"
                  : user?.role === "PUBLISHER" ? "rgba(249,115,22,0.1)"
                  : "rgba(34,197,94,0.1)",
                color: !isLoggedIn ? "#64748b"
                  : user?.role === "ADMIN" ? "#ef4444"
                  : user?.role === "PUBLISHER" ? "#f97316"
                  : "#22c55e",
              }}
            />
          </Box>
        </Box>
        <Divider />
        {isStaff && (
          <MenuItem onClick={() => navigate("/admin")} sx={{ gap: 1.5, py: 1.25 }}>
            <DashboardIcon fontSize="small" sx={{ color: "#f97316" }} />
            <Typography variant="body2" fontWeight={600}>
              {isAdmin ? "Admin Panel" : "Publisher Panel"}
            </Typography>
          </MenuItem>
        )}
        {isLoggedIn ? (
          <MenuItem onClick={handleLogout} sx={{ gap: 1.5, py: 1.25, color: "error.main" }}>
            <LogoutIcon fontSize="small" />
            <Typography variant="body2" fontWeight={600}>Sign Out</Typography>
          </MenuItem>
        ) : (
          <MenuItem onClick={() => navigate("/login")} sx={{ gap: 1.5, py: 1.25 }}>
            <PersonIcon fontSize="small" />
            <Typography variant="body2" fontWeight={600}>Sign In</Typography>
          </MenuItem>
        )}
      </Menu>

      <Box component="main" sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: "auto" }}>
        <Outlet />
      </Box>
    </Box>
  );
}
