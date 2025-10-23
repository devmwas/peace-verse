import React, { useState, useEffect, useContext, createContext } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously,
  signInWithRedirect,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Divider,
} from "@mui/material";
import { Chrome, Mail, Phone, HatGlasses } from "lucide-react";
import EmailAuthForm from "./EmailAuthForm";
import PhoneAuthForm from "./PhoneAuthForm";
import { syncUserDocument } from "../../firebase/firestore";
import { db, auth } from "../../firebase/config";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);
const provider = new GoogleAuthProvider();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const [authMode, setAuthMode] = useState("main");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isAnonLoading, setIsAnonLoading] = useState(false);

  // --- Auth Listener ---
  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser && !firebaseUser.isAnonymous) {
        syncUserDocument(firebaseUser);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // --- Google Auth ---
  const signInWithGoogle = async () => {
    setAuthError("");
    setIsGoogleLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      await signInWithPopup(auth, provider);
    } catch (err) {
      if (err.code === "auth/popup-blocked") {
        await signInWithRedirect(auth, provider);
      } else setAuthError(err.message);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // --- Anonymous Auth ---
  const signInAnonymous = async () => {
    setAuthError("");
    setIsAnonLoading(true);
    try {
      await signInAnonymously(auth);
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setIsAnonLoading(false);
    }
  };

  // --- Sign Out ---
  const signOutUser = async () => {
    await signOut(auth);
  };

  // --- Derived flags ---
  const isAuthenticated = !!user && !user.isAnonymous;
  const isAnonymous = !!user?.isAnonymous;

  // --- Context Value ---
  const value = {
    user,
    loading,
    authError,
    setAuthError,
    authMode,
    setAuthMode,
    signOutUser,
    signInWithGoogle,
    signInAnonymous,
    auth,
    db,
    isAuthenticated,
    isAnonymous,
  };

  // --- Loading UI ---
  if (loading)
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "#121212",
        }}
      >
        <CircularProgress sx={{ color: "#FFD54F" }} />
      </Box>
    );

  // --- Auth UI ---
  if (!user) {
    return (
      <AuthContext.Provider value={value}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            bgcolor: "#0D0D0D",
            p: 3,
          }}
        >
          {authMode === "main" && (
            <Box
              sx={{
                width: "100%",
                maxWidth: 320,
                mx: "auto",
                textAlign: "center",
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(10px)",
                borderRadius: 4,
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
                p: 4,
              }}
            >
              {/* --- Logo --- */}
              <Box
                component="img"
                src="/logo.png"
                alt="Amani360 Logo"
                sx={{
                  width: 90,
                  height: 90,
                  mb: 1,
                  mx: "auto",
                  display: "block",
                  borderRadius: "50%",
                  boxShadow: "0 0 12px rgba(255, 215, 0, 0.4)", // subtle golden glow
                }}
              />

              {/* --- Title --- */}
              <Typography
                variant="h5"
                sx={{
                  mb: 2,
                  fontWeight: 700,
                  color: "#FFD54F",
                  letterSpacing: 0.5,
                }}
              >
                Welcome to Amani360
              </Typography>

              {authError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {authError}
                </Alert>
              )}

              {/* --- Google --- */}
              <Button
                variant="outlined"
                onClick={signInWithGoogle}
                disabled={isGoogleLoading}
                sx={{
                  py: 1.3,
                  mb: 2,
                  width: "100%",
                  justifyContent: "space-between",
                  borderColor: "#FFD54F",
                  color: "#FFD54F",
                  "&:hover": {
                    borderColor: "#FFC107",
                    bgcolor: "rgba(255, 213, 79, 0.08)",
                  },
                }}
              >
                <Typography sx={{ flex: 1, textAlign: "left" }}>
                  {isGoogleLoading ? "Signing in..." : "Sign In with Google"}
                </Typography>
                <Box
                  sx={{
                    width: 30,
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  {isGoogleLoading ? (
                    <CircularProgress size={20} />
                  ) : (
                    <Chrome size={22} />
                  )}
                </Box>
              </Button>

              <Divider sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ color: "#aaa" }}>
                  OR
                </Typography>
              </Divider>

              {/* --- Email --- */}
              <Button
                variant="outlined"
                onClick={() => setAuthMode("email")}
                sx={{
                  py: 1.3,
                  mb: 1.5,
                  width: "100%",
                  justifyContent: "space-between",
                  borderColor: "#FFD54F",
                  color: "#FFD54F",
                  "&:hover": {
                    borderColor: "#FFC107",
                    bgcolor: "rgba(255, 213, 79, 0.08)",
                  },
                }}
              >
                <Typography sx={{ flex: 1, textAlign: "left" }}>
                  Use Email & Password
                </Typography>
                <Box
                  sx={{
                    width: 30,
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Mail size={22} />
                </Box>
              </Button>

              {/* --- Phone --- */}
              <Button
                variant="outlined"
                onClick={() => setAuthMode("phone")}
                sx={{
                  py: 1.3,
                  mb: 1.5,
                  width: "100%",
                  justifyContent: "space-between",
                  borderColor: "#FFD54F",
                  color: "#FFD54F",
                  "&:hover": {
                    borderColor: "#FFC107",
                    bgcolor: "rgba(255, 213, 79, 0.08)",
                  },
                }}
              >
                <Typography sx={{ flex: 1, textAlign: "left" }}>
                  Use Phone Number
                </Typography>
                <Box
                  sx={{
                    width: 30,
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Phone size={22} />
                </Box>
              </Button>

              {/* --- Anonymous --- */}
              <Button
                variant="outlined"
                onClick={signInAnonymous}
                disabled={isAnonLoading}
                sx={{
                  py: 1.3,
                  width: "100%",
                  justifyContent: "space-between",
                  borderColor: "#FFD54F",
                  color: "#FFD54F",
                  "&:hover": {
                    borderColor: "#FFC107",
                    bgcolor: "rgba(255, 213, 79, 0.08)",
                  },
                }}
              >
                <Typography sx={{ flex: 1, textAlign: "left" }}>
                  {isAnonLoading ? "Entering..." : "Continue as Guest"}
                </Typography>
                <Box
                  sx={{
                    width: 30,
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  {isAnonLoading ? (
                    <CircularProgress size={20} />
                  ) : (
                    <HatGlasses size={22} />
                  )}
                </Box>
              </Button>
            </Box>
          )}

          {authMode === "email" && <EmailAuthForm />}
          {authMode === "phone" && <PhoneAuthForm />}
        </Box>
      </AuthContext.Provider>
    );
  }

  // --- Authenticated ---
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
