import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress, // Import CircularProgress
  Grid,
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
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import Pagination from "../../Pagination";
import { ReactComponent as EditIcon } from "../Icons/edit.svg";
import { ReactComponent as VisibilityIcon } from "../Icons/quickView.svg";
import { ReactComponent as DeleteIcon } from "../Icons/bin.svg";
import apiClient from "../../api/apiClient";

const userRole = "Owner"; // Example user role

const FinancialRequests = () => {
  const [selected, setSelected] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false); // Loader state
  const [openDialog, setOpenDialog] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [selectedRequest, setSelectedRequest] = useState(null); 
  const [filteredData, setFilteredData] = useState([]);
  
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(filteredData.map((item) => item.id));
    } else {
      setSelected([]);
    }
  };

  const handleEntriesChange = (event) => {
    setEntriesPerPage(event.target.value);
  };

  const handleApproveDisapprove = (requestId, action) => {
    setSelectedRequest({ requestId, action });
    setOpenDialog(true);
  };

  const handleConfirmAction = async () => {
    try {
      const { requestId, action } = selectedRequest;
      const result = await apiClient.put(`/finance/approve/${requestId}`, {
        status: action,
      });
      if (result.status === 200) {
        fetchFinance();
        setOpenDialog(false);
      }
    } catch (error) {
      console.error("Error updating request status:", error);
    }
  };

  const fetchFinance = async () => {
    setLoading(true); // Start loading
    const response = await apiClient.get("/finance/status/all");
    if (response.status === 200) {
      setData(response.data);
      setFilteredData(response.data);
      setLoading(false); // Stop loading
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  useEffect(() => {
    fetchFinance();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h5" className="mb-4 font-semibold text-gray-800">
          Financial Requests
        </Typography>
        <Button
          variant="contained"
          className="mb-4 !bg-[#FC8908]"
          onClick={() => {}}
        >
          + Add Request
        </Button>
      </div>

      <Paper elevation={0} className="p-4">
        {loading ? ( // Show CircularProgress while loading
          <div className="flex justify-center my-6">
            <CircularProgress color="primary" />
          </div>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Department Type</TableCell>
                  <TableCell>Name of Person Concerned</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Amount Given</TableCell>
                  <TableCell>Total Given So Far</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((row, index) => (
                  <TableRow key={row.id}>
                    <TableCell className="flex-1">{row.department}</TableCell>
                    <TableCell className="flex-1">
                      {row.nameOfConcerned || "no name"}
                    </TableCell>
                    <TableCell className="flex-1">{row.partstype}</TableCell>
                    <TableCell className="flex-1">{row.amount}</TableCell>
                    <TableCell className="flex-1">{row.amount}</TableCell>
                    <TableCell className="flex-1">
                      <span
                        style={{
                          background: "#62912C47",
                          borderRadius: "40px",
                          padding: "10px",
                        }}
                      >
                        {row.status}
                      </span>
                    </TableCell>
                    <TableCell
                      className="flex items-center justify-between rounded-lg border border-gray-300"
                      sx={{ backgroundColor: "#f8f9fa" }}
                    >
                      <Select
                        value=""
                        displayEmpty
                        onChange={(e) =>
                          handleApproveDisapprove(row._id, e.target.value)
                        }
                        renderValue={() => "Select Action"}
                        className="flex-1"
                      >
                        <MenuItem value="approved">Approve</MenuItem>
                        <MenuItem value="rejected">Reject</MenuItem>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <div className="flex justify-between items-center mt-6">
        <Typography variant="body2" color="textSecondary" className="mr-2">
          Showing {entriesPerPage} of {filteredData.length} entries
        </Typography>
        <Pagination
          count={5}
          onPageChange={(page) => console.log("Page:", page)}
        />
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to {selectedRequest?.action} this request?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmAction} color="secondary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FinancialRequests;
