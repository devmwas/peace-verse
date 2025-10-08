import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  Divider,
  FormControlLabel,
  Button,
} from "@mui/material";
import { motion } from "framer-motion";
import { Shield, User, MapPin, LogOut } from "lucide-react";

const Settings = () => {
  const [locationSharing, setLocationSharing] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  return (
    <Box className="p-6 max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <Shield className="w-12 h-12 mx-auto text-yellow-500 mb-2" />
        <Typography variant="h4" className="font-bold">
          Account Settings
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Manage your account preferences and privacy settings.
        </Typography>
      </motion.div>

      {/* Privacy Settings */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Privacy Settings
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <FormControlLabel
            control={
              <Switch
                checked={locationSharing}
                onChange={(e) => setLocationSharing(e.target.checked)}
                color="primary"
              />
            }
            label={
              <Box className="flex items-center space-x-2">
                <MapPin size={18} />
                <span>Location Sharing</span>
              </Box>
            }
          />
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ ml: 6, mb: 2 }}
          >
            Allow the app to use your location to find nearby Safe Spaces.
          </Typography>

          <FormControlLabel
            control={
              <Switch
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                color="primary"
              />
            }
            label={
              <Box className="flex items-center space-x-2">
                <User size={18} />
                <span>Email Notifications</span>
              </Box>
            }
          />
          <Typography variant="body2" color="textSecondary" sx={{ ml: 6 }}>
            Get updates on polls, Safe Spaces, and peace events.
          </Typography>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Appearance
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <FormControlLabel
            control={
              <Switch
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
                color="primary"
              />
            }
            label="Enable Dark Mode"
          />
          <Typography variant="body2" color="textSecondary" sx={{ ml: 6 }}>
            Switch between dark and light themes.
          </Typography>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Account Actions
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box className="flex flex-col space-y-3">
            <Button
              variant="outlined"
              startIcon={<User />}
              sx={{ justifyContent: "flex-start" }}
            >
              Edit Profile
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<LogOut />}
              sx={{ justifyContent: "flex-start" }}
            >
              Logout
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Settings;
