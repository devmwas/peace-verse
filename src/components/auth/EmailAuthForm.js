import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  CircularProgress,
  Alert,
  IconButton,
  Typography,
} from "@mui/material";
import { LogIn, ArrowLeft } from "lucide-react";
import { useAuth } from "./AuthProvider";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";

export default function EmailAuthForm() {
  const { auth, db, setAuthMode, setAuthError, authError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    setLoading(true);
    try {
      if (isSigningUp) {
        const userCred = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        await setDoc(doc(db, "users", userCred.user.uid), {
          uid: userCred.user.uid,
          displayName,
          email,
          createdAt: serverTimestamp(),
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setLoading(false);
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
            disabled={loading}
          />
        )}
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          size="small"
          disabled={loading}
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          size="small"
          disabled={loading}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <LogIn />}
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
}
