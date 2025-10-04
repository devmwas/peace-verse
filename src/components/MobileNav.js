import React, { useState } from "react";
import {
  Box,
  BottomNavigation,
  BottomNavigationAction,
  SwipeableDrawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
// --- CORRECTED REACT ICON IMPORTS ---
// Using BsTrophyFill for a more impactful visual
import {
  BsBullseye,
  BsTrophy,
  BsMic,
  BsList,
  BsShieldLock,
  BsJournal,
  BsGear,
  BsQuestionCircle,
  BsTranslate,
  BsTrophyFill,
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

// All navigation items (mirrors Sidebar structure)
const allNavItems = [
  { name: "Polling", icon: <BsBullseye />, path: "/polling" },
  // Use the full name in the detailed menu
  { name: "Hall of Fame", icon: <BsTrophyFill />, path: "/hall-of-fame" },
  { name: "Moderation", icon: <MdSecurity />, path: "/moderation" },
  { name: "Safe Spaces", icon: <BsShieldLock />, path: "/safe-spaces" },
  { name: "Radio", icon: <BsMic />, path: "/radio" },
  {
    name: "Voice Platform",
    icon: <MdOutlineRecordVoiceOver />,
    path: "/voice-platform",
  },
  { name: "Blog", icon: <BsJournal />, path: "/blog" },
  { name: "Settings", icon: <BsGear />, path: "/settings" },
  { name: "Help & Support", icon: <BsQuestionCircle />, path: "/support" },
  { name: "Language", icon: <BsTranslate />, path: "/language" },
];

const MobileNav = ({ onNavLinkClick, activePath }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Items visible on the fixed bottom bar (Max 5 for usability)
  const bottomBarItems = [
    { name: "Polling", icon: <BsBullseye />, path: "/polling" },
    // Shortened label to 'Winners' for mobile balance
    { name: "Winners", icon: <BsTrophyFill />, path: "/hall-of-fame" },
    { name: "Propose", icon: <MdAddCircle />, path: "/propose", isCta: true },
    { name: "Radio", icon: <BsMic />, path: "/radio" },
    { name: "More", icon: <BsList />, path: "/more", isMenu: true },
  ];

  const handleItemClick = (path, isMenu) => {
    if (isMenu) {
      setIsDrawerOpen(true);
    } else if (path === "/propose") {
      console.log("Propose Bill Clicked from Mobile Nav");
      // In a real app, this would open a modal or navigate to a submission form
    } else {
      onNavLinkClick(path);
      setIsDrawerOpen(false);
    }
  };

  const drawerList = () => (
    <Box
      // Full width and dynamic height (85vh)
      sx={{
        width: "100vw",
        bgcolor: "background.paper",
        height: "85vh",
        p: 2,
        overflowY: "auto", // Ensure list is scrollable if needed
      }}
      role="presentation"
      onClick={() => setIsDrawerOpen(false)}
      onKeyDown={() => setIsDrawerOpen(false)}
    >
      {/* --- Logo and Title Header (Centered) --- */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 3,
          pb: 1,
        }}
      >
        {/* Logo */}
        <img
          src="/favicon.ico"
          alt="Amani360 Logo"
          style={{ width: "40px", height: "40px", marginBottom: "8px" }}
        />
        <Typography
          variant="h6"
          sx={{ color: COLORS.ACCENT_YELLOW, fontWeight: 700 }}
        >
          Amani360
        </Typography>
      </Box>

      {/* --- Navigation List --- */}
      <List
        sx={{
          // Center the list content horizontally
          maxWidth: "300px",
          margin: "0 auto",
          width: "100%",
          // *** FIX: Add padding-bottom to ensure the last link clears the BottomNavigation bar ***
          paddingBottom: "60px",
        }}
      >
        {allNavItems.map((item) => (
          <ListItemButton
            key={item.name}
            selected={activePath === item.path}
            onClick={() => onNavLinkClick(item.path)}
            sx={{
              borderRadius: "8px",
              "&.Mui-selected": {
                backgroundColor: `${COLORS.ACCENT_YELLOW}20`,
                "&:hover": { backgroundColor: `${COLORS.ACCENT_YELLOW}30` },
              },
            }}
          >
            <ListItemIcon
              sx={{
                color:
                  activePath === item.path
                    ? COLORS.ACCENT_YELLOW
                    : "text.secondary",
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.name}
              primaryTypographyProps={{
                color:
                  activePath === item.path
                    ? COLORS.ACCENT_YELLOW
                    : "text.primary",
                fontWeight: 500,
              }}
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    // Hides the component on medium screens and up (md:hidden) and fixes it to the bottom.
    <Box className="fixed bottom-0 left-0 right-0 z-[1000] md:hidden">
      {/* --- Fixed Bottom Navigation Bar --- */}
      <BottomNavigation
        value={activePath}
        onChange={(event, newValue) => {
          const selectedItem = bottomBarItems.find(
            (item) => item.path === newValue
          );
          if (selectedItem) {
            handleItemClick(selectedItem.path, selectedItem.isMenu);
          }
        }}
        showLabels
        sx={{
          width: "100%",
          bgcolor: "background.paper",
          borderTop: `1px solid ${COLORS.ACCENT_YELLOW}20`, // This is the faint divider for the bottom bar itself
        }}
      >
        {bottomBarItems.map((item) => (
          <BottomNavigationAction
            key={item.path}
            label={item.name}
            value={item.path}
            icon={item.icon}
            sx={{
              pt: 1, // Add vertical spacing
              color:
                item.path === activePath
                  ? COLORS.ACCENT_YELLOW
                  : "text.secondary",
              "&.Mui-selected": {
                color:
                  item.path === activePath ? COLORS.ACCENT_YELLOW : undefined,
              },
              // Overriding MUI's default styling for better icon-text spacing
              "& .MuiBottomNavigationAction-label": {
                marginTop: "4px", // Control space below the icon
              },
            }}
            onClick={(e) => {
              if (item.isMenu || item.isCta) {
                e.preventDefault();
                handleItemClick(item.path, item.isMenu);
              } else {
                onNavLinkClick(item.path);
              }
            }}
          />
        ))}
      </BottomNavigation>

      {/* --- Mobile Drawer (Slide-up menu) --- */}
      <SwipeableDrawer
        anchor="bottom"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpen={() => setIsDrawerOpen(true)}
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: "none",
            borderRadius: "12px 12px 0 0",
            bgcolor: "background.paper",
          },
        }}
      >
        {drawerList()}
      </SwipeableDrawer>
    </Box>
  );
};

export default MobileNav;
