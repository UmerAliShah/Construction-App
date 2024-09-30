import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
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
} from "@mui/material";
import Pagination from "../../Pagination";
import { ReactComponent as EditIcon } from "../Icons/edit.svg";
import { ReactComponent as VisibilityIcon } from "../Icons/quickView.svg";
import { ReactComponent as DeleteIcon } from "../Icons/bin.svg";
import apiClient from "../../api/apiClient";

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

const Finances = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selected, setSelected] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false); // To track if it's an edit operation
  const [editData, setEditData] = useState(null); // Store data to edit
  const [loading, setLoading] = useState(false); // Loader state for fetching data
  const [submitLoading, setSubmitLoading] = useState(false); // Loader for submitting or updating data
  const [formData, setFormData] = useState({
    department: "",
    nameOfConcerned: "",
    amount: "",
    totalGiven: "",
  });
  const [statusFilter, setStatusFilter] = useState("");

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(data.map((_, index) => index));
    } else {
      setSelected([]);
    }
  };

  const handleSelect = (index) => {
    const selectedIndex = selected.indexOf(index);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, index);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleEntriesChange = (event) => {
    setEntriesPerPage(event.target.value);
  };

  const handleOpen = () => {
    setIsEdit(false); // Not an edit operation
    setFormData({
      department: "",
      nameOfConcerned: "",
      amount: "",
      totalGiven: "",
    });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  // Fetch finance data with loader
  const fetchFinance = async () => {
    setLoading(true);
    const response = await apiClient.get("/finance/all");
    if (response.status === 200) {
      setData(response.data);
      setFilteredData(response.data);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinance();
  }, []);

  const handleStatusFilterChange = (e) => {
    const selectedStatus = e.target.value;
    setStatusFilter(selectedStatus);

    if (selectedStatus) {
      const filtered = data.filter(
        (item) => item.status.toLowerCase() === selectedStatus.toLowerCase()
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data); // If no filter selected, show all data
    }
  };

  // Handle form change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Add or update finance entry
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    const apiEndpoint = isEdit
      ? `/finance/update/${editData.id}` // Update endpoint
      : "/finance/"; // Create endpoint

    const response = await apiClient.post(apiEndpoint, formData);
    if (response.status === 200) {
      setSubmitLoading(false);
      handleClose();
      fetchFinance(); // Refresh data
    }
  };

  // Open modal with pre-filled data for editing
  const handleEdit = (row) => {
    setIsEdit(true);
    setEditData(row);
    setFormData({
      department: row.department || "",
      nameOfConcerned: row.nameOfConcerned?.name || "",
      amount: row.amount || "",
      totalGiven: row.totalGiven || row.amount, // Assuming totalGiven is the same as amount
    });
    setOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4 flex-col md:flex-row">
        <Typography variant="h5" className="mb-4 font-semibold text-gray-800">
          Finances
        </Typography>
        
        <div className="flex flex-row items-start md:items-center gap-4">
          <Select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            displayEmpty
            size="small"
            className="mb-4 md:mb-0 bg-white"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
          </Select>

          <Button
            variant="contained"
            color="primary"
            className="!bg-[#FC8908]"
            onClick={() => setOpen(true)}
          >
            + Add New Finance
          </Button>
        </div>
      </div>

      <Paper elevation={0} className="p-4">
        {loading ? (
          <div className="flex justify-center my-6">
            <CircularProgress color="primary" />
          </div>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      indeterminate={
                        selected.length > 0 && selected.length < data.length
                      }
                      checked={
                        data.length > 0 && selected.length === data.length
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
                  <TableCell>Approved By</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((row, index) => (
                  <TableRow key={row.id}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={selected.indexOf(index) !== -1}
                        onChange={() => handleSelect(index)}
                      />
                    </TableCell>
                    <TableCell>{row.department}</TableCell>
                    <TableCell>{row.nameOfConcerned?.name || "no name"}</TableCell>
                    <TableCell>{row.partstype}</TableCell>
                    <TableCell>{row.amount}</TableCell>
                    <TableCell>{row.totalGiven || row.amount}</TableCell>
                    <TableCell>{row.status}</TableCell>
                    <TableCell>{row.approvedBy?.name || "Not Approved"}</TableCell>
                    <TableCell>
                    <Box
                        className="flex items-center justify-between rounded-lg border border-gray-300"
                        sx={{ backgroundColor: '#f8f9fa' }}>
                        <IconButton aria-label="edit" onClick={() => handleEdit(row)} sx={{ color: '#6c757d' }}>
                            <VisibilityIcon />
                        </IconButton>
                        <Divider orientation="vertical" flexItem sx={{ borderColor: '#e0e0e0' }} />
                        <IconButton aria-label="delete" sx={{ color: '#dc3545' }}>
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <div className="flex justify-between items-center mt-6">
        <div className="flex items-center">
          <Typography
            variant="body2"
            color="textSecondary"
            className="mr-2 pr-4"
          >
            Showing
          </Typography>
          <Select
            value={entriesPerPage}
            onChange={handleEntriesChange}
            size="small"
            className="mr-2 dropdown-svg bg-orange-400 text-white"
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
          <Typography variant="body2" color="textSecondary">
            of 10,678 entries
          </Typography>
        </div>
        <Pagination
          count={5}
          onPageChange={(page) => console.log("Page:", page)}
        />
      </div>

      {/* Modal for adding or editing finance */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-title" variant="h6" component="h2">
            {isEdit ? "Edit Finance Entry" : "Add New Finance Entry"}
          </Typography>
          <Box
            component="form"
            noValidate
            autoComplete="off"
            className="flex flex-col gap-4 mt-4"
            onSubmit={handleSubmit}
          >
            <TextField
              required
              name="department"
              label="Department Type"
              value={formData.department}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              required
              name="nameOfConcerned"
              label="Name of Person Concerned"
              value={formData.nameOfConcerned}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              required
              name="amount"
              label="Amount Given"
              value={formData.amount}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              required
              name="totalGiven"
              label="Total Given So Far"
              value={formData.totalGiven}
              onChange={handleChange}
              fullWidth
            />
            <div className="flex justify-end mt-4">
              <Button onClick={handleClose} color="error">
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className="!bg-[#FC8908]"
                sx={{ ml: 2 }}
                disabled={submitLoading}
              >
                {submitLoading ? <CircularProgress size={20} /> : "Submit"}
              </Button>
            </div>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default Finances;
