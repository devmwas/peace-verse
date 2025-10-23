import React, {
  useState,
  useEffect,
  useContext,
  createContext,
  useRef,
} from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Divider,
} from "@mui/material";
import { Chrome, Mail, Phone, HatGlasses } from "lucide-react";
import { FIREBASE_CONFIG } from "../../firebaseConfig";
import EmailAuthForm from "./EmailAuthForm";
import PhoneAuthForm from "./PhoneAuthForm";
import { syncUserDocument } from "../../firebase/firestore";
import { db, auth, app } from "../../firebase/config";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

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
      setAuthError(err.message);
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

  // --- UI States ---
  if (loading)
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );

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
            bgcolor: "#121212",
            p: 3,
          }}
        >
          {authMode === "main" && (
            <Box sx={{ width: "100%", maxWidth: 360 }}>
              <Typography variant="h4" sx={{ mb: 1, textAlign: "center" }}>
                Welcome to Amani360
              </Typography>
              {authError && <Alert severity="error">{authError}</Alert>}

              <Button
                variant="outlined"
                startIcon={
                  isGoogleLoading ? <CircularProgress size={20} /> : <Chrome />
                }
                onClick={signInWithGoogle}
                disabled={isGoogleLoading}
                sx={{ py: 1.5, mb: 2, width: "100%" }}
              >
                {isGoogleLoading ? "Signing in..." : "Sign In with Google"}
              </Button>

              <Divider sx={{ mb: 3 }}>
                <Typography variant="caption">OR</Typography>
              </Divider>

              <Button
                variant="outlined"
                startIcon={<Mail />}
                onClick={() => setAuthMode("email")}
                fullWidth
                sx={{ mb: 1 }}
              >
                Use Email & Password
              </Button>

              <Button
                variant="outlined"
                startIcon={<Phone />}
                onClick={() => setAuthMode("phone")}
                fullWidth
                sx={{ mb: 1 }}
              >
                Use Phone Number
              </Button>

              <Button
                variant="outlined"
                startIcon={
                  isAnonLoading ? (
                    <CircularProgress size={20} />
                  ) : (
                    <HatGlasses />
                  )
                }
                onClick={signInAnonymous}
                disabled={isAnonLoading}
                fullWidth
              >
                {isAnonLoading ? "Entering..." : "Continue as Guest"}
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
