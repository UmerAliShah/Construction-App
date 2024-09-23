import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Grid,
  Typography,
  Paper,
  MenuItem,
  Select,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import apiClient from '../../api/apiClient'; // Assuming you're using apiClient for API requests

const PendingEmployees = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null); // To store the selected request for approval/disapproval
  const [openDialog, setOpenDialog] = useState(false); // To control dialog visibility

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      const response = await apiClient.get('/requests/pending'); // Replace with your actual endpoint
      setPendingRequests(response.data);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
    }
  };

  const handleApproveDisapprove = (requestId, action) => {
    setSelectedRequest({ requestId, action });
    setOpenDialog(true);
  };

  const handleConfirmAction = async () => {
    try {
      const { requestId, action } = selectedRequest;
      await apiClient.put(`/requests/${requestId}`, { status: action }); // Make an API call to update the status

      // Update the pendingRequests state to remove the processed request
      setPendingRequests((prevRequests) =>
        prevRequests.filter((request) => request._id !== requestId)
      );

      setOpenDialog(false);
    } catch (error) {
      console.error('Error updating request status:', error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <div className="p-6">
      <Typography variant="h5" className="mb-4 font-semibold text-gray-800">
        Pending Requests
      </Typography>

      <Paper elevation={0} className="p-4">
        <Grid container>
          {/* Table Headings */}
          <Grid item xs={12}>
            <Box className="bg-white-50 p-2 rounded-md flex items-center justify-between">
              <Typography className="flex-1 !font-semibold">Request Name</Typography>
              <Typography className="flex-1 !font-semibold">Requester</Typography>
              <Typography className="flex-1 !font-semibold">Date</Typography>
              <Typography className="flex-1 !font-semibold">Action</Typography>
            </Box>
          </Grid>

          {/* Table Rows */}
          {pendingRequests.map((request, index) => (
            <Grid item xs={12} key={index}>
              <Box className="shadow-sm rounded-lg p-2 flex items-center justify-between border-b-2 my-2">
                <Typography className="flex-1">{request.name}</Typography>
                <Typography className="flex-1">{request.requester}</Typography>
                <Typography className="flex-1">{new Date(request.date).toLocaleDateString()}</Typography>

                <Select
                  value=""
                  displayEmpty
                  onChange={(e) =>
                    handleApproveDisapprove(request._id, e.target.value)
                  }
                  renderValue={() => 'Select Action'}
                  className="flex-1"
                >
                  <MenuItem value="approve">Approve</MenuItem>
                  <MenuItem value="disapprove">Disapprove</MenuItem>
                </Select>
              </Box>
            </Grid>
          ))}
        </Grid>
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

export default PendingEmployees;
