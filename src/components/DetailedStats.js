import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  Tabs,
  Tab,
  useMediaQuery,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { COLORS } from "../theme";
import {
  exportVotesToCSV,
  exportVotesToPDF,
  exportVotesToJSON,
} from "../utils/exportHelpers";
import { listenToBillVotes } from "../firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  FileSpreadsheet,
  FileCode,
  Download,
  ArrowLeft,
} from "lucide-react";

const chartColors = ["#FFC107", "#4CAF50", "#03A9F4", "#E91E63", "#9C27B0"];

const DetailedStats = ({ bill, onBack }) => {
  const [votes, setVotes] = useState([]);
  const [chartType, setChartType] = useState("bar");
  const [activeTab, setActiveTab] = useState(0);
  const isMobile = useMediaQuery("(max-width: 900px)");

  useEffect(() => {
    const unsub = listenToBillVotes(bill.id, (liveVotes) =>
      setVotes(liveVotes)
    );
    return () => unsub();
  }, [bill.id]);

  const grouped = votes.reduce((acc, v) => {
    acc[v.voteOption] = (acc[v.voteOption] || 0) + 1;
    return acc;
  }, {});
  const total = votes.length || 1;
  const chartData = Object.keys(grouped).map((k) => ({
    option: k,
    count: grouped[k],
    percent: Math.round((grouped[k] / total) * 100),
  }));

  const renderChart = () => {
    const chartKey = chartType + "-" + votes.length;
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={chartKey}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.4 }}
        >
          {chartType === "pie" && (
            <ResponsiveContainer width="100%" height={340}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="count"
                  nameKey="option"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label
                >
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={chartColors[i % chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}

          {chartType === "line" && (
            <ResponsiveContainer width="100%" height={340}>
              <LineChart data={chartData}>
                <XAxis dataKey="option" stroke="#ccc" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke={COLORS.ACCENT_YELLOW}
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          )}

          {chartType === "bar" && (
            <ResponsiveContainer width="100%" height={340}>
              <BarChart data={chartData}>
                <XAxis dataKey="option" stroke="#ccc" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count">
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={chartColors[i % chartColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>
      </AnimatePresence>
    );
  };

  // 🧭 Back navigation improvement
  const handleBack = () => {
    if (onBack) {
      onBack("public-proposals");
    }
  };

  const renderBillCard = () => (
    <Card
      elevation={4}
      sx={{
        p: 3,
        backgroundColor: COLORS.CARD_BG,
        color: "#fff",
        height: "fit-content",
      }}
    >
      {/* Back to bills and polling */}
      <Button
        variant="text"
        sx={{ mb: 2, display: "flex", justifyContent: "flex-start" }}
        onClick={handleBack}
        color={COLORS.TEXT_PRIMARY}
        fullWidth
        startIcon={<ArrowLeft size={14} />}
      >
        Back to Bills & Polling
      </Button>

      <Typography variant="h6" sx={{ color: COLORS.ACCENT_YELLOW, mb: 1 }}>
        {bill.title}
      </Typography>
      <Typography variant="body2" sx={{ mb: 1 }}>
        Proposed by: <strong>{bill.createdByName || "Parliament"}</strong>
      </Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>
        {bill.summary || "No summary available."}
      </Typography>
      <Typography variant="caption" sx={{ color: "#ccc" }}>
        {votes.length} total votes (live)
      </Typography>
    </Card>
  );

  const renderStats = () => (
    <Card
      elevation={4}
      sx={{
        p: 3,
        backgroundColor: COLORS.CARD_BG,
        color: "#fff",
      }}
    >
      {/* Back to bills and polling */}
      <div className="block lg:hidden">
        <Button
          variant="text"
          sx={{ mb: 2, display: "flex", justifyContent: "flex-start" }}
          onClick={handleBack}
          color={COLORS.TEXT_PRIMARY}
          fullWidth
          startIcon={<ArrowLeft size={14} />}
        >
          Back to Bills & Polling
        </Button>
      </div>

      <Typography variant="h6" sx={{ color: COLORS.ACCENT_YELLOW, mb: 2 }}>
        Voting Stats
      </Typography>
      <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
        {["bar", "pie", "line"].map((type) => (
          <Button
            key={type}
            variant={chartType === type ? "contained" : "outlined"}
            onClick={() => setChartType(type)}
            sx={{ textTransform: "capitalize" }}
          >
            {type} chart
          </Button>
        ))}
      </Box>
      {renderChart()}
    </Card>
  );

  const renderVoters = () => (
    <Card
      elevation={4}
      sx={{
        p: 3,
        backgroundColor: COLORS.CARD_BG,
        color: "#fff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Back to bills and polling */}
      <div className="block lg:hidden">
        <Button
          variant="text"
          sx={{ mb: 2, display: "flex", justifyContent: "flex-start" }}
          onClick={handleBack}
          color={COLORS.TEXT_PRIMARY}
          fullWidth
          startIcon={<ArrowLeft size={14} />}
        >
          Back to Bills & Polling
        </Button>
      </div>

      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
        <Button onClick={() => exportVotesToCSV(bill.title, votes)}>
          <Download size={14} />
          <span className="ml-1">CSV</span>
        </Button>
        <Button onClick={() => exportVotesToPDF(bill.title, votes)}>
          <Download size={14} />
          <span className="ml-1">PDF</span>
        </Button>
        <Button onClick={() => exportVotesToJSON(bill.title, votes)}>
          <Download size={14} />
          <span className="ml-1">JSON</span>
        </Button>
      </Box>

      <Typography variant="h6" sx={{ color: COLORS.ACCENT_YELLOW, mb: 1 }}>
        Voters ({votes.length})
      </Typography>

      {/* 🧾 Table Header */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "0.3fr 1fr 1fr auto",
          borderBottom: "1px solid rgba(255,255,255,0.2)",
          pb: 1,
          mb: 1,
          fontWeight: "bold",
          fontSize: "0.9rem",
          color: COLORS.ACCENT_YELLOW,
        }}
      >
        <span>#</span>
        <span>Display Name</span>
        <span style={{ textAlign: "right" }}>Vote</span>
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          maxHeight: "60vh",
          pr: 1,
        }}
      >
        {votes.length === 0 ? (
          <Typography variant="body2" sx={{ opacity: 0.6 }}>
            No votes yet.
          </Typography>
        ) : (
          votes.map((v, i) => (
            <Box
              key={v.id || i}
              sx={{
                display: "grid",
                gridTemplateColumns: "0.3fr 1fr 1fr auto",
                alignItems: "center",
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                py: 1,
                fontSize: "0.85rem",
              }}
            >
              <Typography variant="body2">{i + 1}</Typography>
              <Typography variant="body2">
                {v.userDisplayName || "Anonymous"}
              </Typography>

              <Typography
                variant="body2"
                sx={{ color: COLORS.ACCENT_YELLOW, textAlign: "right" }}
              >
                {v.voteOption}
              </Typography>
            </Box>
          ))
        )}
      </Box>
    </Card>
  );

  // --- Mobile Tabs ---
  if (isMobile) {
    return (
      <Box
        sx={{
          width: "100%",
          minHeight: "calc(100vh - 120px)", // leaves space for navs
          backgroundColor: COLORS.BACKGROUND,
          color: "#fff",
          p: 2,
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(e, val) => setActiveTab(val)}
          centered
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Bill" />
          <Tab label="Stats" />
          <Tab label="Voters" />
        </Tabs>

        <Box sx={{ mt: 2 }}>
          {activeTab === 0 && renderBillCard()}
          {activeTab === 1 && renderStats()}
          {activeTab === 2 && renderVoters()}
        </Box>
      </Box>
    );
  }

  // --- Desktop Layout ---
  return (
    <Box
      sx={{
        width: "90vw",
        maxWidth: "1400px",
        margin: "0 auto",
        minHeight: "calc(100vh - 120px)", // respect top/bottom navs
        overflow: "hidden",
        backgroundColor: COLORS.BACKGROUND,
        color: "#fff",
        p: 3,
      }}
    >
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderBillCard()}
        {renderStats()}
        {renderVoters()}
      </motion.div>
    </Box>
  );
};

export default DetailedStats;
