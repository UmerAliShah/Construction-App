import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
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
  MenuItem,
  Paper,
  Select,
} from "@mui/material";
import Pagination from "../../Pagination"; // Import your custom Pagination component
import apiClient from "../../api/apiClient";

const FinancialRequests = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false); // Loader state
  const [openDialog, setOpenDialog] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1); // Added currentPage state
  const [selectedRequest, setSelectedRequest] = useState(null);

  const handleEntriesChange = (event) => {
    setEntriesPerPage(event.target.value);
    setCurrentPage(1); // Reset page to 1 when changing entries per page
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

  // Calculate paginated data
  const paginatedData = filteredData.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h5" className="mb-4 font-semibold text-gray-800">
          Financial Requests
        </Typography>
        {/*<Button
          variant="contained"
          className="mb-4 !bg-[#FC8908]"
          onClick={() => {}}
        >
          + Add Request
        </Button>*/}
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
                {paginatedData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.department}</TableCell>
                    <TableCell>{row.nameOfConcerned || "no name"}</TableCell>
                    <TableCell>{row.partstype}</TableCell>
                    <TableCell>{row.amount}</TableCell>
                    <TableCell>{row.amount}</TableCell>
                    <TableCell>
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
                    <TableCell>
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

      {/* Pagination Section */}
        <Pagination
          totalEntries={filteredData.length}
          entriesPerPage={entriesPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onEntriesPerPageChange={handleEntriesChange}
        />

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
