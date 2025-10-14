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
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  RecaptchaVerifier,
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
  TextField,
  Divider,
  Alert,
  IconButton,
} from "@mui/material";
import {
  Chrome,
  Mail,
  LogIn,
  Smartphone,
  ArrowLeft,
  Phone,
  UserPlus,
  HatGlasses,
} from "lucide-react";
import { FIREBASE_CONFIG } from "../firebaseConfig";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

let app, auth, db;
let isFirebaseInitialized = false;

// --- Initialize Firebase ---
if (FIREBASE_CONFIG && FIREBASE_CONFIG.apiKey) {
  app = initializeApp(FIREBASE_CONFIG);
  auth = getAuth(app);
  db = getFirestore(app);
  setPersistence(auth, browserLocalPersistence);
  isFirebaseInitialized = true;
} else {
  console.error("❌ Firebase config missing or invalid!");
}

// --- Firestore Sync ---
const syncUserDocument = async (user, displayNameOverride = null) => {
  if (!db || !user || user.isAnonymous) return;
  const userRef = doc(db, "users", user.uid);

  await setDoc(
    userRef,
    {
      uid: user.uid,
      displayName:
        displayNameOverride || user.displayName || "Authenticated User",
      email: user.email || null,
      phoneNumber: user.phoneNumber || null,
      photoURL: user.photoURL || null,
      createdAt: user.metadata.creationTime
        ? new Date(user.metadata.creationTime)
        : serverTimestamp(),
      lastSignInTime: serverTimestamp(),
    },
    { merge: true }
  );
};

export const Auth = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const [authMode, setAuthMode] = useState("main");
  const [isSigningUp, setIsSigningUp] = useState(false);

  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isPhoneLoading, setIsPhoneLoading] = useState(false);
  const [isCodeVerifying, setIsCodeVerifying] = useState(false);
  const [isAnonLoading, setIsAnonLoading] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const recaptchaContainer = useRef(null);
  const codeInputRef = useRef(null);

  // --- Auth State Listener ---
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

  // --- Sign in with Google ---
  const signInWithGoogle = async () => {
    setAuthError("");
    setIsGoogleLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      await signInWithPopup(auth, provider);
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // --- Email Auth ---
  const signUpWithEmail = async (email, password, displayName) => {
    setAuthError("");
    setIsEmailLoading(true);
    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await syncUserDocument(userCred.user, displayName);
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setIsEmailLoading(false);
    }
  };

  const signInWithEmail = async (email, password) => {
    setAuthError("");
    setIsEmailLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setIsEmailLoading(false);
    }
  };

  // --- Phone Auth ---
  const signInWithPhone = async () => {
    setAuthError("");
    if (!auth || !isFirebaseInitialized) {
      setAuthError("Firebase not initialized.");
      return;
    }

    if (!phoneNumber.startsWith("+")) {
      setAuthError("Enter phone number with country code (e.g. +2547...).");
      return;
    }

    try {
      setIsPhoneLoading(true);

      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          recaptchaContainer.current,
          { size: "invisible" }
        );
        await window.recaptchaVerifier.render();
      }

      const confirmation = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        window.recaptchaVerifier
      );

      setConfirmationResult(confirmation);
      setAuthError("Verification code sent!");
      setTimeout(() => codeInputRef.current?.focus(), 300);
    } catch (error) {
      console.error("Phone Sign-In Error:", error);
      setAuthError(error.message);
      setConfirmationResult(null);
    } finally {
      setIsPhoneLoading(false);
    }
  };

  const confirmVerificationCode = async () => {
    if (!confirmationResult || !verificationCode) return;
    setAuthError("");
    setIsCodeVerifying(true);
    try {
      await confirmationResult.confirm(verificationCode);
    } catch (error) {
      setAuthError("Invalid code. Please try again.");
    } finally {
      setIsCodeVerifying(false);
    }
  };

  // --- Anonymous Auth ---
  const signInAnonymous = async () => {
    setAuthError("");
    setIsAnonLoading(true);
    try {
      await signInAnonymously(auth);
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setIsAnonLoading(false);
    }
  };

  const signOutUser = async () => {
    await signOut(auth);
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user && !user.isAnonymous,
    isAnonymous: !!user && user.isAnonymous,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signInWithPhone,
    confirmVerificationCode,
    signInAnonymous,
    signOutUser,
  };

  // --- Email Auth Form ---
  const EmailAuthForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");

    const handleSubmit = (e) => {
      e.preventDefault();
      if (isSigningUp) {
        signUpWithEmail(email, password, displayName);
      } else {
        signInWithEmail(email, password);
      }
    };

    return (
      <Box sx={{ width: "100%", maxWidth: 360 }}>
        <IconButton onClick={() => setAuthMode("main")} sx={{ mb: 1 }}>
          <ArrowLeft />
          <Typography sx={{ ml: 1 }}>Back</Typography>
        </IconButton>

        {authError && <Alert severity="error">{authError}</Alert>}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          {isSigningUp && (
            <TextField
              label="Full Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              size="small"
              disabled={isEmailLoading}
            />
          )}
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            size="small"
            disabled={isEmailLoading}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            size="small"
            disabled={isEmailLoading}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={isEmailLoading}
            startIcon={
              isEmailLoading ? <CircularProgress size={20} /> : <LogIn />
            }
          >
            {isSigningUp ? "Sign Up" : "Sign In"}
          </Button>
          <Button
            onClick={() => setIsSigningUp(!isSigningUp)}
            sx={{ color: "text.secondary" }}
          >
            {isSigningUp ? "Already have an account?" : "Create a new account"}
          </Button>
        </Box>
      </Box>
    );
  };

  // --- Phone Auth Form ---
  const PhoneAuthForm = () => (
    <Box sx={{ width: "100%", maxWidth: 360 }}>
      <IconButton onClick={() => setAuthMode("main")} sx={{ mb: 1 }}>
        <ArrowLeft />
        <Typography sx={{ ml: 1 }}>Back</Typography>
      </IconButton>

      {authError && (
        <Alert severity={authError.includes("sent") ? "info" : "error"}>
          {authError}
        </Alert>
      )}
      {!confirmationResult ? (
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            signInWithPhone();
          }}
        >
          <TextField
            label="Phone Number (+2547...)"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            fullWidth
            size="small"
            disabled={isPhoneLoading}
          />
          <div ref={recaptchaContainer} id="recaptcha-container" />
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 2 }}
            disabled={isPhoneLoading}
            startIcon={
              isPhoneLoading ? <CircularProgress size={20} /> : <Smartphone />
            }
          >
            {isPhoneLoading ? "Sending..." : "Send Verification Code"}
          </Button>
        </Box>
      ) : (
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            confirmVerificationCode();
          }}
        >
          <Alert severity="info" sx={{ mb: 1 }}>
            Code sent to {phoneNumber}
          </Alert>
          <TextField
            inputRef={codeInputRef}
            label="Verification Code"
            type="number"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            fullWidth
            size="small"
            disabled={isCodeVerifying}
            autoFocus
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 2 }}
            disabled={isCodeVerifying}
            startIcon={
              isCodeVerifying ? <CircularProgress size={20} /> : <LogIn />
            }
          >
            {isCodeVerifying ? "Verifying..." : "Confirm Code"}
          </Button>
        </Box>
      )}
    </Box>
  );

  // --- Loading Spinner ---
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

  // --- Unauthenticated ---
  if (!user)
    return (
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
                isAnonLoading ? <CircularProgress size={20} /> : <HatGlasses />
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
    );

  // --- Authenticated ---
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
