import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Fab,
  TextField,
} from "@mui/material";
import { Plus, MapPin } from "lucide-react";
import { motion } from "framer-motion";

// Safe Spaces Data
const safeSpaces = [
  {
    id: 1,
    name: "Nairobi Peace Center",
    location: "Nairobi, Kenya",
    description: "A hub for youth peace conferences and conflict mediation.",
    query: "Nairobi Peace Center",
  },
  {
    id: 2,
    name: "Mombasa Coastal Dialogue Hub",
    location: "Mombasa, Kenya",
    description:
      "Community space for interfaith dialogues and peace workshops.",
    query: "Mombasa Coastal Dialogue Hub",
  },
  {
    id: 3,
    name: "Kisumu Youth Networking Grounds",
    location: "Kisumu, Kenya",
    description: "Safe space for cultural exchange and social peacebuilding.",
    query: "Kisumu Youth Networking Grounds",
  },
  {
    id: 4,
    name: "Virtual Peace Café",
    location: "Online",
    description: "Digital space for global conversations on peace and empathy.",
    query: "Kenya", // default map query for online
  },
];

export default function SafeSpaces() {
  const [mapQuery, setMapQuery] = useState("Peace centers in Kenya");
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  return (
    <Box className="p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Safe Spaces
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Discover safe spaces for peace conferences, events, and networking.
          Join or create spaces where dialogue, unity, and peace thrive.
        </Typography>
      </motion.div>

      {/* Search Bar */}
      <Box className="flex justify-center mb-6">
        <TextField
          variant="outlined"
          placeholder="Search safe spaces..."
          size="small"
          sx={{ width: "60%", bgcolor: "#1E1E1E" }}
        />
      </Box>

      {/* Google Maps Embed (Dynamic) */}
      <Box className="rounded-xl overflow-hidden shadow-lg mb-6">
        <iframe
          title="Safe Spaces Map"
          src={`https://www.google.com/maps/embed/v1/search?key=${apiKey}&q=${encodeURIComponent(
            mapQuery
          )}`}
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
        ></iframe>
      </Box>

      {/* Safe Spaces List */}
      <Box className="grid gap-6 md:grid-cols-2">
        {safeSpaces.map((space) => (
          <motion.div
            key={space.id}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="rounded-2xl shadow-md bg-[#1E1E1E] border border-gray-700">
              <CardContent>
                <Typography variant="h6" color="text.primary">
                  {space.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  📍 {space.location}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  {space.description}
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  sx={{ mt: 2 }}
                  startIcon={<MapPin className="w-5 h-5 text-gray-600" />}
                  onClick={() => setMapQuery(space.query)}
                >
                  View on Map
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </Box>

      {/* Add Safe Space Button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: "fixed", bottom: 80, right: 20 }}
      >
        <Plus className="w-5 h-5 mr-2" />
      </Fab>
    </Box>
  );
}
