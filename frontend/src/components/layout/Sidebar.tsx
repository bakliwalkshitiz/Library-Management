import { useNavigate, useLocation } from "react-router-dom";
import {
  Box, List, ListItemButton, ListItemIcon, ListItemText,
  Typography, Tooltip, Divider,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PersonIcon from "@mui/icons-material/Person";
import CategoryIcon from "@mui/icons-material/Category";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import GroupIcon from "@mui/icons-material/Group";
import SettingsIcon from "@mui/icons-material/Settings";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import { useThemeMode } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

import PublicIcon from "@mui/icons-material/Public";

const sharedItems = [
  { label: "Dashboard", icon: <DashboardIcon />, path: "/admin" },
  { label: "Books", icon: <MenuBookIcon />, path: "/admin/books" },
  { label: "Authors", icon: <PersonIcon />, path: "/admin/authors" },
  { label: "Categories", icon: <CategoryIcon />, path: "/admin/categories" },
  { label: "Borrow Records", icon: <SwapHorizIcon />, path: "/admin/borrow" },
];
const adminOnlyBottomItems = [
  { label: "Users", icon: <GroupIcon />, path: "/admin/users" },
];
const settingsItem = { label: "Settings", icon: <SettingsIcon />, path: "/admin/settings" };

export default function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { mode } = useThemeMode();
  const { isAdmin } = useAuth();
  const isDark = mode === "dark";

  const navItems = [
    ...sharedItems,
    ...(isAdmin ? adminOnlyBottomItems : []),
    settingsItem,
  ];

  const isActive = (path: string) =>
    path === "/admin" ? pathname === "/admin" : pathname.startsWith(path);

  return (
    <Box
      sx={{
        width: 240,
        minHeight: "100vh",
        bgcolor: isDark ? "#18181b" : "#1e293b",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        borderRight: isDark ? "1px solid rgba(249,115,22,0.1)" : "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Logo */}
      <Box sx={{ p: 3, display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box
          sx={{
            width: 36, height: 36, borderRadius: 2,
            background: "linear-gradient(135deg, #f97316, #fbbf24)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <LocalLibraryIcon sx={{ fontSize: 20, color: "#0f1117" }} />
        </Box>
        <Box>
          <Typography variant="body1" fontWeight={800} sx={{ color: "#fff", lineHeight: 1.1 }}>
            LibraryMS
          </Typography>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.4)" }}>
            {isAdmin ? "Admin Panel" : "Publisher Panel"}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.06)" }} />

      <Typography
        variant="caption"
        sx={{ color: "rgba(255,255,255,0.35)", px: 3, pt: 2.5, pb: 1, fontWeight: 700, letterSpacing: 1 }}
      >
        NAVIGATION
      </Typography>

      <List sx={{ px: 1.5, flex: 1 }}>
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Tooltip title={item.label} placement="right" key={item.path}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 2, mb: 0.5, py: 1.2,
                  bgcolor: active ? "rgba(249,115,22,0.18)" : "transparent",
                  border: active ? "1px solid rgba(249,115,22,0.3)" : "1px solid transparent",
                  "&:hover": { bgcolor: isDark ? "rgba(245,245,245,0.12)" : "rgba(249,115,22,0.1)" },
                  transition: "all 0.15s ease",
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 38,
                    color: active ? "#f97316" : "rgba(255,255,255,0.45)",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: "0.875rem",
                    fontWeight: active ? 700 : 500,
                    color: active ? "#fff" : "rgba(255,255,255,0.55)",
                  }}
                />
              </ListItemButton>
            </Tooltip>
          );
        })}

        <Divider sx={{ my: 1.5, borderColor: "rgba(255,255,255,0.08)" }} />

        <Tooltip title="Go to Website" placement="right">
          <ListItemButton
            onClick={() => navigate("/user")}
            sx={{
              borderRadius: 2, py: 1.2,
              bgcolor: "rgba(249,115,22,0.1)",
              border: "1px dashed rgba(249,115,22,0.3)",
              "&:hover": { bgcolor: isDark ? "rgba(245,245,245,0.15)" : "rgba(249,115,22,0.2)" },
              transition: "all 0.15s ease",
            }}
          >
            <ListItemIcon sx={{ minWidth: 38, color: "#f97316" }}>
              <PublicIcon />
            </ListItemIcon>
            <ListItemText
              primary="Go to Website"
              primaryTypographyProps={{
                fontSize: "0.875rem",
                fontWeight: 700,
                color: "#f97316",
              }}
            />
          </ListItemButton>
        </Tooltip>
      </List>
    </Box>
  );
}
