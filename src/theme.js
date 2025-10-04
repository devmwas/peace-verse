import { createTheme } from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      // Used for main buttons, primary text, and accents
      main: "#FFC107", // A bright, contrasting yellow/gold for the dark background
    },
    secondary: {
      // Used for secondary actions/chips
      main: "#29B6F6", // A light blue
    },
    background: {
      // Dark background from the image
      default: "#121212",
      paper: "#1E1E1E", // Slightly lighter dark for cards/containers
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#B0B0B0", // Light grey for supporting text
    },
    success: {
      main: "#4CAF50", // Green for 'Support'
    },
    error: {
      main: "#F44336", // Red for 'Reject'
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none", // Keep text natural
        },
      },
    },
  },
});

export default darkTheme;
