import React, { useState } from "react";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Button,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
// icon for anonymous
import { LogOut, User } from "lucide-react";
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

// For redirecting users to the auth component to sign in
import { useAuth } from "./Auth";

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

const Sidebar = ({ onNavLinkClick, activePath }) => {
  const { user, isAuthenticated, signOutUser } = useAuth(); // 🔑 get auth state
  const [isExpanded, setIsExpanded] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const isNavLinkActive = (path) => activePath === path;
  const sidebarWidthClass = isExpanded ? "w-64" : "w-20";
  const collapseDuration = "duration-300";

  // Extract last name from displayName
  const getLastName = (name) => {
    if (!name) return "";
    const parts = name.trim().split(" ");
    return parts.length > 1 ? parts[parts.length - 1] : parts[0];
  };

  // Handle profile menu open/close
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <Box
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
        {/* Logo/Title */}
        <Box sx={{ pb: 3, borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              height: "40px",
              mb: 1,
              justifyContent: isExpanded ? "flex-start" : "center",
            }}
          >
            <img
              src="/favicon.ico"
              alt="Amani360 Logo"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "4px",
                marginRight: isExpanded ? "12px" : "0",
                transition: "margin-right 0.3s",
              }}
            />
            {isExpanded && (
              <Box sx={{ whiteSpace: "nowrap", overflow: "hidden" }}>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, color: COLORS.ACCENT_YELLOW }}
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

        {/* Propose a Bill Button */}
        <Box sx={{ py: 3, flexShrink: 0 }}>
          {isExpanded && (
            <Button
              startIcon={<MdAddCircle />}
              variant="text"
              fullWidth
              sx={{
                py: 1.5,
                fontWeight: "bold",
                textTransform: "uppercase",
                // backgroundColor: COLORS.ACCENT_YELLOW,
                // color: "black",
                "&:hover": {
                  // backgroundColor: COLORS.ACCENT_YELLOW,
                  opacity: 0.9,
                },
              }}
              onClick={() => console.log("Propose Bill clicked")}
            >
              Propose a Bill
            </Button>
          )}
        </Box>

        {/* Primary Navigation */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            /* ✅ Custom dark scrollbar */
            "&::-webkit-scrollbar": {
              width: 8,
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#111",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#444",
              borderRadius: 8,
              "&:hover": {
                backgroundColor: "#666",
              },
            },
            /* Optional: for Firefox */
            scrollbarWidth: "thin",
            scrollbarColor: "#444 #111",
          }}
        >
          <List disablePadding>
            {primaryNavItems.map((item) => (
              <ListItemButton
                key={item.name}
                selected={isNavLinkActive(item.path)}
                onClick={() => onNavLinkClick(item.path)}
                sx={{
                  borderRadius: "8px",
                  mb: 0.5,
                  justifyContent: isExpanded ? "initial" : "center",
                  px: isExpanded ? 2 : 1.5,
                  "&.Mui-selected": {
                    backgroundColor: `${COLORS.ACCENT_YELLOW}20`,
                    "&:hover": { backgroundColor: `${COLORS.ACCENT_YELLOW}30` },
                  },
                  "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.05)" },
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

        {/* Profile / Auth Section */}
        <Box
          sx={{
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            pt: 2,
            flexShrink: 0,
          }}
        >
          <List disablePadding>
            <ListItemButton
              onClick={handleMenuOpen}
              sx={{
                borderRadius: "8px",
                mb: 0.5,
                justifyContent: isExpanded ? "initial" : "center",
                px: isExpanded ? 2 : 1.5,
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.05)" },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: isExpanded ? 40 : 50,
                  justifyContent: "center",
                }}
              >
                {isAuthenticated && user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <User size={18} style={{ marginRight: 8 }} />
                )}
              </ListItemIcon>
              {isExpanded && (
                <ListItemText
                  primary={
                    isAuthenticated
                      ? getLastName(user.displayName)
                      : "Anonymous"
                  }
                  primaryTypographyProps={{
                    fontWeight: 500,
                    color: "text.primary",
                  }}
                />
              )}
            </ListItemButton>
          </List>

          {/* Dropdown Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            transformOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
            {/* Header */}
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Signed in as
              </Typography>
              <Typography variant="body2" fontWeight={600} color="yellow">
                {isAuthenticated ? getLastName(user.displayName) : "Anonymous"}
              </Typography>
            </Box>
            <Divider />

            {isAuthenticated && (
              <>
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    onNavLinkClick("/profile");
                  }}
                >
                  <User size={18} style={{ marginRight: 8 }} />
                  Profile
                </MenuItem>
              </>
            )}

            <MenuItem
              onClick={() => {
                handleMenuClose();
                signOutUser(); // 🔑 use Auth provider logout
              }}
            >
              <LogOut size={18} style={{ marginRight: 8 }} />
              Sign Out
            </MenuItem>

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
                onNavLinkClick("/support");
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
      </Box>
    </Box>
  );
};

export default Sidebar;
