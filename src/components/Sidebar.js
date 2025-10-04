import React, { useState } from "react";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Button,
} from "@mui/material";
import {
  BsBullseye,
  BsTrophy,
  BsShieldLock,
  BsMic,
  BsTranslate,
  BsJournal,
  BsQuestionCircle,
  BsGear,
} from "react-icons/bs";
import {
  MdAddCircle,
  MdOutlineRecordVoiceOver,
  MdSecurity,
} from "react-icons/md";

// Configuration Constants
const COLORS = {
  ACCENT_YELLOW: "#FBC02D",
};

// Define the navigation items
const primaryNavItems = [
  { name: "Polling", icon: <BsBullseye />, path: "/polling" },
  { name: "Hall of Fame", icon: <BsTrophy />, path: "/hall-of-fame" },
  { name: "Moderation", icon: <MdSecurity />, path: "/moderation" },
  { name: "Safe Spaces", icon: <BsShieldLock />, path: "/safe-spaces" },
  { name: "Radio", icon: <BsMic />, path: "/radio" },
  {
    name: "Voice Platform",
    icon: <MdOutlineRecordVoiceOver />,
    path: "/voice-platform",
  },
  { name: "Blog", icon: <BsJournal />, path: "/blog" },
];

const bottomNavItems = [
  { name: "Settings", icon: <BsGear />, path: "/settings" },
  { name: "Help & Support", icon: <BsQuestionCircle />, path: "/support" },
  { name: "Language", icon: <BsTranslate />, path: "/language" },
];

const Sidebar = ({ onNavLinkClick, activePath }) => {
  // State to manage the sidebar's expanded/collapsed status
  const [isExpanded, setIsExpanded] = useState(false); // Start collapsed for the compact view

  // Determine which item is currently selected
  const isNavLinkActive = (path) => activePath === path;

  // Use Tailwind classes for dynamic width (w-64 = expanded, w-20 = collapsed)
  const sidebarWidthClass = isExpanded ? "w-64" : "w-20";
  const collapseDuration = "duration-300";

  return (
    <Box
      // Handlers to toggle the state based on hover
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      component="nav"
      className={`${sidebarWidthClass} fixed top-0 left-0 h-full z-30 transition-width ${collapseDuration} ease-in-out`}
      sx={{
        bgcolor: "#1E1E1E",
        borderRight: "1px solid rgba(255, 255, 255, 0.05)",
        display: { xs: "none", md: "block" },
      }}
    >
      <Box
        sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column" }}
      >
        {/* Logo/Title Section (Always shows logo, text only when expanded) */}
        <Box sx={{ pb: 3, borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
          {/* --- Logo and Text Container --- */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              height: "40px",
              mb: 1,
              // Center logo when collapsed, align left when expanded
              justifyContent: isExpanded ? "flex-start" : "center",
            }}
          >
            {/* 1. Logo (Always displayed) */}
            <img
              src="/favicon.ico"
              alt="Amani360 Logo"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "4px",
                // Add margin when expanded to separate logo from text
                marginRight: isExpanded ? "12px" : "0",
                transition: "margin-right 0.3s",
              }}
            />

            {/* 2. Title and Subtitle (Only displayed when expanded) */}
            {isExpanded && (
              <Box sx={{ whiteSpace: "nowrap", overflow: "hidden" }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: COLORS.ACCENT_YELLOW,
                  }}
                >
                  Amani360
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Peacebuilding Platform
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* Propose a Bill Button (Primary CTA - Hidden when collapsed) */}
        <Box sx={{ py: 3, flexShrink: 0 }}>
          {isExpanded && (
            <Button
              startIcon={<MdAddCircle />}
              variant="contained"
              fullWidth
              sx={{
                py: 1.5,
                fontWeight: "bold",
                textTransform: "uppercase",
                backgroundColor: COLORS.ACCENT_YELLOW,
                color: "black",
                "&:hover": {
                  backgroundColor: COLORS.ACCENT_YELLOW,
                  opacity: 0.9,
                },
              }}
              onClick={() => console.log("Propose Bill clicked")}
            >
              Propose a Bill
            </Button>
          )}
        </Box>

        {/* Primary Navigation Links (Scrollable) */}
        <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
          <List disablePadding>
            {primaryNavItems.map((item) => (
              <ListItemButton
                key={item.name}
                selected={isNavLinkActive(item.path)}
                onClick={() => onNavLinkClick(item.path)}
                sx={{
                  borderRadius: "8px",
                  mb: 0.5,
                  // Center icons when collapsed
                  justifyContent: isExpanded ? "initial" : "center",
                  px: isExpanded ? 2 : 1.5, // Reduced padding when collapsed
                  "&.Mui-selected": {
                    backgroundColor: `${COLORS.ACCENT_YELLOW}20`,
                    "&:hover": {
                      backgroundColor: `${COLORS.ACCENT_YELLOW}30`,
                    },
                  },
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    // Ensure min width is consistent for icons
                    minWidth: isExpanded ? 40 : 50,
                    justifyContent: "center",
                    color: isNavLinkActive(item.path)
                      ? COLORS.ACCENT_YELLOW
                      : "text.secondary",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {/* Conditionally render text */}
                {isExpanded && (
                  <ListItemText
                    primary={item.name}
                    primaryTypographyProps={{
                      fontWeight: 500,
                      color: isNavLinkActive(item.path)
                        ? COLORS.ACCENT_YELLOW
                        : "text.primary",
                    }}
                  />
                )}
              </ListItemButton>
            ))}
          </List>
        </Box>

        {/* Bottom Navigation Links (Fixed) */}
        <Box
          sx={{
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            pt: 2,
            flexShrink: 0,
          }}
        >
          <List disablePadding>
            {bottomNavItems.map((item) => (
              <ListItemButton
                key={item.name}
                selected={isNavLinkActive(item.path)}
                onClick={() => onNavLinkClick(item.path)}
                sx={{
                  borderRadius: "8px",
                  mb: 0.5,
                  // Center icons when collapsed
                  justifyContent: isExpanded ? "initial" : "center",
                  px: isExpanded ? 2 : 1.5, // Reduced padding when collapsed
                  "&.Mui-selected": {
                    backgroundColor: `${COLORS.ACCENT_YELLOW}20`,
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: isExpanded ? 40 : 50,
                    justifyContent: "center",
                    color: isNavLinkActive(item.path)
                      ? COLORS.ACCENT_YELLOW
                      : "text.secondary",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {/* Conditionally render text */}
                {isExpanded && (
                  <ListItemText
                    primary={item.name}
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                )}
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;
