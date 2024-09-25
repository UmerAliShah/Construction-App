import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Divider,
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
  TextField,
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

// Mock roles for demonstration
const userRole = "Owner"; // Example user role

// Sample data based on roles
const demoData = Array(10)
  .fill()
  .map((_, index) => ({
    id: index + 1,
    requester: "Employee " + (index + 1),
    department: "Finance",
    requestAmount: `$${(index + 1) * 1000}.00`,
    status:
      index % 4 === 0
        ? "Approved"
        : index % 4 === 1
        ? "Disapproved"
        : index % 4 === 2
        ? "Waiting for approval"
        : "Completed",
    document: "Link_to_Document.pdf",
  }));

// Role-based filtering of data
const filterDataByRole = (data, role) => {
  switch (role) {
    case "Owner":
    case "Owner Assistant":
      return data;
    case "Office Assistant":
      return data.filter((item) => item.requester === "Employee 1"); // Assuming 'Employee 1' is the Office Assistant
    case "Site Head":
    case "Project Manager":
      return data.filter((item) =>
        ["Employee 1", "Employee 2", "Employee 3"].includes(item.requester)
      );
    case "Supply Manager":
      return data.filter((item) => item.requester === "Employee 2"); // Assuming 'Employee 2' is the Supply Manager
    default:
      return [];
  }
};

const FinancialRequests = () => {
  const [selected, setSelected] = useState([]);
  const [data, setData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [selectedRequest, setSelectedRequest] = useState(null); 
  const [filteredData, setFilteredData] = useState(
    filterDataByRole(demoData, userRole)
  );

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(filteredData.map((item) => item.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelect = (id) => {
    const selectedIndex = selected.indexOf(id);
    const newSelected =
      selectedIndex === -1
        ? selected.concat(id)
        : selected.filter((item) => item !== id);
    setSelected(newSelected);
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
    const response = await apiClient.get("/finance/status/all");
    if (response.status === 200) {
      setData(response.data);
      console.log(response.data, "res");
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
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    indeterminate={
                      selected.length > 0 &&
                      selected.length < filteredData.length
                    }
                    checked={
                      filteredData.length > 0 &&
                      selected.length === filteredData.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
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
              {data.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={selected.indexOf(index) !== -1}
                      onChange={() => handleSelect(index)}
                    />
                  </TableCell>
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
