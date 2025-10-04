import React, { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";

// Import the Sidebar, Polling Component, and the NEW MobileNav
import Sidebar from "./components/Sidebar";
import BillPolling from "./components/BillPolling";
import MobileNav from "./components/MobileNav"; // <-- NEW IMPORT

// --- Custom Dark Theme Definition (Same as before) ---
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#FBC02D",
    },
    secondary: {
      main: "#29B6F6",
    },
    background: {
      default: "#121212",
      paper: "#1E1E1E",
    },
    text: {
      primary: "#E0E0E0",
      secondary: "#B0B0B0",
    },
    error: {
      main: "#D32F2F",
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#121212",
        },
      },
    },
  },
});

// --- Main Application Component ---
function App() {
  // State to track the active page, default to Polling as implemented
  const [activePath, setActivePath] = useState("/polling");

  // Controls the sidebar's expanded state
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  // Sidebar width constants
  const sidebarExpandedWidth = "256px"; // Tailwind w-64
  const sidebarCollapsedWidth = "80px"; // Tailwind w-20

  // Calculate dynamic margin for the main content area
  const mainContentMargin = isSidebarExpanded
    ? sidebarExpandedWidth
    : sidebarCollapsedWidth;

  // Simple placeholder to render the current page content
  const renderContent = () => {
    // Only Polling is implemented, so we render it regardless of state
    if (activePath === "/polling") {
      // NOTE: Using the component name BillPolling as referenced by the user
      return <BillPolling />;
    }

    // Placeholder for other pages
    return (
      <Box
        sx={{
          p: 5,
          color: "white",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h5" color="text.primary">
          Content for {activePath.replace("/", "").toUpperCase()} Page
        </Typography>
      </Box>
    );
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        {/* 1. Desktop Sidebar Component (Fixed position) */}
        <Sidebar
          onNavLinkClick={setActivePath}
          activePath={activePath}
          isExpanded={isSidebarExpanded}
          setIsExpanded={setIsSidebarExpanded}
        />

        {/* 2. Main Content Area (Pushed over by the sidebar's width) */}
        <Box
          component="main"
          // Add pb-16 (Tailwind padding-bottom: 4rem) to account for the fixed MobileNav height
          className="flex-grow p-0 pb-16"
          sx={{
            // DYNAMIC MARGIN (Desktop)
            marginLeft: { md: mainContentMargin },
            width: { md: `calc(100% - ${mainContentMargin})` },
            transition: "margin-left 300ms ease-in-out",
          }}
        >
          {renderContent()}
        </Box>

        {/* 3. Mobile Navigation (Fixed bottom bar) */}
        <MobileNav onNavLinkClick={setActivePath} activePath={activePath} />
      </Box>
    </ThemeProvider>
  );
}

export default App;
