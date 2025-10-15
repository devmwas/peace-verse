import React from "react";
import {
  SwipeableDrawer,
  Box,
  Typography,
  Avatar,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  UserCircle2,
  Settings,
  HelpCircle,
  Languages,
  LogOut,
  HatGlasses,
} from "lucide-react";
import { useAuth } from "./auth/AuthProvider";

export default function ProfileDrawer({
  isProfileOpen,
  setIsProfileOpen,
  onNavLinkClick,
  activePath,
}) {
  const { user, logout, isAuthenticated } = useAuth();

  const displayName = user?.displayName || "Anonymous User";
  const photoURL = user?.photoURL ?? ""; // ✅ ensure it resolves to empty string not null

  const navItems = [
    { name: "Profile", icon: <UserCircle2 size={20} />, path: "/profile" },
    { name: "Settings", icon: <Settings size={20} />, path: "/settings" },
    {
      name: "Help & Support",
      icon: <HelpCircle size={20} />,
      path: "/support",
    },
    { name: "Language", icon: <Languages size={20} />, path: "/language" },
  ];

  const handleNavClick = (path) => {
    if (onNavLinkClick) onNavLinkClick(path);
    setIsProfileOpen(false);
  };

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={isProfileOpen}
      onClose={() => setIsProfileOpen(false)}
      onOpen={() => setIsProfileOpen(true)}
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: 420,
          mx: "auto",
          borderRadius: "16px 16px 0 0",
          bgcolor: "background.paper",
          boxShadow: 8,
        },
      }}
    >
      <Box sx={{ p: 2.5, textAlign: "center" }}>
        {/* --- USER HEADER --- */}
        <Box sx={{ position: "relative", display: "inline-block" }}>
          <Avatar
            src={isAuthenticated && photoURL ? photoURL : undefined}
            sx={{
              width: 72,
              height: 72,
              mx: "auto",
              mb: 1.2,
              bgcolor: !isAuthenticated ? "grey.800" : "primary.main",
              border: "2px solid rgba(255,255,255,0.15)",
              boxShadow: 3,
              fontSize: 28,
            }}
          >
            {!isAuthenticated ? (
              <HatGlasses size={30} />
            ) : (
              displayName?.[0]?.toUpperCase()
            )}
          </Avatar>
        </Box>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", fontSize: 13 }}
        >
          Signed in as
        </Typography>

        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: "primary.main",
            mb: 1,
            wordBreak: "break-word",
          }}
        >
          {displayName}
        </Typography>

        <Divider sx={{ my: 1.5 }} />

        {/* --- NAV ITEMS --- */}
        <List>
          {navItems.map((item) => {
            const isActive = activePath === item.path;
            return (
              <ListItemButton
                key={item.name}
                onClick={() => handleNavClick(item.path)}
                sx={{
                  borderRadius: 2,
                  bgcolor: isActive ? "primary.main" : "transparent",
                  mb: 0.5,
                  "&:hover": {
                    bgcolor: isActive ? "primary.main" : "action.hover",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 36,
                    color: isActive ? "black" : "text.secondary",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.name}
                  primaryTypographyProps={{
                    fontSize: 15,
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? "black" : "text.primary",
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>

        <Divider sx={{ my: 1.5 }} />

        {/* --- AUTH ACTION --- */}
        {isAuthenticated ? (
          <ListItemButton
            onClick={() => {
              logout();
              setIsProfileOpen(false);
            }}
            sx={{
              borderRadius: 2,
              "&:hover": { bgcolor: "rgba(244,67,54,0.1)" },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <LogOut size={20} color="#F44336" />
            </ListItemIcon>
            <ListItemText
              primary="Sign Out"
              primaryTypographyProps={{
                color: "error.main",
                fontWeight: 500,
              }}
            />
          </ListItemButton>
        ) : (
          <Typography
            variant="body2"
            sx={{
              color: "primary.main",
              textAlign: "center",
              mt: 1.5,
              fontWeight: 500,
              cursor: "pointer",
              "&:hover": { textDecoration: "underline" },
            }}
            onClick={() => {
              handleNavClick("/auth");
            }}
          >
            Limited access — sign in to participate
          </Typography>
        )}
      </Box>
    </SwipeableDrawer>
  );
}
