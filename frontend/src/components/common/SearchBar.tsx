import { TextField } from "@mui/material";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = "Search" }: SearchBarProps) {
  return (
    <TextField
      fullWidth
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      variant="outlined"
      size="small"
      sx={{ maxWidth: 360 }}
    />
  );
}
