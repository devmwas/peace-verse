import React, { useState, useEffect } from "react";
import { fetchBillData } from "../utils/dataFetcher";
import { motion } from "framer-motion";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  CircularProgress,
  Tabs,
  Tab,
} from "@mui/material";
import { BsFillHouseDoorFill, BsFileTextFill } from "react-icons/bs";
import { MdOutlineLightbulb, MdAddCircle } from "react-icons/md";

// --- Configuration Constants (Updated for a calmer, less loud palette) ---
const COLORS = {
  ACCENT_YELLOW: "#FBC02D", // Softer, darker yellow accent (was #FFC107)
  ACCENT_BLUE_DARK: "#192634",
  TAG_ECONOMIC: "#D32F2F", // Slightly less bright red for tags (was #F44336)
  HEADER_TITLE: "#E0E0E0", // Soft white for main text
};

// --- Framer Motion Animation Variants ---
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.15,
    },
  },
};

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

// Utility to display the condensed USSD/SMS link on the far right of the header
const renderOfflineHeaderLink = () => (
  <Box
    sx={{
      textAlign: "right",
      p: 1,
      // Hide on small screens to prioritize title space
      display: { xs: "none", md: "block" },
      flexShrink: 0,
    }}
  >
    <Typography
      variant="caption"
      color="primary"
      fontWeight="bold"
      display="block"
    >
      SMS: 20333 | USSD: *300*1#
    </Typography>
    <Typography variant="caption" color="text.secondary" display="block">
      Vote Online or Offline!
    </Typography>
  </Box>
);

const BillPolling = () => {
  const [bills, setBills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Start on Parliamentary Bills tab (index 1) to match the screenshot
  const [activeTab, setActiveTab] = useState(1);

  useEffect(() => {
    const data = fetchBillData();
    setBills(data);
    setIsLoading(false);
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleVote = (billId, voteOption) => {
    // Placeholder for authentication and state update
    console.log(`Selected option: ${voteOption} on Bill ID ${billId}.`);

    setBills((prevBills) =>
      prevBills.map((bill) =>
        bill.id === billId ? { ...bill, voteChoice: voteOption } : bill
      )
    );
  };

  const renderOptionButton = (billId, optionText) => {
    const isSelected =
      bills.find((b) => b.id === billId)?.voteChoice === optionText;

    return (
      <Button
        key={optionText}
        variant={isSelected ? "contained" : "outlined"}
        color={isSelected ? "primary" : "inherit"}
        sx={{
          width: "100%",
          mb: 1,
          justifyContent: "flex-start",
          textTransform: "none",
          // Use the softer accent color
          borderColor: isSelected
            ? COLORS.ACCENT_YELLOW
            : "rgba(255, 255, 255, 0.2)",
          color: isSelected ? "black" : "white",
          backgroundColor: isSelected ? COLORS.ACCENT_YELLOW : "transparent",
          "&:hover": {
            borderColor: COLORS.ACCENT_YELLOW,
            backgroundColor: isSelected
              ? COLORS.ACCENT_YELLOW
              : "rgba(255, 255, 255, 0.08)",
          },
        }}
        onClick={() => handleVote(billId, optionText)}
      >
        {optionText}
      </Button>
    );
  };

  const renderBillCard = (bill) => {
    // Determine tag and color based on content
    const isEconomic =
      bill.Title.includes("Finance") || bill.Title.includes("Housing");
    // Use the slightly muted TAG_ECONOMIC color defined above
    const tagColor = isEconomic ? "error" : "secondary";
    const tagLabel = isEconomic ? "Economic Policy" : "Social Policy";
    const totalVotes = bill.Votes_For + bill.Votes_Against;

    // Determine dynamic options based on bill title for visual variety
    const options = bill.Title.includes("Finance")
      ? ["Fully Support", "Support with amendments", "Reject in its entirety"]
      : bill.Title.includes("Housing")
      ? [
          "Yes, it is a necessary step",
          "No, it should be a voluntary contribution",
        ]
      : ["Approve Bill", "Reject Bill", "Abstain"];

    return (
      <motion.div variants={cardVariants} className="col-span-1">
        <Card
          elevation={8}
          sx={{
            bgcolor: "background.paper", // Dark card color
            height: "100%",
            display: "flex",
            flexDirection: "column",
            borderRadius: "10px",
            border: `1px solid rgba(255, 255, 255, 0.1)`,
            transition: "box-shadow 0.3s",
            "&:hover": {
              // Use the softer yellow for the glow
              boxShadow: `0 0 15px 2px ${COLORS.ACCENT_YELLOW}33`,
            },
          }}
        >
          {/* --- CRITICAL FIX: Ensure CardContent uses flex column for bottom alignment --- */}
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              width: "100%",
              paddingBottom: "8px !important", // Reduce padding slightly to make buttons snug
            }}
          >
            {/* --- Content container that pushes voting options down --- */}
            <Box sx={{ flexGrow: 1, mb: 2 }}>
              {/* --- Tag and Vote Count Header --- */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Chip
                  label={tagLabel}
                  color={tagColor}
                  size="small"
                  sx={{
                    fontWeight: "bold",
                    // Override color setting for the Economic tag to use the less harsh red
                    backgroundColor: isEconomic
                      ? COLORS.TAG_ECONOMIC
                      : undefined,
                  }}
                />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <BsFileTextFill style={{ marginRight: 4 }} />
                  {totalVotes.toLocaleString()} votes
                </Typography>
              </Box>

              {/* --- Title and Question --- */}
              <Typography
                // *** FIX: Changed variant from h5 to h6 for a less overwhelming feel ***
                variant="h6"
                component="div"
                sx={{ fontWeight: 600, color: COLORS.HEADER_TITLE, mb: 1.5 }}
              >
                {bill.Title}: {bill.Summary.split(". ")[0]}?
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mb: 2 }}
              >
                Proposed by:{" "}
                {bill.Type === "B" ? "Parliament of Kenya" : "Amani360 User"}
              </Typography>
            </Box>

            {/* --- Voting Options (Pushed to bottom by flex-grow above) --- */}
            <Box sx={{ flexShrink: 0 }}>
              {options.map((option) => renderOptionButton(bill.id, option))}
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  const publicBills = bills.filter((b) => b.Type === "P");
  const parliamentaryBills = bills.filter((b) => b.Type === "B");
  const currentBills = activeTab === 0 ? publicBills : parliamentaryBills;

  return (
    // Tailwind classes applied for responsive centering and container width
    <div
      className="p-3 sm:p-6 max-w-7xl mx-auto"
      style={{ minHeight: "100vh", backgroundColor: "background.default" }}
    >
      {/* --- NEW HEADER FLEX CONTAINER: Title/Subtitle, Propose Button, USSD Link --- */}
      <div className="flex justify-between items-start mb-4 flex-wrap">
        {/* Left Section: Title and Subtitle */}
        <Box className="flex-grow min-w-[300px] md:pr-4">
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontWeight: 600, color: COLORS.HEADER_TITLE, mb: 0.5 }}
          >
            Public Participation & Polling
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: { xs: 3, md: 0 } }}
          >
            Your voice matters. Vote on current issues and see real-time
            results.
          </Typography>
        </Box>

        {/* Center Section: Propose Bill Button (Always visible) */}
        <Box className="md:w-64 w-full md:mt-0 mt-3 flex-shrink-0 order-last md:order-none">
          <Button
            startIcon={<MdAddCircle />}
            variant="contained"
            // Ensure button uses the softer accent color
            sx={{
              py: 1.5,
              fontWeight: "bold",
              textTransform: "uppercase",
              backgroundColor: COLORS.ACCENT_YELLOW,
              color: "black", // Text must be black for contrast
              "&:hover": {
                backgroundColor: COLORS.ACCENT_YELLOW, // Keep hover same for consistency
                opacity: 0.9,
              },
            }}
          >
            Propose a New Bill
          </Button>
        </Box>

        {/* Right Section: USSD Link (Hidden on small screens) */}
        {renderOfflineHeaderLink()}
      </div>
      {/* --- END NEW HEADER FLEX CONTAINER --- */}

      {/* --- OFFLINE ALERT CARD (Primary Banner Below Header) --- */}
      <Card
        elevation={2}
        sx={{
          mb: 4,
          p: 2,
          borderRadius: "8px",
          // Use the softer accent yellow
          borderLeft: `5px solid ${COLORS.ACCENT_YELLOW}`,
          display: "flex",
          alignItems: "center",
          backgroundColor: COLORS.ACCENT_BLUE_DARK,
        }}
      >
        <MdOutlineLightbulb
          size={28}
          color={COLORS.ACCENT_YELLOW}
          style={{ marginRight: "16px", flexShrink: 0 }}
        />
        <Box>
          <Typography variant="body2" color="text.primary" fontWeight="bold">
            Vote Online or Offline!
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            You can participate online here, or offline via SMS. Send
            **"ACCEPT"** to our SMS short code **20333** or dial our USSD code
            **"\*300\*1#"** to get started.
          </Typography>
        </Box>
      </Card>
      {/* --- END OFFLINE ALERT CARD --- */}

      {/* --- Tabs --- */}
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="bill tabs"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab
            label="PUBLIC PROPOSALS"
            icon={<BsFileTextFill />}
            iconPosition="start"
            sx={{ fontWeight: "bold" }}
          />
          <Tab
            label="PARLIAMENTARY BILLS"
            icon={<BsFillHouseDoorFill />}
            iconPosition="start"
            sx={{ fontWeight: "bold" }}
          />
        </Tabs>
      </Box>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <TabPanel value={activeTab} index={0}>
          {/* --- Tailwind Grid for Responsive Breakpoints --- */}
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {publicBills.map(renderBillCard)}
          </div>
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          {/* --- Tailwind Grid for Responsive Breakpoints --- */}
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {parliamentaryBills.map(renderBillCard)}
          </div>
        </TabPanel>
      </motion.div>
    </div>
  );
};

export default BillPolling;
