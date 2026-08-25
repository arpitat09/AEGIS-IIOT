import { createTheme } from "@mui/material/styles";
import { colors } from "./colors";

const theme = createTheme({
  palette: {
    mode: "dark",

    primary: {
      main: colors.accent.primary,
      light: "#67E8F9",
      dark: "#0891B2",
      contrastText: "#070B14",
    },

    secondary: {
      main: colors.accent.secondary,
      light: "#60A5FA",
      dark: "#1D4ED8",
    },

    success: {
      main: colors.status.safe,
    },

    warning: {
      main: colors.status.warning,
    },

    error: {
      main: colors.status.critical,
    },

    info: {
      main: colors.status.info,
    },

    background: {
      default: colors.background.main,
      paper: colors.background.card,
    },

    text: {
      primary: colors.text.primary,
      secondary: colors.text.secondary,
    },

    divider: colors.border.muted,
  },

  typography: {
    fontFamily: [
      "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      "sans-serif",
    ].join(","),

    h1: {
      fontSize: "2.5rem",
      fontWeight: 800,
      letterSpacing: "-0.02em",
    },

    h2: {
      fontSize: "2rem",
      fontWeight: 700,
      letterSpacing: "-0.015em",
    },

    h3: {
      fontSize: "1.6rem",
      fontWeight: 700,
      letterSpacing: "-0.01em",
    },

    h4: {
      fontSize: "1.3rem",
      fontWeight: 600,
    },

    h5: {
      fontSize: "1.1rem",
      fontWeight: 600,
    },

    h6: {
      fontSize: "0.95rem",
      fontWeight: 600,
    },

    body1: {
      fontSize: "0.925rem",
      color: colors.text.primary,
    },

    body2: {
      fontSize: "0.85rem",
      color: colors.text.secondary,
    },

    caption: {
      fontSize: "0.75rem",
      color: colors.text.muted,
    },
  },

  shape: {
    borderRadius: 8,
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: colors.background.main,
          color: colors.text.primary,
          scrollbarColor: "#1E293B #070B14",
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            width: "6px",
            height: "6px",
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            borderRadius: "4px",
            backgroundColor: "#1E293B",
          },
          "&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track": {
            backgroundColor: "#070B14",
          },
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: colors.background.card,
          backgroundImage: "none",
          border: `1px solid ${colors.border.muted}`,
          borderRadius: 8,
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: colors.background.card,
          border: `1px solid ${colors.border.muted}`,
          borderRadius: 8,
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
          transition: "border-color 0.2s ease, transform 0.2s ease",
          "&:hover": {
            borderColor: "rgba(0, 212, 255, 0.3)",
          },
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          textTransform: "none",
          fontWeight: 600,
          letterSpacing: "0.01em",
        },
        containedPrimary: {
          backgroundColor: colors.accent.primary,
          color: "#070B14",
          "&:hover": {
            backgroundColor: "#38BDF8",
            boxShadow: `0 0 15px ${colors.accent.primaryGlow}`,
          },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 4,
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: colors.border.muted,
          padding: "10px 14px",
          fontSize: "0.85rem",
        },
        head: {
          backgroundColor: colors.background.secondary,
          color: colors.text.secondary,
          fontWeight: 700,
          fontSize: "0.75rem",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        },
      },
    },
  },
});

export default theme;
