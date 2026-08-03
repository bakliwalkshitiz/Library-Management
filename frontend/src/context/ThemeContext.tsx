import { createContext, useContext, useState, useMemo } from "react";
import type { ReactNode } from "react";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";

type Mode = "light" | "dark";

interface ThemeModeContextType {
  mode: Mode;
  toggleTheme: () => void;
}

const ThemeModeContext = createContext<ThemeModeContextType | null>(null);

export function ThemeProviderWrapper({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>(() => {
    return (localStorage.getItem("theme") as Mode) ?? "dark";
  });

  const toggleTheme = () => {
    setMode((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem("theme", next);
      return next;
    });
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "dark"
            ? {
                primary: { main: "#f97316" },
                background: { default: "#18181b", paper: "#27272a" },
                action: {
                  hover: "rgba(245, 245, 245, 0.12)",
                  selected: "rgba(245, 245, 245, 0.18)",
                },
              }
            : {
                primary: { main: "#1976d2" },
                background: { default: "#f8fafc", paper: "#ffffff" },
              }),
        },
        typography: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        },
        components: {
          MuiCard: {
            styleOverrides: {
              root: {
                backgroundImage: "none",
                ...(mode === "dark" && {
                  "&:hover": {
                    borderColor: "rgba(245, 245, 245, 0.25)",
                  },
                }),
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: "none",
              },
            },
          },
          MuiListItemButton: {
            styleOverrides: {
              root: {
                ...(mode === "dark" && {
                  "&:hover": {
                    backgroundColor: "rgba(245, 245, 245, 0.12)",
                  },
                }),
              },
            },
          },
          MuiTableRow: {
            styleOverrides: {
              root: {
                ...(mode === "dark" && {
                  "&.MuiTableRow-hover:hover": {
                    backgroundColor: "rgba(245, 245, 245, 0.08)",
                  },
                }),
              },
            },
          },
          MuiIconButton: {
            styleOverrides: {
              root: {
                ...(mode === "dark" && {
                  "&:hover": {
                    backgroundColor: "rgba(245, 245, 245, 0.12)",
                  },
                }),
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ThemeModeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode() {
  const ctx = useContext(ThemeModeContext);
  if (!ctx) throw new Error("useThemeMode must be used within ThemeProviderWrapper");
  return ctx;
}
