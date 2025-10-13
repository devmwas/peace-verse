import React from "react";
import {
  Avatar,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Typography,
  Paper,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import { MoreVertical } from "lucide-react";

const data = [
  {
    id: 1,
    name: "User 1",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    handle: "@user1_handle",
    severity: 92,
    status: "Flagged",
    hate: 12,
    tribalism: 5,
    extremism: 1,
    cyberbullying: 2,
    disinfo: 20,
    incitement: 8,
  },
  {
    id: 2,
    name: "User 2",
    avatar: "https://randomuser.me/api/portraits/women/45.jpg",
    handle: "@user2.profile",
    severity: 78,
    status: "Monitored",
    hate: 2,
    tribalism: 1,
    extremism: 0,
    cyberbullying: 15,
    disinfo: 5,
    incitement: 0,
  },
  {
    id: 3,
    name: "User 3",
    avatar: "https://randomuser.me/api/portraits/men/58.jpg",
    handle: "@user3_tok",
    severity: 55,
    status: "Monitored",
    hate: 0,
    tribalism: 0,
    extremism: 0,
    cyberbullying: 3,
    disinfo: 10,
    incitement: 0,
  },
  {
    id: 4,
    name: "User 4",
    avatar: "https://randomuser.me/api/portraits/women/67.jpg",
    handle: "@user4_danger",
    severity: 98,
    status: "Restricted",
    hate: 25,
    tribalism: 15,
    extremism: 10,
    cyberbullying: 5,
    disinfo: 30,
    incitement: 22,
  },
];

export default function Moderation() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedId, setSelectedId] = React.useState(null);

  // 🔹 New filter state
  const [filter, setFilter] = React.useState("All");

  const handleMenuOpen = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedId(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Flagged":
        return "error";
      case "Monitored":
        return "warning";
      case "Restricted":
        return "default";
      default:
        return "primary";
    }
  };

  // 🔹 Filtered data
  const filteredData =
    filter === "All" ? data : data.filter((row) => row.status === filter);

  return (
    <Box className="p-6">
      <Typography variant="h4" gutterBottom>
        Moderation Dashboard
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Identifying and monitoring peace breakers across social media and blogs
        — tribalists, misogynists, hate speech promoters, and inciters.
      </Typography>

      {/* Stats Section */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(auto-fit, minmax(180px, 1fr))"
        gap={2}
        sx={{ my: 3 }}
      >
        <Card>
          <CardContent>
            <Typography variant="h6">Total Users</Typography>
            <Typography variant="h4" fontWeight="bold">
              {data.length}
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6">Flagged</Typography>
            <Typography variant="h4" fontWeight="bold">
              {data.filter((d) => d.status === "Flagged").length}
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6">Restricted</Typography>
            <Typography variant="h4" fontWeight="bold">
              {data.filter((d) => d.status === "Restricted").length}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Filters */}
      <Box
        display="flex"
        gap={2}
        overflow="auto"
        sx={{
          mb: 2,
          maxWidth: "100vw", // ✅ don’t stretch past viewport
          whiteSpace: "nowrap", // ✅ keeps buttons in one line
        }}
      >
        {["All", "Flagged", "Monitored", "Restricted"].map((status) => (
          <Button
            key={status}
            variant={filter === status ? "contained" : "outlined"}
            color="primary"
            onClick={() => setFilter(status)}
          >
            {status}
          </Button>
        ))}
      </Box>

      {/* Table */}
      <TableContainer
        component={Paper}
        sx={{
          mt: 3,
          background: "#1E1E1E",
          overflowX: "auto", // horizontal scroll
          maxWidth: "100vw", // limit width

          /* 🔥 Dark Scrollbar Styling */
          "&::-webkit-scrollbar": {
            height: 10,
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#111", // dark track
            borderRadius: 10,
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#333", // subtle thumb
            borderRadius: 10,
            transition: "background 0.3s ease",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#666", // lighter on hover
          },
          "&::-webkit-scrollbar-corner": {
            backgroundColor: "transparent",
          },
          scrollbarWidth: "thin",
          scrollbarColor: "#333 #111",
        }}
      >
        <Table sx={{ minWidth: 1200 }}>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  position: "sticky",
                  left: 0,
                  zIndex: 3,
                  background: "#1E1E1E",
                  fontWeight: "bold",
                  whiteSpace: "nowrap",
                }}
              >
                User
              </TableCell>
              <TableCell sx={{ whiteSpace: "nowrap", fontWeight: "bold" }}>
                Severity
              </TableCell>
              <TableCell sx={{ whiteSpace: "nowrap", fontWeight: "bold" }}>
                Status
              </TableCell>
              <TableCell sx={{ whiteSpace: "nowrap", fontWeight: "bold" }}>
                Hate Speech
              </TableCell>
              <TableCell sx={{ whiteSpace: "nowrap", fontWeight: "bold" }}>
                Tribalism
              </TableCell>
              <TableCell sx={{ whiteSpace: "nowrap", fontWeight: "bold" }}>
                Extremism
              </TableCell>
              <TableCell sx={{ whiteSpace: "nowrap", fontWeight: "bold" }}>
                Cyberbullying
              </TableCell>
              <TableCell sx={{ whiteSpace: "nowrap", fontWeight: "bold" }}>
                Disinformation
              </TableCell>
              <TableCell sx={{ whiteSpace: "nowrap", fontWeight: "bold" }}>
                Incitement
              </TableCell>
              <TableCell
                sx={{ whiteSpace: "nowrap", fontWeight: "bold" }}
                align="center"
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredData.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell
                  sx={{
                    position: "sticky",
                    left: 0,
                    zIndex: 3,
                    background: "#1E1E1E",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    whiteSpace: "nowrap",
                    fontWeight: 500,
                  }}
                >
                  <img
                    src={row.avatar || "/placeholder-user.png"}
                    alt={row.user}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "1px solid #333",
                      flexShrink: 0,
                    }}
                  />
                  <span>{row.user}</span>
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  <LinearProgress
                    variant="determinate"
                    value={row.severity}
                    color="error"
                    sx={{ height: 8, borderRadius: 5 }}
                  />
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  <Chip
                    label={row.status}
                    color={getStatusColor(row.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{row.hate}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  {row.tribalism}
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  {row.extremism}
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  {row.cyberbullying}
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  {row.disinfo}
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  {row.incitement}
                </TableCell>
                <TableCell align="center" sx={{ whiteSpace: "nowrap" }}>
                  <IconButton onClick={(e) => handleMenuOpen(e, row.id)}>
                    <MoreVertical className="w-5 h-5 text-gray-400" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>View Details</MenuItem>
        <MenuItem onClick={handleMenuClose}>Export Data</MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: "error.main" }}>
          Escalate
        </MenuItem>
      </Menu>
    </Box>
  );
}
