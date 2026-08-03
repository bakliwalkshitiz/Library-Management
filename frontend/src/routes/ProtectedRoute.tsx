import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

interface Props {
  children: React.ReactNode;
  requireAdmin?: boolean;      // admin OR publisher — the management panel
  requireSuperAdmin?: boolean; // admin only — dashboard, users
}

export default function ProtectedRoute({ children, requireAdmin = false, requireSuperAdmin = false }: Props) {
  const { isLoggedIn, isAdmin, isStaff, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      toast.error("Please login to access this content");
    }
  }, [isLoading, isLoggedIn]);

  // Wait until localStorage is read — prevents false redirect
  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
        }}
      >
        <CircularProgress sx={{ color: "#f97316" }} />
      </Box>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (requireSuperAdmin && !isAdmin) {
    return <Navigate to="/403" replace />;
  }

  if (requireAdmin && !isStaff) {
    return <Navigate to="/403" replace />;
  }

  return <>{children}</>;
}
