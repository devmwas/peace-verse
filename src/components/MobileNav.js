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
  Avatar,
  Divider,
} from "@mui/material";
import {
  BsBullseye,
  BsMic,
  BsList,
  BsShieldLock,
  BsJournal,
  BsTrophyFill,
  BsPersonFillSlash,
  BsQuestionCircle,
  BsGear,
  BsTranslate,
} from "react-icons/bs";
import {
  MdAddCircle,
  MdSecurity,
  MdOutlineRecordVoiceOver,
} from "react-icons/md";
import { User, LogOut, Hat, HatIcon, HatGlasses } from "lucide-react";
import { useAuth } from "./auth/AuthProvider";

const COLORS = {
  ACCENT_YELLOW: "#FBC02D",
};

export default function MobileNav({ onNavLinkClick, activePath }) {
  const { user, isAuthenticated, isAnonymous, signOutUser } = useAuth();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const getLastName = (name) => {
    if (!name) return "";
    const parts = name.trim().split(" ");
    return parts.length > 1 ? parts[parts.length - 1] : parts[0];
  };

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
  ];

  const bottomBarItems = [
    {
      name: "Profile",
      icon: isAuthenticated ? (
        user?.photoURL ? (
          <img
            src={user.photoURL}
            alt="Profile"
            style={{ width: 22, height: 22, borderRadius: "50%" }}
          />
        ) : (
          <User size={18} />
        )
      ) : (
        <BsPersonFillSlash size={18} />
      ),
      path: "/profile",
      isProfile: true,
    },
    { name: "Polling", icon: <BsBullseye />, path: "/polling" },
    { name: "Propose", icon: <MdAddCircle />, path: "/propose", isCta: true },
    { name: "Radio", icon: <BsMic />, path: "/radio" },
    { name: "More", icon: <BsList />, path: "/more", isMenu: true },
  ];

  const handleBottomClick = (item) => {
    if (item.isMenu) {
      setIsMoreOpen(true);
      return;
    }
    if (item.isProfile) {
      setIsProfileOpen(true);
      return;
    }
    onNavLinkClick(item.path);
  };

  // --- Profile Drawer ---
  const ProfileDrawer = () => (
    <SwipeableDrawer
      anchor="bottom"
      open={isProfileOpen}
      onClose={() => setIsProfileOpen(false)}
      onOpen={() => setIsProfileOpen(true)}
      PaperProps={{
        sx: {
          zIndex: 2000,
          width: "100%",
          maxWidth: 420,
          mx: "auto",
          borderRadius: "16px 16px 0 0",
          bgcolor: "background.paper",
          boxShadow: 8,
        },
      }}
    >
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Avatar
          src={isAuthenticated && !isAnonymous ? user?.photoURL : null}
          sx={{
            width: 64,
            height: 64,
            mx: "auto",
            bgcolor: isAnonymous ? "grey.700" : "primary.main",
          }}
        >
          {isAnonymous && <HatGlasses size={28} />}
        </Avatar>

        <Typography
          variant="body2"
          sx={{ mt: 2, color: "text.secondary", fontSize: 13 }}
        >
          Signed in as
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ color: COLORS.ACCENT_YELLOW, fontWeight: 600 }}
        >
          {isAuthenticated && !isAnonymous
            ? user?.displayName || user?.email || "User"
            : "Anonymous User"}
        </Typography>
      </Box>

      <Divider sx={{ mb: 1 }} />

      <List>
        <ListItemButton
          selected={activePath === "/profile"}
          onClick={() => {
            onNavLinkClick("/profile");
            setIsProfileOpen(false);
          }}
        >
          <ListItemIcon>
            <User size={20} color="#B0B0B0" />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItemButton>

        <ListItemButton
          onClick={() => {
            onNavLinkClick("/settings");
            setIsProfileOpen(false);
          }}
        >
          <ListItemIcon>
            <BsGear size={18} />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItemButton>

        <ListItemButton
          onClick={() => {
            onNavLinkClick("/help");
            setIsProfileOpen(false);
          }}
        >
          <ListItemIcon>
            <BsQuestionCircle size={18} />
          </ListItemIcon>
          <ListItemText primary="Help & Support" />
        </ListItemButton>

        <ListItemButton
          onClick={() => {
            onNavLinkClick("/language");
            setIsProfileOpen(false);
          }}
        >
          <ListItemIcon>
            <BsTranslate size={18} />
          </ListItemIcon>
          <ListItemText primary="Language" />
        </ListItemButton>

        <>
          <Divider sx={{ my: 1 }} />
          <ListItemButton
            onClick={() => {
              signOutUser();
              setIsProfileOpen(false);
            }}
          >
            <ListItemIcon>
              <LogOut size={20} color="#F44336" />
            </ListItemIcon>
            <ListItemText
              primary="Sign Out"
              primaryTypographyProps={{ color: "error.main" }}
            />
          </ListItemButton>
        </>
      </List>
    </SwipeableDrawer>
  );

  // --- More Drawer ---
  const MoreDrawer = () => (
    <SwipeableDrawer
      anchor="bottom"
      open={isMoreOpen}
      onClose={() => setIsMoreOpen(false)}
      onOpen={() => setIsMoreOpen(true)}
      PaperProps={{
        sx: {
          zIndex: 1900,
          width: "100%",
          maxWidth: 420,
          mx: "auto",
          borderRadius: "16px 16px 0 0",
          bgcolor: "background.paper",
        },
      }}
    >
      <Box sx={{ p: 2, height: "60vh", overflowY: "auto" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 2,
          }}
        >
          <img
            src="/favicon.ico"
            alt="Amani360"
            style={{ width: 40, height: 40, marginBottom: 8 }}
          />
          <Typography
            variant="h6"
            sx={{ color: COLORS.ACCENT_YELLOW, fontWeight: 700 }}
          >
            Amani360
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <List>
          {allNavItems.map((item) => (
            <ListItemButton
              key={item.name}
              selected={activePath === item.path}
              onClick={() => {
                onNavLinkClick(item.path);
                setIsMoreOpen(false);
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
    </SwipeableDrawer>
  );

  return (
    <>
      <Box className="fixed bottom-0 left-0 right-0 z-[1000] md:hidden">
        <BottomNavigation
          value={activePath}
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
              onClick={() => handleBottomClick(item)}
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
            />
          ))}
        </BottomNavigation>
      </Box>

      {/* Drawers outside fixed bottom bar */}
      <MoreDrawer />
      <ProfileDrawer />
    </>
  );
}
