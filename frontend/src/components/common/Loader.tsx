import { Box, CircularProgress, Typography } from "@mui/material";

interface LoaderProps {
  message?: string;
  minHeight?: number | string;
}

export default function Loader({ message = "Loading...", minHeight = 220 }: LoaderProps) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight={minHeight}
      gap={1.5}
    >
      <CircularProgress />
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
}
