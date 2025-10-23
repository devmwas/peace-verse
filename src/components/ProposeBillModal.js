import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { addUserProposedBill } from "../firebase/firestore";
import { useAuth } from "./auth/AuthProvider";

const ProposeBillModal = ({ open, onClose }) => {
  const { user, isAnonymous } = useAuth();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !summary.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setIsSubmitting(true);

    try {
      await addUserProposedBill(
        { title: title.trim(), summary: summary.trim() },
        user
      );
      setSuccess(true);
      setTitle("");
      setSummary("");
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1000);
    } catch (err) {
      setError("Failed to submit bill. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          bgcolor: "background.paper",
          borderRadius: 3,
          p: 1,
          width: "100%",
          maxWidth: 420,
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 600, textAlign: "center" }}>
        Propose a New Bill
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Bill submitted successfully!
          </Alert>
        )}

        <TextField
          label="Bill Title"
          fullWidth
          variant="outlined"
          sx={{ mb: 2 }}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          label="Summary / Description"
          fullWidth
          multiline
          minRows={3}
          variant="outlined"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <CircularProgress size={22} color="inherit" />
          ) : (
            "Submit"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProposeBillModal;
