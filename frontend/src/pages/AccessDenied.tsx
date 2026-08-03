import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function AccessDenied() {
  return (
    <Box
      sx={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        textAlign: "center", gap: 2, bgcolor: "background.default",
      }}
    >
      <Typography variant="h1" fontWeight={800} color="error" sx={{ fontSize: "6rem" }}>
        403
      </Typography>
      <Typography variant="h5" fontWeight={700}>Access Denied</Typography>
      <Typography color="text.secondary" maxWidth={400}>
        You don't have permission to view this page.
      </Typography>
      <Button component={Link} to="/login" variant="contained" color="error" sx={{ mt: 1, borderRadius: 2, fontWeight: 700 }}>
        Go to Login
      </Button>
    </Box>
  );
}
