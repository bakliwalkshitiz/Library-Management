import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NotFound() {
  const { isAdmin, isLoggedIn } = useAuth();
  const home = isAdmin ? "/admin" : isLoggedIn ? "/user" : "/login";

  return (
    <Box
      sx={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        textAlign: "center", gap: 2, bgcolor: "background.default",
      }}
    >
      <Typography variant="h1" fontWeight={800} color="primary" sx={{ fontSize: "6rem" }}>
        404
      </Typography>
      <Typography variant="h5" fontWeight={700}>Page Not Found</Typography>
      <Typography color="text.secondary" maxWidth={400}>
        The page you're looking for doesn't exist or has been moved.
      </Typography>
      <Button component={Link} to={home} variant="contained" sx={{ mt: 1, borderRadius: 2, fontWeight: 700 }}>
        Go Home
      </Button>
    </Box>
  );
}
