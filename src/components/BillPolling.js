import React, { useState, useEffect } from "react";
import { fetchBillsFromFirestore } from "../firebase/firestore";
import DetailedStats from "./DetailedStats";
import ProposeBillModal from "./ProposeBillModal";
import { motion } from "framer-motion";
import { listenToBills } from "../firebase/firestore";
import { submitVote, listenToBillVotes } from "../firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";
import { useAuth } from "./auth/AuthProvider";
import { AnimatePresence } from "framer-motion";
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
  Tooltip,
} from "@mui/material";
import { BsFillHouseDoorFill, BsFileTextFill } from "react-icons/bs";
import { MdOutlineLightbulb, MdAddCircle } from "react-icons/md";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";
// --- Configuration Constants (Updated for a calmer, less loud palette) ---
import { COLORS } from "../theme";
import { FileText, FileSpreadsheet, FileCode, BarChart3 } from "lucide-react";

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

// small helper fo allowing export of votes in different formats
const exportVotesToJSON = (billTitle, votes) => {
  const blob = new Blob([JSON.stringify(votes, null, 2)], {
    type: "application/json",
  });
  saveAs(blob, `${billTitle}_votes.json`);
};

const exportVotesToCSV = (billTitle, votes) => {
  const header = ["#", "User Name", "Vote Option", "Is Anonymous", "Timestamp"];
  const rows = votes.map((v, i) => [
    i + 1,
    v.userDisplayName,
    v.voteOption,
    v.isAnonymous ? "Yes" : "No",
    v.timestamp ? new Date(v.timestamp.seconds * 1000).toLocaleString() : "-",
  ]);
  const csvContent = [header.join(","), ...rows.map((r) => r.join(","))].join(
    "\n"
  );
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, `${billTitle}_votes.csv`);
};

export const exportVotesToPDF = (filename, votes) => {
  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text(`${filename} - Vote Summary`, 10, 10);

  let y = 20;
  votes.forEach((v, i) => {
    doc.text(
      `${i + 1}. ${v.isAnonymous ? "Anonymous User" : v.userDisplayName} — ${
        v.voteOption
      }`,
      10,
      y
    );
    y += 8;
  });

  doc.save(`${filename}.pdf`);
};

const BillPolling = () => {
  const [bills, setBills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [billVotes, setBillVotes] = useState({}); // store votes per bill
  const [votes, setVotes] = useState([]);
  const [selectedBillForStats, setSelectedBillForStats] = useState(null);
  // Start on Parliamentary Bills tab (index 1) to match the screenshot
  const [activeTab, setActiveTab] = useState(0);
  // Getting our user from the auth provider
  const { user } = useAuth();
  // useEffect(() => {
  //   const loadBills = async () => {
  //     try {
  //       const fetchedBills = await fetchBillsFromFirestore();
  //       setBills(fetchedBills);
  //     } catch (error) {
  //       console.error("Error fetching bills:", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   loadBills();
  // }, []);

  // Subscribes to Firestore in real-time.
  // Updates the UI immediately when a new bill is proposed.
  // Cleans up the listener when you navigate away.
  useEffect(() => {
    const unsubscribe = listenToBills((fetchedBills) => {
      setBills(fetchedBills);
      setIsLoading(false);
    });

    // Cleanup on unmount
    return () => unsubscribe();
  }, []);

  // Tracking auth state change
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      // setUser(currentUser);
      // Will add this logic later if necessary
    });

    return () => unsubscribeAuth();
  }, []);

  // Listen to votes for all bills dynamically
  useEffect(() => {
    const unsubscribes = bills.map((bill) =>
      listenToBillVotes(bill.id, (votes) => {
        setBillVotes((prev) => ({ ...prev, [bill.id]: votes }));
      })
    );

    return () => unsubscribes.forEach((u) => u && u());
  }, [bills]);

  // Now the export buttons inside your bill card will have access to a proper votes array.
  useEffect(() => {
    if (!selectedBillForStats) return;
    const unsub = listenToBillVotes(selectedBillForStats.id, (liveVotes) => {
      setVotes(liveVotes);
    });
    return () => unsub();
  }, [selectedBillForStats]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Allow users to vote on a bill
  const handleVote = async (billId, voteOption) => {
    try {
      if (!user) {
        alert("Please sign in (or continue anonymously) to vote.");
        return;
      }

      await submitVote(user, billId, voteOption);

      // Update UI selection locally
      setBills((prev) =>
        prev.map((b) =>
          b.id === billId ? { ...b, voteChoice: voteOption } : b
        )
      );
    } catch (error) {
      alert(error.message);
    }
  };

  // This will now show live stats on the vote bars for quick perusal
  const renderOptionButton = (billId, optionText) => {
    const currentBill = bills.find((b) => b.id === billId);
    const votes = billVotes[billId] || [];
    const totalVotes = votes.length;
    const grouped = votes.reduce((acc, v) => {
      acc[v.voteOption] = (acc[v.voteOption] || 0) + 1;
      return acc;
    }, {});
    const count = grouped[optionText] || 0;
    const pct = totalVotes > 0 ? ((count / totalVotes) * 100).toFixed(1) : 0;

    const userVotedOption = votes.find(
      (v) => v.userId === user?.uid
    )?.voteOption;
    const isSelected = userVotedOption === optionText;

    return (
      <Button
        key={optionText}
        variant={isSelected ? "contained" : "outlined"}
        color={isSelected ? "primary" : "inherit"}
        onClick={() => handleVote(billId, optionText)}
        sx={{
          width: "100%",
          mb: 1,
          justifyContent: "space-between",
          textTransform: "none",
          fontWeight: 500,
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
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Percentage bar behind text */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: `${pct}%`,
            height: "100%",
            backgroundColor: isSelected
              ? `${COLORS.ACCENT_YELLOW}99`
              : "rgba(255,255,255,0.08)",
            zIndex: 0,
            transition: "width 0.4s ease",
          }}
        />
        <Box
          sx={{
            position: "relative",
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            zIndex: 1,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              flexGrow: 1,
              textAlign: "left",
            }}
          >
            {optionText}
          </Typography>

          {totalVotes > 0 && (
            <Typography
              variant="body2"
              sx={{
                fontWeight: "bold",
                ml: 1,
                color: isSelected ? "black" : COLORS.ACCENT_YELLOW,
              }}
            >
              {pct}%
            </Typography>
          )}
        </Box>
      </Button>
    );
  };

  // Billpolling card
  const renderBillCard = (bill) => {
    // Determine tag and color based on content
    const isEconomic =
      bill?.title.includes("Finance") || bill?.title.includes("Housing");
    // Use the slightly muted TAG_ECONOMIC color defined above
    const tagColor = isEconomic ? "error" : "secondary";
    const tagLabel = isEconomic ? "Economic Policy" : "Social Policy";
    const totalVotes = bill.votesFor + bill.votesAgainst;

    // Determine dynamic options based on bill title for visual variety
    const options = bill.title.includes("Finance")
      ? ["Fully Support", "Support with amendments", "Reject in its entirety"]
      : bill.title.includes("Housing")
      ? [
          "Yes, it is a necessary step",
          "No, it should be a voluntary contribution",
        ]
      : ["Approve Bill", "Reject Bill", "Abstain"];

    return (
      <motion.div
        variants={cardVariants}
        className="col-span-1 flex"
        style={{ height: "100%" }}
      >
        <Card
          elevation={8}
          sx={{
            bgcolor: "background.paper",
            flex: 1, // ✅ fills height of parent
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between", // keeps vote section aligned
            borderRadius: "10px",
            border: `1px solid rgba(255, 255, 255, 0.1)`,
            transition: "box-shadow 0.3s",
            height: "100%", // ✅ ensures uniform height
            "&:hover": {
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
                {bill.title}: {bill.summary.split(". ")[0]}?
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mb: 2 }}
              >
                Proposed by:{" "}
                {bill.type === "B"
                  ? "Parliament of Kenya"
                  : bill.createdByName
                  ? bill.createdByName
                  : "Amani360 User"}
              </Typography>
            </Box>

            {/* --- Voting Options (Pushed to bottom by flex-grow above) --- */}
            <Box sx={{ flexShrink: 0 }}>
              {options.map((option) => renderOptionButton(bill.id, option))}
            </Box>

            {/* 🔹 View Detailed Stats Button */}
            {billVotes[bill.id] && billVotes[bill.id].length > 0 && (
              <Button
                variant="outlined"
                fullWidth
                onClick={() => setSelectedBillForStats(bill)} // existing handler
                sx={{
                  color: COLORS.ACCENT_YELLOW,
                  borderColor: COLORS.ACCENT_YELLOW,
                  textTransform: "none",
                  "&:hover": {
                    borderColor: COLORS.ACCENT_YELLOW,
                    backgroundColor: `${COLORS.ACCENT_YELLOW}22`,
                  },
                }}
              >
                <BarChart3 size={18} style={{ marginRight: 8 }} />
                View Detailed Stats
              </Button>
            )}

            {/* --- Export Options --- */}
            {billVotes[bill.id] && billVotes[bill.id].length > 0 && (
              /* 🔹 Compact Export Icons */
              <Box
                sx={{
                  display: "flex",
                  gap: 1.5,
                  mt: 2,
                  justifyContent: "center",
                }}
              >
                <Button
                  size="small"
                  onClick={() => exportVotesToCSV(bill.title, votes)}
                  sx={{
                    minWidth: 0,
                    color: COLORS.TEXT_PRIMARY,
                  }}
                >
                  <FileSpreadsheet size={14} />
                  <Tooltip title="Export votes data as CSV file?">
                    <span className="pl-1 text-[12px]">CSV</span>
                  </Tooltip>
                </Button>

                <Button
                  size="small"
                  onClick={() => exportVotesToPDF(bill.title, votes)}
                  sx={{
                    minWidth: 0,
                    color: COLORS.TEXT_PRIMARY,
                  }}
                >
                  <FileText size={14} />{" "}
                  <Tooltip title="Export votes data as PDF file?">
                    <span className="pl-1 text-[12px]">PDF</span>
                  </Tooltip>
                </Button>

                <Button
                  size="small"
                  onClick={() => exportVotesToJSON(bill.title, votes)}
                  sx={{
                    minWidth: 0,
                    color: COLORS.TEXT_PRIMARY,
                  }}
                >
                  <FileCode size={14} />{" "}
                  <Tooltip title="Export votes data as JSON file?">
                    <span className="pl-1 text-[12px]">JSON</span>
                  </Tooltip>
                </Button>
              </Box>
            )}
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

  const publicBills = bills.filter((b) => b.type === "P");
  const parliamentaryBills = bills.filter((b) => b.type === "B");
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
            variant="h6"
            component="h1"
            sx={{ color: COLORS.HEADER_TITLE }}
          >
            Public Participation & Polling
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: { xs: 1, md: 0 } }}
          >
            Your voice matters. Vote on current issues and see real-time
            results.
          </Typography>
        </Box>

        {/* Center Section: Propose Bill Button (Always visible) */}
        <Box className="md:w-64 w-full md:mt-0 mt-3 flex-shrink-0 order-last md:order-none">
          <Button
            startIcon={<MdAddCircle />}
            variant="text"
            onClick={() => setIsModalOpen(true)}
            // Ensure button uses the softer accent color
            sx={{
              py: 1.5,
              fontWeight: "bold",
              textTransform: "uppercase",
              // backgroundColor: COLORS.ACCENT_YELLOW,
              // color: "black", // Text must be black for contrast
              "&:hover": {
                // backgroundColor: COLORS.ACCENT_YELLOW, // Keep hover same for consistency
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
      {/* <Card
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
      </Card> */}
      {/* --- END OFFLINE ALERT CARD --- */}

      {/* PROPOSE BILL COMPONENT */}
      <ProposeBillModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

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
            {/* {publicBills.map(renderBillCard)} */}
            {selectedBillForStats ? (
              <DetailedStats
                bill={selectedBillForStats}
                onBack={() => setSelectedBillForStats(null)}
              />
            ) : (
              publicBills.map((bill) => (
                <Box key={bill.id} sx={{ mb: 3 }}>
                  {renderBillCard(bill)}
                </Box>
              ))
            )}
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
