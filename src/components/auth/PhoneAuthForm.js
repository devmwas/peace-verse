import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  TextField,
  CircularProgress,
  Alert,
  IconButton,
  Typography,
} from "@mui/material";
import { Smartphone, ArrowLeft, LogIn } from "lucide-react";
import { useAuth } from "./AuthProvider";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

export default function PhoneAuthForm() {
  const { auth, setAuthMode, setAuthError, authError } = useAuth();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const recaptchaContainer = useRef(null);
  const codeInputRef = useRef(null);

  // --- Send Verification Code ---
  const handleSendCode = async (e) => {
    e.preventDefault();
    setAuthError("");

    if (!phoneNumber.startsWith("+")) {
      setAuthError("Please include country code, e.g. +2547...");
      return;
    }

    try {
      setIsSending(true);

      // Initialize reCAPTCHA if not already
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
      setAuthError("✅ Verification code sent!");
      setTimeout(() => codeInputRef.current?.focus(), 300);
    } catch (err) {
      console.error("Phone Sign-In Error:", err);
      setAuthError(err.message);
      setConfirmationResult(null);
    } finally {
      setIsSending(false);
    }
  };

  // --- Verify Code ---
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!confirmationResult || !verificationCode) return;
    setIsVerifying(true);
    setAuthError("");
    try {
      await confirmationResult.confirm(verificationCode);
    } catch (err) {
      console.error("Code Verification Error:", err);
      setAuthError("❌ Invalid verification code. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 360 }}>
      {/* Back button */}
      <IconButton onClick={() => setAuthMode("main")} sx={{ mb: 1 }}>
        <ArrowLeft />
        <Typography sx={{ ml: 1 }}>Back</Typography>
      </IconButton>

      {/* Alerts */}
      {authError && (
        <Alert
          severity={authError.includes("sent") ? "info" : "error"}
          sx={{ mb: 2 }}
        >
          {authError}
        </Alert>
      )}

      {!confirmationResult ? (
        <Box component="form" onSubmit={handleSendCode}>
          <TextField
            label="Phone Number (+2547...)"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            fullWidth
            size="small"
            disabled={isSending}
          />
          <div ref={recaptchaContainer} id="recaptcha-container" />
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 2 }}
            disabled={isSending}
            startIcon={
              isSending ? <CircularProgress size={20} /> : <Smartphone />
            }
          >
            {isSending ? "Sending..." : "Send Verification Code"}
          </Button>
        </Box>
      ) : (
        <Box component="form" onSubmit={handleVerifyCode}>
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
            disabled={isVerifying}
            autoFocus
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 2 }}
            disabled={isVerifying}
            startIcon={isVerifying ? <CircularProgress size={20} /> : <LogIn />}
          >
            {isVerifying ? "Verifying..." : "Confirm Code"}
          </Button>
        </Box>
      )}
    </Box>
  );
}
