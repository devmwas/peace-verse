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
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import { User, LogOut } from "lucide-react";
import {
  BsBullseye,
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

import { useAuth } from "./Auth"; // 🔑 use the auth provider

const COLORS = {
  ACCENT_YELLOW: "#FBC02D",
};

// All navigation items (mirrors Sidebar structure)
const allNavItems = [
  { name: "Polling", icon: <BsBullseye />, path: "/polling" },
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
  const { user, isAuthenticated, signOutUser } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const getLastName = (name) => {
    if (!name) return "";
    const parts = name.trim().split(" ");
    return parts.length > 1 ? parts[parts.length - 1] : parts[0];
  };

  // Items visible on the fixed bottom bar (Profile is now first)
  const bottomBarItems = [
    {
      name: "Profile",
      icon:
        isAuthenticated && user?.photoURL ? (
          <img
            src={user.photoURL}
            alt="Profile"
            style={{ width: 24, height: 24, borderRadius: "50%" }}
          />
        ) : (
          <User size={18} style={{ marginRight: 8 }} />
        ),
      path: "/profile",
      isProfile: true,
    },
    { name: "Polling", icon: <BsBullseye />, path: "/polling" },
    { name: "Propose", icon: <MdAddCircle />, path: "/propose", isCta: true },
    { name: "Radio", icon: <BsMic />, path: "/radio" },
    { name: "More", icon: <BsList />, path: "/more", isMenu: true },
  ];

  const handleItemClick = (path, isMenu, isProfile) => {
    if (isMenu) {
      setIsDrawerOpen(true);
    } else if (isProfile) {
      handleMenuOpen({ currentTarget: document.body }); // open profile menu
    } else if (path === "/propose") {
      console.log("Propose Bill Clicked from Mobile Nav");
    } else {
      onNavLinkClick(path);
      setIsDrawerOpen(false); // auto-close drawer
    }
  };

  const drawerList = () => (
    <Box
      sx={{
        width: "100vw",
        bgcolor: "background.paper",
        height: "85vh",
        p: 2,
        overflowY: "auto",
      }}
      role="presentation"
    >
      {/* Logo and Title */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 3,
          pb: 1,
        }}
      >
        <img
          src="/favicon.ico"
          alt="Amani360 Logo"
          style={{ width: 40, height: 40, marginBottom: 8 }}
        />
        <Typography
          variant="h6"
          sx={{ color: COLORS.ACCENT_YELLOW, fontWeight: 700 }}
        >
          Amani360
        </Typography>
      </Box>

      {/* Profile avatar + name (stacked vertically, centered) */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 3,
        }}
      >
        {isAuthenticated && user?.photoURL ? (
          <img
            src={user.photoURL}
            alt="Profile"
            style={{
              width: 50,
              height: 50,
              borderRadius: "50%",
              marginBottom: 8,
            }}
          />
        ) : (
          <User size={18} style={{ marginRight: 8 }} />
        )}
        <Typography variant="body1" fontWeight={600}>
          {isAuthenticated ? getLastName(user.displayName) : "Anonymous"}
        </Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />

      {/* Full list of nav items */}
      <List
        sx={{
          maxWidth: 300,
          margin: "0 auto",
          width: "100%",
          paddingBottom: "60px",
        }}
      >
        {allNavItems.map((item) => (
          <ListItemButton
            key={item.name}
            selected={activePath === item.path}
            onClick={() => {
              onNavLinkClick(item.path);
              setIsDrawerOpen(false); // auto-close drawer
            }}
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
    <Box className="fixed bottom-0 left-0 right-0 z-[1000] md:hidden">
      {/* Bottom bar */}
      <BottomNavigation
        value={activePath}
        onChange={(event, newValue) => {
          const selectedItem = bottomBarItems.find(
            (item) => item.path === newValue
          );
          if (selectedItem) {
            handleItemClick(
              selectedItem.path,
              selectedItem.isMenu,
              selectedItem.isProfile
            );
          }
        }}
        showLabels
        sx={{
          width: "100%",
          bgcolor: "background.paper",
          borderTop: `1px solid ${COLORS.ACCENT_YELLOW}20`,
        }}
      >
        {bottomBarItems.map((item) => (
          <BottomNavigationAction
            key={item.path}
            label={item.name}
            value={item.path}
            icon={item.icon}
            sx={{
              pt: 1,
              color:
                item.path === activePath
                  ? COLORS.ACCENT_YELLOW
                  : "text.secondary",
              "&.Mui-selected": {
                color:
                  item.path === activePath ? COLORS.ACCENT_YELLOW : undefined,
              },
              "& .MuiBottomNavigationAction-label": { marginTop: "4px" },
            }}
            onClick={(e) => {
              if (item.isMenu || item.isCta || item.isProfile) {
                e.preventDefault();
                handleItemClick(item.path, item.isMenu, item.isProfile);
              } else {
                onNavLinkClick(item.path);
              }
            }}
          />
        ))}
      </BottomNavigation>

      {/* Drawer */}
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

      {/* Profile Dropdown Menu (same as Sidebar) */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        transformOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Signed in as
          </Typography>
          <Typography variant="body2" fontWeight={600}>
            {isAuthenticated ? getLastName(user.displayName) : "Anonymous"}
          </Typography>
        </Box>
        <Divider />

        {isAuthenticated ? (
          <>
            <MenuItem
              onClick={() => {
                handleMenuClose();
                onNavLinkClick("/profile");
              }}
            >
              <User size={18} style={{ marginRight: 8 }} /> Profile
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleMenuClose();
                signOutUser();
              }}
            >
              <LogOut size={18} style={{ marginRight: 8 }} /> Sign Out
            </MenuItem>
          </>
        ) : (
          <MenuItem
            onClick={() => {
              handleMenuClose();
              onNavLinkClick("/auth");
            }}
          >
            <User size={18} style={{ marginRight: 8 }} /> Login
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            handleMenuClose();
            onNavLinkClick("/settings");
          }}
        >
          <BsGear style={{ marginRight: 8 }} /> Settings
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            onNavLinkClick("/help");
          }}
        >
          <BsQuestionCircle style={{ marginRight: 8 }} /> Help & Support
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            onNavLinkClick("/language");
          }}
        >
          <BsTranslate style={{ marginRight: 8 }} /> Language
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default MobileNav;
