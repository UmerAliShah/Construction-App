import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  MenuItem,
  Modal,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputLabel,
} from "@mui/material";
import { ReactComponent as VisibilityIcon } from "../Icons/quickView.svg";
import { ReactComponent as DeleteIcon } from "../Icons/bin.svg";
import DescriptionIcon from "@mui/icons-material/Description";
import Pagination from "../../Pagination";
import apiClient from "../../api/apiClient";
import { fetchSites } from "../../Sidebar";
import { useSelector } from "react-redux";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "8px",
};

const Machineryparts = () => {
  const { role: currentRole } = useSelector((state) => state.auth);
  const [selected, setSelected] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [projects, setProjects] = useState([]);
  const [open, setOpen] = useState(false);
  const [partOpen, setPartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [availableMachinary, setAvailableMachinary] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = async () => {
    try {
      const response = await apiClient.get("/machinery");
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };
  const fetchAvailable = async () => {
    try {
      const response = await apiClient.get("/machinery");
      setAvailableMachinary(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching machinery:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
    fetchSites(setProjects);
    fetchAvailable();
  }, []);

  const paginatedData = data.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  return (
    <Box className="p-6">
      <Box className="flex justify-between items-center mb-4">
        <Typography variant="h5" className="mb-4 font-semibold text-gray-800">
          Machinery Parts
        </Typography>
      </Box>
      <Paper elevation={0} className="">
        <TableContainer component={Paper}>
          <Table stickyHeader aria-label="company inventory table">
            <TableHead>
              <TableRow>
                <TableCell>Machinery Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Picture/Documents</TableCell>
                <TableCell>Reference Number</TableCell>
                <TableCell>Working On</TableCell>
                <TableCell>Parts Demand</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((row, index) => (
                  <TableRow key={index} hover>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell>
                      <Button
                        variant="text"
                        style={{ color: "#007bff", textTransform: "none" }}
                        startIcon={<DescriptionIcon />}
                        href={row.document}
                        target="_blank"
                      >
                        View Document
                      </Button>
                    </TableCell>
                    <TableCell>{row.trackingNumber}</TableCell>
                    <TableCell>{row.workingOn?.name || "-"}</TableCell>
                    <TableCell>
                      {row.partsDemandType?.map((part, idx) => (
                        <div key={idx}>
                          {part.partDemandType} - {part.status}
                        </div>
                      ))}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Pagination
        totalEntries={data.length}
        entriesPerPage={entriesPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onEntriesPerPageChange={setEntriesPerPage}
      />
    </Box>
  );
};

export default Machineryparts;
