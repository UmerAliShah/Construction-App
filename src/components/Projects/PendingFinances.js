import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  MenuItem,
  Select,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress, // Import CircularProgress for loader
} from "@mui/material";
import apiClient from "../../api/apiClient"; // Assuming you're using apiClient for API requests
import { useLocation } from "react-router-dom";

const PendingFinances = () => {
  const location = useLocation();
  const selectedProject = location.state?.data;
  const [pendingRequests, setPendingRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null); // To store the selected request for approval/disapproval
  const [openDialog, setOpenDialog] = useState(false); // To control dialog visibility
  const [loading, setLoading] = useState(true); // Add loading state for fetching data

  useEffect(() => {
    fetchFinance();
  }, []);

  const fetchFinance = async () => {
    try {
      setLoading(true); // Show loader before fetching
      const response = await apiClient.get(
        `/finance/site/${selectedProject._id}`
      );
      if (response.status === 200) {
        const pending = response.data.filter(
          (request) => request.status === "pending"
        );
        setPendingRequests(pending);
      }
    } catch (error) {
      console.error("Error fetching pending finance requests:", error);
    } finally {
      setLoading(false); // Hide loader after fetching
    }
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

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <div className="p-6">
      <Typography variant="h5" className="mb-4 font-semibold text-gray-800">
        Pending Finances
      </Typography>

      <Paper elevation={0} className="p-4">
        {loading ? (
          <Box className="flex justify-center my-6">
            <CircularProgress color="primary" /> {/* CircularProgress while loading */}
          </Box>
        ) : (
          <TableContainer component={Paper} style={{ overflowX: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Request Name</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingRequests.map((request, index) => (
                  <TableRow key={index}>
                    <TableCell>{request.nameOfConcerned.name}</TableCell>
                    <TableCell>{request.nameOfConcerned.role}</TableCell>
                    <TableCell>
                      {new Date(request.nameOfConcerned.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{request.status}</TableCell>
                    <TableCell>
                      <Select
                        value=""
                        displayEmpty
                        onChange={(e) =>
                          handleApproveDisapprove(request._id, e.target.value)
                        }
                        renderValue={() => "Select Action"}
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

export default PendingFinances;
