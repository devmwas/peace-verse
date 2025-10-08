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

  return (
    <Box className="p-6">
      <Typography variant="h4" gutterBottom>
        Moderation Dashboard
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Identifying and monitoring peace breakers across social media and blogs
        — tribalists, misogynists, hate speech promoters, and inciters.
      </Typography>

      <TableContainer component={Paper} sx={{ mt: 3, background: "#1E1E1E" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Severity</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Hate Speech</TableCell>
              <TableCell>Tribalism</TableCell>
              <TableCell>Extremism</TableCell>
              <TableCell>Cyberbullying</TableCell>
              <TableCell>Disinformation</TableCell>
              <TableCell>Incitement</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar src={row.avatar} alt={row.name} />
                    <Box>
                      <Typography variant="subtitle2">{row.name}</Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontSize="0.8rem"
                      >
                        {row.handle}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell sx={{ width: 150 }}>
                  <LinearProgress
                    variant="determinate"
                    value={row.severity}
                    color="error"
                    sx={{ height: 8, borderRadius: 5 }}
                  />
                  <Typography variant="caption">{row.severity}</Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={row.status}
                    color={getStatusColor(row.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{row.hate}</TableCell>
                <TableCell>{row.tribalism}</TableCell>
                <TableCell>{row.extremism}</TableCell>
                <TableCell>{row.cyberbullying}</TableCell>
                <TableCell>{row.disinfo}</TableCell>
                <TableCell>{row.incitement}</TableCell>
                <TableCell align="center">
                  <IconButton onClick={(e) => handleMenuOpen(e, row.id)}>
                    <MoreVertical className="w-5 h-5 text-gray-600" />
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
