import React, {
  useState,
  useEffect,
  useContext,
  createContext,
  useRef,
} from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth, // Providers & Methods
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  signOut,
  onAuthStateChanged,
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
// Icons for providers and actions
import {
  Chrome,
  Mail,
  Lock,
  UserPlus,
  LogIn,
  Smartphone,
  ArrowLeft,
} from "lucide-react";

// --- Firebase Configuration ---
import { FIREBASE_CONFIG } from "../firebaseConfig";

// --- Context Setup ---
const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  loading: true,
  signInWithGoogle: () => {},
  signInWithEmail: () => {},
  signUpWithEmail: () => {},
  signInWithPhone: () => {},
  confirmVerificationCode: () => {},
  signOutUser: () => {},
});

export const useAuth = () => useContext(AuthContext);

// --- Firebase Initialization ---
let app;
let auth;
let db;

// Flag to indicate if initialization was attempted successfully (i.e., not using placeholders)
let isFirebaseInitialized = false;

// Only initialize if the firebase details are correctly set
if (FIREBASE_CONFIG && FIREBASE_CONFIG.apiKey !== "YOUR_API_KEY_HERE") {
  app = initializeApp(FIREBASE_CONFIG);
  auth = getAuth(app);
  db = getFirestore(app);
  isFirebaseInitialized = true;
} else {
  console.error(
    "CRITICAL ERROR: Firebase configuration is missing or using placeholders. Please update FIREBASE_CONFIG for local development."
  );
}

// --- Firestore Sync Function ---
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
      phoneNumber: user.phoneNumber || null, // Capture phone number
      photoURL: user.photoURL || null,
      createdAt: user.metadata.creationTime
        ? new Date(user.metadata.creationTime)
        : serverTimestamp(),
      lastSignInTime: serverTimestamp(),
    },
    { merge: true }
  );

  console.log("User profile synced to Firestore:", user.uid);
};

// --- Auth Provider Component (Named Auth as requested) ---
export const Auth = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [authMode, setAuthMode] = useState("main"); // 'main', 'email', 'phone' // --- Phone Auth State ---

  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const recaptchaRef = useRef(null); // Ref for reCAPTCHA container // 1. Initial Authentication Handler (Relies solely on onAuthStateChanged)

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    // Check for existing session and start listener
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser && !firebaseUser.isAnonymous) {
        syncUserDocument(firebaseUser);
      }
      setLoading(false); // Auth state is resolved whether signed in or out
    });

    return () => unsubscribe && unsubscribe();
  }, []); // Empty dependency array ensures this runs once // 2. Google Sign-In Method

  const signInWithGoogle = async () => {
    setAuthError("");
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    try {
      provider.setCustomParameters({ prompt: "select_account" });
      await signInWithPopup(auth, provider);
    } catch (error) {
      setAuthError(error.message);
      console.error("Google Sign-In failed:", error);
    }
  }; // 3. Email/Password Sign-Up Method

  const signUpWithEmail = async (email, password, displayName) => {
    setAuthError("");
    if (!auth) return;
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await syncUserDocument(userCredential.user, displayName);
    } catch (error) {
      setAuthError(error.message);
      console.error("Email Sign-Up failed:", error);
    }
  }; // 4. Email/Password Sign-In Method

  const signInWithEmail = async (email, password) => {
    setAuthError("");
    if (!auth) return;
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setAuthError(error.message);
      console.error("Email Sign-In failed:", error);
    }
  }; // 5. Phone Sign-In Method (Send SMS)

  const signInWithPhone = async () => {
    setAuthError("");

    // FIX 2: Check global initialization flag
    if (!auth || !isFirebaseInitialized) {
      setAuthError("Firebase is not configured. Please check your config.");
      return;
    }

    try {
      // Must have a valid phone number (e.g., +2547XXXXXXXX)
      if (!phoneNumber || phoneNumber.length < 10) {
        setAuthError(
          "Please enter a valid phone number (including country code, e.g., +254)."
        );
        return;
      } // 1. Ensure reCAPTCHA Verifier is ready (renders the reCAPTCHA widget)

      const recaptchaVerifier = new RecaptchaVerifier(
        recaptchaRef.current,
        {
          size: "normal",
          callback: (response) => {
            // reCAPTCHA solved, allow SMS send
          },
          "expired-callback": () => {
            setAuthError("reCAPTCHA expired. Please retry.");
          },
        },
        auth
      ); // 2. Wait for verification code send

      const confirmation = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        recaptchaVerifier
      );
      setConfirmationResult(confirmation);
      setAuthError("Verification code sent! Check your phone.");
    } catch (error) {
      // If error is related to reCAPTCHA being missing/invalid
      if (error.code === "auth/captcha-check-failed") {
        setAuthError("Security check failed. Please refresh and try again.");
      } else {
        setAuthError(`SMS failed: ${error.message}`);
      }
      console.error("Phone Sign-In failed:", error);
      setConfirmationResult(null); // Reset flow
    }
  }; // 6. Confirm SMS Code

  const confirmVerificationCode = async () => {
    setAuthError("");
    if (!confirmationResult || !verificationCode) return;

    try {
      // This attempts to sign in the user
      await confirmationResult.confirm(verificationCode); // The onAuthStateChanged listener will handle syncing the profile
    } catch (error) {
      setAuthError("Invalid code. Please try again.");
      console.error("Verification code confirmation failed:", error);
    }
  }; // 7. Sign-Out Method

  const signOutUser = async () => {
    setAuthError("");
    if (!auth) return;
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign Out failed:", error);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user && !user.isAnonymous,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signInWithPhone,
    confirmVerificationCode,
    signOutUser,
  }; // --- Component for Email/Password Form ---

  const EmailAuthForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (isSigningUp) {
        await signUpWithEmail(email, password, displayName);
      } else {
        await signInWithEmail(email, password);
      }
    };

    return (
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: "100%",
          mt: 2,
        }}
      >
               {" "}
        {isSigningUp && (
          <TextField
            label="Full Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            variant="outlined"
            required
            size="small"
            InputProps={{
              startAdornment: (
                <UserPlus size={28} strokeWidth={2} color="#43A047" />
              ),
            }}
            sx={{ input: { color: "text.primary" } }}
          />
        )}
               {" "}
        <TextField
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          variant="outlined"
          required
          size="small"
          InputProps={{
            startAdornment: <Mail size={28} strokeWidth={2} color="#1976D2" />,
          }}
          sx={{ input: { color: "text.primary" } }}
        />
               {" "}
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          variant="outlined"
          required
          size="small"
          InputProps={{
            startAdornment: <Lock size={28} strokeWidth={2} color="#E53935" />,
          }}
          sx={{ input: { color: "text.primary" } }}
        />
               {" "}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          startIcon={
            isSigningUp ? (
              <UserPlus size={28} strokeWidth={2} color="#43A047" />
            ) : (
              <LogIn size={28} strokeWidth={2} color="#1976D2" />
            )
          }
          sx={{ py: 1, fontWeight: "bold", mt: 1 }}
        >
                    {isSigningUp ? "Sign Up" : "Sign In"}       {" "}
        </Button>
               {" "}
        <Button
          onClick={() => setIsSigningUp(!isSigningUp)}
          sx={{ color: "text.secondary", mt: 1 }}
        >
                   {" "}
          {isSigningUp
            ? "Already have an account? Sign In"
            : "Don't have an account? Sign Up"}
                 {" "}
        </Button>
             {" "}
      </Box>
    );
  }; // --- Component for Phone Auth Flow ---

  const PhoneAuthForm = () => {
    const handleSendCode = (e) => {
      e.preventDefault();
      signInWithPhone();
    };

    const handleConfirmCode = (e) => {
      e.preventDefault();
      confirmVerificationCode();
    };

    return (
      <Box sx={{ width: "100%", mt: 2 }}>
                {/* Back Button */}       {" "}
        <IconButton
          onClick={() => {
            setAuthMode("main");
            setAuthError("");
            setConfirmationResult(null);
          }}
          sx={{ color: "text.secondary", mb: 1 }}
        >
                    <ArrowLeft />         {" "}
          <Typography variant="body2" sx={{ ml: 1 }}>
                        Back to main options          {" "}
          </Typography>
                 {" "}
        </IconButton>
               {" "}
        <Typography
          variant="h6"
          color="text.primary"
          sx={{ mb: 2, textAlign: "center" }}
        >
                    Sign In with Phone Number        {" "}
        </Typography>
               {" "}
        {confirmationResult === null ? (
          // --- STEP 1: Enter Phone Number and reCAPTCHA ---
          <Box
            component="form"
            onSubmit={handleSendCode}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
                       {" "}
            <TextField
              label="Phone Number (e.g., +2547XXXXXXXX)"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              variant="outlined"
              required
              size="small"
              InputProps={{
                startAdornment: (
                  <Smartphone size={28} strokeWidth={2} color="#6A1B9A" />
                ),
              }}
              sx={{ input: { color: "text.primary" } }}
            />
                       {" "}
            {/* ReCAPTCHA Container (Must be rendered before calling signInWithPhoneNumber) */}
                       {" "}
            <Box
              ref={recaptchaRef}
              id="recaptcha-container"
              sx={{ my: 1, display: "flex", justifyContent: "center" }}
            />
                       {" "}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={
                <Smartphone size={28} strokeWidth={2} color="#6A1B9A" />
              }
              sx={{ py: 1, fontWeight: "bold" }}
            >
                            Send Verification Code            {" "}
            </Button>
                     {" "}
          </Box>
        ) : (
          // --- STEP 2: Enter Verification Code ---
          <Box
            component="form"
            onSubmit={handleConfirmCode}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
                       {" "}
            <Alert severity="info" sx={{ mb: 1 }}>
                            Code sent to {phoneNumber}.            {" "}
            </Alert>
                       {" "}
            <TextField
              label="Verification Code"
              type="number"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              variant="outlined"
              required
              size="small"
              InputProps={{
                startAdornment: (
                  <Lock size={28} strokeWidth={2} color="#E53935" />
                ),
              }}
              sx={{ input: { color: "text.primary" } }}
            />
                       {" "}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<LogIn />}
              sx={{ py: 1, fontWeight: "bold" }}
            >
                            Confirm Code & Sign In            {" "}
            </Button>
                     {" "}
          </Box>
        )}
             {" "}
      </Box>
    );
  }; // --- Authentication Gate (UI) ---

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          bgcolor: "#121212",
        }}
      >
                <CircularProgress color="primary" />     {" "}
      </Box>
    );
  } // Main Sign-In Screen

  if (!user || user.isAnonymous) {
    let content;

    if (authMode === "phone") {
      content = <PhoneAuthForm />;
    } else if (authMode === "email") {
      // Toggle back to main view when form is submitted/cancelled
      content = (
        <Box sx={{ width: "100%", maxWidth: 360 }}>
                   {" "}
          <IconButton
            onClick={() => setAuthMode("main")}
            sx={{ color: "text.secondary", alignSelf: "flex-start", mb: 1 }}
          >
                        <ArrowLeft />           {" "}
            <Typography variant="body2" sx={{ ml: 1 }}>
                            Back to main options            {" "}
            </Typography>
                     {" "}
          </IconButton>
                    <EmailAuthForm />       {" "}
        </Box>
      );
    } else {
      // authMode === 'main'
      content = (
        <Box sx={{ width: "100%", maxWidth: 360 }}>
                   {" "}
          <Typography
            variant="h4"
            color="text.primary"
            sx={{ mb: 1, textAlign: "center" }}
          >
                        Welcome to Amani360          {" "}
          </Typography>
                   {" "}
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4, textAlign: "center" }}
          >
                        Please sign in to securely participate in governance and
            proposals.          {" "}
          </Typography>
                   {" "}
          {authError && (
            <Alert severity="error" sx={{ mb: 2 }}>
                            {authError}           {" "}
            </Alert>
          )}
                    {/* --- Google Sign In --- */}         {" "}
          <Button
            variant="outlined"
            startIcon={<Chrome />}
            onClick={signInWithGoogle}
            sx={{
              py: 1.5,
              mb: 2,
              width: "100%",
              borderColor: "#EA4335",
              color: "text.primary",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                borderColor: "#EA4335",
              },
            }}
          >
                        Sign In with Google          {" "}
          </Button>
                   {" "}
          <Divider sx={{ mb: 3 }}>
                       {" "}
            <Typography variant="caption" color="text.secondary">
                            OR            {" "}
            </Typography>
                     {" "}
          </Divider>
                    {/* --- Other Sign In Options --- */}         {" "}
          <Button
            variant="outlined"
            startIcon={<Mail />}
            onClick={() => setAuthMode("email")}
            sx={{
              py: 1,
              mb: 1,
              width: "100%",
              color: "text.primary",
              borderColor: "text.secondary",
            }}
          >
                        Use Email & Password          {" "}
          </Button>
                   {" "}
          <Button
            variant="outlined"
            startIcon={<Smartphone />}
            onClick={() => setAuthMode("phone")}
            sx={{
              py: 1,
              width: "100%",
              color: "text.primary",
              borderColor: "text.secondary",
            }}
          >
                        Use Phone Number          {" "}
          </Button>
                 {" "}
        </Box>
      );
    }

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
                {content}       {" "}
        {!isFirebaseInitialized ? (
          <Typography
            variant="caption"
            color="error"
            sx={{ mt: 3, textAlign: "center" }}
          >
                        WARNING: Firebase configuration is missing or using
            placeholders. Cannot authenticate.          {" "}
          </Typography>
        ) : null}
             {" "}
      </Box>
    );
  } // Render the application when a signed-in user is present

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
