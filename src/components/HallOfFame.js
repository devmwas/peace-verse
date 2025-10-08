import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  IconButton,
  Container,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  Users,
  Zap,
  Calendar,
  TikTok,
  Trophy,
  Facebook,
  Twitter,
  Rss,
  FacebookIcon,
  TwitterIcon,
  RssIcon,
} from "lucide-react";

// --- Placeholder Data ---

const STATS = [
  {
    id: 1,
    title: "Total Builders",
    value: "861",
    subtitle: "Unique peace builders featured",
    Icon: Users,
    color: "#ffb300",
  }, // Gold/Yellow
  {
    id: 2,
    title: "X Posts",
    value: "4,936",
    subtitle: "Positive posts analyzed",
    Icon: Twitter,
    color: "#ccc",
  }, // Gray
  {
    id: 3,
    title: "Facebook Posts",
    value: "3,702",
    subtitle: "Positive posts analyzed",
    Icon: Facebook,
    color: "#4267B2",
  }, // Blue
  {
    id: 4,
    title: "TikTok Posts",
    value: "1,234",
    subtitle: "Positive posts analyzed",
    Icon: Zap,
    color: "#EE1D52",
  }, // Pink
  {
    id: 5,
    title: "Blog Posts",
    value: "1,234",
    subtitle: "Positive posts analyzed",
    Icon: Rss,
    color: "#f4511e",
  }, // Orange
];

const AMBASSADORS = [
  {
    id: 1,
    name: "Peter Kamau",
    handle: "@PeterK · Nairobi",
    score: 9.9,
    platform: "Facebook",
    PlatformIcon: Facebook,
    avatarUrl: "https://placehold.co/150x150/2d3748/ffffff?text=PK",
  },
  {
    id: 2,
    name: "Grace Akinyi",
    handle: "@GraceAkinyi · Kisumu",
    score: 9.8,
    platform: "X",
    PlatformIcon: TwitterIcon,
    avatarUrl: "https://placehold.co/150x150/2d3748/ffffff?text=GA",
  },
  {
    id: 3,
    name: "Peter Kamau",
    handle: "@PeterK · Nairobi",
    score: 9.7,
    platform: "Facebook",
    PlatformIcon: FacebookIcon,
    avatarUrl: "https://placehold.co/150x150/2d3748/ffffff?text=PK",
  },
  {
    id: 4,
    name: "Grace Akinyi",
    handle: "@GraceAkinyi · Kisumu",
    score: 9.7,
    platform: "X",
    PlatformIcon: TwitterIcon,
    avatarUrl: "https://placehold.co/150x150/2d3748/ffffff?text=GA",
  },
  {
    id: 5,
    name: "Samuel Leteipa",
    handle: "@LeteipaSamuel · Narok",
    score: 9.6,
    platform: "X",
    PlatformIcon: TwitterIcon,
    avatarUrl: "https://placehold.co/150x150/2d3748/ffffff?text=SL",
  },
  {
    id: 6,
    name: "Zainab Mohammed",
    handle: "Zainab.M · Mombasa",
    score: 9.4,
    platform: "Blog",
    PlatformIcon: RssIcon,
    avatarUrl: "https://placehold.co/150x150/2d3748/ffffff?text=ZM",
  },
];

// Custom styled motion component for Stat Card
const MotionCard = motion(Card);

// --- Sub Components ---

const StatCard = ({ title, value, subtitle, Icon, color }) => (
  <MotionCard
    component={motion.div}
    whileHover={{ scale: 1.05, boxShadow: "0 8px 30px rgba(255, 179, 0, 0.2)" }}
    transition={{ type: "spring", stiffness: 300 }}
    sx={{
      bgcolor: "grey.800",
      p: 3,
      borderRadius: 3,
      borderLeft: `5px solid ${color}`,
      color: "white",
    }}
  >
    <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ color: "grey.400", fontWeight: "bold" }}
        >
          {title}
        </Typography>
        <Icon sx={{ color: color, fontSize: 20 }} />
      </Box>
      <Typography
        variant="h3"
        component="div"
        sx={{ mt: 1, fontWeight: "extrabold", color: "white" }}
      >
        {value}
      </Typography>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ color: "grey.500", mt: 0.5 }}
      >
        {subtitle}
      </Typography>
    </CardContent>
  </MotionCard>
);

const AmbassadorCard = ({
  name,
  handle,
  score,
  platform,
  PlatformIcon,
  avatarUrl,
}) => {
  const theme = useTheme();

  const handleRecognize = () => {
    // Note: Replaced native alert with console log/MUI dialog trigger
    console.log(`Action: Trigger reward mechanism for ${name}!`);
    // In a real app, this would trigger an MUI Modal/Snackbar notification.
  };

  return (
    <MotionCard
      component={motion.div}
      whileHover={{ translateY: -5, boxShadow: "0 10px 40px rgba(0,0,0,0.5)" }}
      transition={{ type: "spring", stiffness: 300 }}
      sx={{
        bgcolor: "grey.800",
        p: 3,
        borderRadius: 3,
        textAlign: "center",
        color: "white",
        borderTop: `4px solid ${theme.palette.warning.main}`, // Yellow accent
      }}
    >
      <CardContent
        sx={{
          p: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Top Section: Avatar & Badge */}
        <Box position="relative" mb={2}>
          <Avatar
            src={avatarUrl}
            alt={name}
            sx={{
              width: 96,
              height: 96,
              border: "4px solid",
              borderColor: "grey.700",
            }}
          />
          <Chip
            size="small"
            label="Top Builder"
            icon={<Trophy size={20} strokeWidth={1.5} color="currentColor" />}
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              transform: "translate(25%, -25%)",
              bgcolor: theme.palette.warning.main,
              color: "grey.900",
              fontWeight: "bold",
              fontSize: "0.7rem",
              py: 1,
              px: 1,
            }}
          />
        </Box>

        {/* Profile Details */}
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "white" }}>
          {name}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2, color: "grey.400" }}
        >
          {handle}
        </Typography>

        {/* Score and Platform */}
        <Grid
          container
          spacing={1}
          sx={{
            bgcolor: "grey.900",
            p: 1.5,
            borderRadius: 2,
            width: "100%",
            mb: 3,
          }}
        >
          <Grid item xs={6} textAlign="left">
            <Typography variant="caption" color="grey.500">
              Overall Score
            </Typography>
            <Typography
              variant="h4"
              sx={{ fontWeight: "extrabold", color: "success.main" }}
            >
              {score}
            </Typography>
          </Grid>
          <Grid
            item
            xs={6}
            textAlign="right"
            display="flex"
            flexDirection="column"
            justifyContent="flex-end"
            alignItems="flex-end"
          >
            <Typography variant="caption" color="grey.500">
              Main Platform
            </Typography>
            <Box display="flex" alignItems="center" mt={0.5}>
              <PlatformIcon sx={{ fontSize: 20, mr: 0.5, color: "white" }} />
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "semibold", color: "white" }}
              >
                {platform}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Action Button: Reward Indicated */}
        <Button
          onClick={handleRecognize}
          variant="contained"
          fullWidth
          sx={{
            bgcolor: theme.palette.warning.main,
            color: "grey.900",
            fontWeight: "bold",
            py: 1.5,
            "&:hover": { bgcolor: theme.palette.warning.dark },
          }}
          startIcon={<Zap size={16} />} // Using Lucide here as a demonstration
        >
          Recognize & Reward
        </Button>
      </CardContent>
    </MotionCard>
  );
};

// --- Main Page Component ---

const HallOfFamePage = () => {
  // Setup for dark mode context (MUI Best Practice)
  const theme = useTheme();

  // Simple dark theme configuration for context
  const darkTheme = {
    palette: {
      mode: "dark",
      background: { default: "#121212", paper: "#1e1e1e" },
      primary: { main: "#ffb300" }, // Yellow/Gold
      secondary: { main: "#42a5f5" }, // Blue
      warning: { main: "#ffb300" }, // Use primary color for highlights
    },
    typography: {
      fontFamily: "Inter, Arial, sans-serif",
    },
  };

  // Note: In a real app, this theme setup would be in a ThemeProvider wrapper.
  // We're simulating the dark environment using fixed colors.

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "grey.900",
        p: { xs: 2, sm: 4 },
        color: "white",
        ...darkTheme,
      }}
    >
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box mb={5}>
          <Typography
            variant="h3"
            component="h1"
            sx={{ fontWeight: "extrabold", mb: 1 }}
          >
            Peace Builders Hall of Fame
          </Typography>
          <Typography variant="h6" color="grey.400">
            Celebrating the most positive and impactful voices in our community
            who use{" "}
            <Box
              component="span"
              sx={{ color: "warning.main", fontWeight: "bold" }}
            >
              our platform to advance peace.
            </Box>
          </Typography>
        </Box>

        {/* Stats Grid */}
        <Grid container spacing={3} mb={5}>
          {STATS.map((stat) => (
            <Grid item xs={6} md={4} lg={2.4} key={stat.id}>
              <StatCard
                title={stat.title}
                value={stat.value}
                subtitle={stat.subtitle}
                Icon={stat.Icon}
                color={stat.color}
              />
            </Grid>
          ))}
        </Grid>

        {/* Top Peace Ambassadors Section */}
        <Box component="section">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h4" component="h2" sx={{ fontWeight: "bold" }}>
              Top Peace Ambassadors
            </Typography>

            {/* Date Range Picker Placeholder */}
            <Button
              variant="outlined"
              startIcon={<Calendar />}
              sx={{
                color: "grey.400",
                borderColor: "grey.700",
                "&:hover": { borderColor: "grey.500", bgcolor: "grey.800" },
              }}
            >
              Pick a date range
            </Button>
          </Box>

          <Typography variant="body1" color="grey.500" mb={4}>
            This list recognizes users who consistently contribute to positive
            discourse.
          </Typography>

          {/* Ambassadors Grid */}
          <Grid container spacing={4}>
            {AMBASSADORS.map((ambassador) => (
              <Grid item xs={12} sm={6} lg={4} xl={3} key={ambassador.id}>
                <AmbassadorCard
                  name={ambassador.name}
                  handle={ambassador.handle}
                  score={ambassador.score}
                  platform={ambassador.platform}
                  PlatformIcon={ambassador.PlatformIcon}
                  avatarUrl={ambassador.avatarUrl}
                />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Note on Discoverability */}
        <Box mt={10} pt={3} borderTop="1px solid" borderColor="grey.700">
          <Typography
            variant="caption"
            color="grey.500"
            textAlign="center"
            display="block"
          >
            *The Peace Ambassadors are identified, scored, and rewarded through
            analysis of positive discourse contributions, prioritizing those who
            leverage our platform and integrated social channels to amplify
            their peacebuilding efforts.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};
export default HallOfFamePage;
