import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import Pagination from "../../Pagination"; // Importing your custom pagination component
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
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
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

  const handleEntriesChange = (event) => {
    setEntriesPerPage(event.target.value);
    setCurrentPage(1); // Reset to first page when entries per page changes
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
    const response = await apiClient.get("/finance/allUser");
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
  const handleEdit = async (row) => {
    setIsEdit(true);
    setEditData(row);
    const result = await apiClient.get(`/finance/user/${row.userId}`);
    setFormData({
      department: row.department || "",
      nameOfConcerned: row.nameOfConcerned?.name || "",
      amount: row.amount || "",
      totalGiven: row.totalGiven || row.amount, // Assuming totalGiven is the same as amount
    });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      try {
        await apiClient.delete(`/finance/delete/${id}`); // API call to delete
        fetchFinance(); // Refresh the finance data after deletion
      } catch (error) {
        console.error("Error deleting finance entry", error);
      }
    }
  };

  // Calculate paginated data
  const paginatedData = filteredData.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4 flex-col md:flex-row">
        <Typography variant="h5" className="mb-4 font-semibold text-gray-800">
          Finances
        </Typography>
      </div>

      {/*<div className="flex flex-row items-start md:items-center gap-4">
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
        </div>*/}

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
                  <TableCell>Name of Person Concerned</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Employee Id</TableCell>
                  <TableCell>Total Given So Far</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((row, index) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.nameOfConcerned || "no name"}</TableCell>
                    <TableCell>{row.role}</TableCell>
                    <TableCell>{row.employeeId}</TableCell>
                    <TableCell>{row.totalAmount}</TableCell>
                    <TableCell>
                      <Box
                        className="flex items-center justify-around rounded-lg border border-gray-300"
                        sx={{ backgroundColor: "#f8f9fa" }}
                      >
                        <IconButton
                          aria-label="edit"
                          onClick={() => handleEdit(row)}
                          sx={{ color: "#6c757d" }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <Divider
                          orientation="vertical"
                          flexItem
                          sx={{ borderColor: "#e0e0e0" }}
                        />
                        <IconButton
                          aria-label="delete"
                          onClick={() => handleDelete(row.id)}
                          sx={{ color: "#dc3545" }}
                        >
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

      <Pagination
        totalEntries={filteredData.length}
        entriesPerPage={entriesPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onEntriesPerPageChange={handleEntriesChange}
      />

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
