import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",

    primary: {
      main: "#2563EB",
    },

    secondary: {
      main: "#14B8A6",
    },

    success: {
      main: "#16A34A",
    },

    warning: {
      main: "#F59E0B",
    },

    error: {
      main: "#DC2626",
    },

    background: {
      default: "#030712",
      paper: "#111827",
    },

    text: {
      primary: "#F8FAFC",
      secondary: "#94A3B8",
    },
  },

  typography: {
    fontFamily: [
      "Poppins",
      "Inter",
      "Roboto",
      "sans-serif",
    ].join(","),

    h1: {
      fontSize: "3.5rem",
      fontWeight: 700,
    },

    h2: {
      fontSize: "2.6rem",
      fontWeight: 700,
    },

    h3: {
      fontSize: "2rem",
      fontWeight: 600,
    },

    h4: {
      fontSize: "1.6rem",
      fontWeight: 600,
    },

    h5: {
      fontSize: "1.3rem",
      fontWeight: 600,
    },

    h6: {
      fontSize: "1.1rem",
      fontWeight: 600,
    },

    body1: {
      fontSize: "1rem",
    },

    body2: {
      fontSize: "0.95rem",
      color: "#94A3B8",
    },
  },

  shape: {
    borderRadius: 16,
  },

  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: "#111827",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 0 25px rgba(37,99,235,0.08)",
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "#111827",
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: "none",
          fontWeight: 600,
          padding: "10px 22px",
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "rgba(17,24,39,0.8)",
          backdropFilter: "blur(14px)",
          boxShadow: "none",
        },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: "#020617",
          borderRight: "1px solid rgba(255,255,255,0.08)",
        },
      },
    },
  },
});

export default theme;
