import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Modal,
  Paper,
  Select,
  MenuItem,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  IconButton,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { ReactComponent as VisibilityIcon } from "../Icons/quickView.svg";
import { ReactComponent as DeleteIcon } from "../Icons/bin.svg";
import apiClient from "../../api/apiClient";
import Pagination from "../../Pagination";
import { useLocation } from "react-router-dom";

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
  const location = useLocation();
  const selectedProject = location.state?.data;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initialData = {
    nameOfConcerned: "",
    type: "",
    amount: "",
    document: "",
  };
  const [finance, setFinance] = useState(initialData);
  const [selected, setSelected] = useState(null); // Store the selected finance record for updating
  const [employees, setEmployees] = useState([]);
  console.log(employees,'test')

  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [financeToDelete, setFinanceToDelete] = useState(null);

  const handleEntriesChange = (event) => {
    setEntriesPerPage(event.target.value);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setFinance(initialData); // Reset form when closing
    setSelected(null); // Reset selected item
    setOpen(false);
  };

  const fetchFinance = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(`/finance/site/${selectedProject._id}`);
      if (response.status === 200) {
        setData(response.data);
      }
    } catch (error) {
      console.error("Error fetching finance data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setEmployees([
      ...selectedProject.employees,
      selectedProject.siteHead,
      selectedProject.assistant,
    ]);
    fetchFinance();
  }, []);

  const handleEditClick = (row) => {
    setSelected(row); // Set the selected row for updating
    setFinance({
      nameOfConcerned: row.nameOfConcerned?._id || "",
      type: row.partstype,
      amount: row.amount,
      document: "", // Document will be re-uploaded if needed
    });
    handleOpen(); // Open the modal
  };

  const handleDelete = async (id) => {
    try {
      await apiClient.delete(`/finance/${id}`);
      fetchFinance(); // Refresh the data after deletion
    } catch (error) {
      console.error("Error deleting finance record:", error);
    }
  };

  const handleOpenConfirmDialog = (finance) => {
    setFinanceToDelete(finance);
    setOpenConfirmDialog(true);
  };
  
  const handleCloseConfirmDialog = () => {
    setFinanceToDelete(null);
    setOpenConfirmDialog(false);
  };

  const confirmDelete = async () => {
    if (financeToDelete) {
      try {
        await apiClient.delete(`/finance/${financeToDelete._id}`);
        fetchFinance(); // Refresh data after deletion
        handleCloseConfirmDialog(); // Close the dialog
      } catch (error) {
        console.error("Error deleting finance record:", error);
      }
    }
  };  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("nameOfConcerned", finance.nameOfConcerned);
    formData.append("partstype", finance.type);
    formData.append("amount", finance.amount);
    formData.append("site", selectedProject._id);
    formData.append("department", "projects");
    if (finance.document) {
      formData.append("document", finance.document);
    }

    try {
      if (selected) {
        // Update existing finance
        await apiClient.put(`/finance/${selected._id}`, formData);
      } else {
        // Create new finance
        await apiClient.post("/finance", formData);
      }
      handleClose();
      fetchFinance();
    } catch (error) {
      console.error("Error adding/updating finance record:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const paginatedData = data.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  return (
    <Box className="p-6">
      <Box className="flex justify-between items-center mb-4">
        <Typography variant="h5" className="mb-4 font-semibold text-gray-800">
          Projects &gt; Finance
        </Typography>
        <Button
          variant="contained"
          className="mb-4 !bg-[#FC8908]"
          onClick={handleOpen}
        >
          + Add Daily Expense
        </Button>
      </Box>
      <Paper elevation={0} className="p-4">
        {loading ? (
          <Box className="flex justify-center my-6">
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Department Type</TableCell>
                  <TableCell>Name of Person Concerned</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Amount Given</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Approved By</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.department}</TableCell>
                    <TableCell>{row.nameOfConcerned?.name || "no name"}</TableCell>
                    <TableCell>{row.partstype}</TableCell>
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
                    <TableCell>{row.approvedBy?.name || "Not Approved"}</TableCell>
                    <TableCell>
                      <Box
                        className="flex items-center justify-around rounded-lg border border-gray-300"
                        sx={{ backgroundColor: "#f8f9fa" }}
                      >
                        <IconButton
                          aria-label="edit"
                          sx={{ color: "#6c757d" }}
                          onClick={() => handleEditClick(row)} // Edit action
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <Divider orientation="vertical" flexItem sx={{ borderColor: "#e0e0e0" }} />
                        <IconButton aria-label="delete" sx={{ color: "#dc3545" }} onClick={() => handleOpenConfirmDialog(row)} >
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

      {/* Modal for adding/updating Daily Expense */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-title" variant="h6" component="h2">
            {selected ? "Update Office Finance Entry" : "Add Office Finance Entry"}
          </Typography>
          <Box
            component="form"
            noValidate
            autoComplete="off"
            className="flex flex-col gap-4 mt-4"
            onSubmit={handleSubmit}
          >
            <Select
              required
              fullWidth
              displayEmpty
              value={finance.nameOfConcerned}
              onChange={(e) =>
                setFinance({ ...finance, nameOfConcerned: e.target.value })
              }
            >
              <MenuItem value="">Name of Concerned</MenuItem>
              {employees?.map((user) => (
                <MenuItem key={user?._id} value={user?._id}>
                  {user?.name}
                </MenuItem>
              ))}
            </Select>
            <TextField
              required
              id="type"
              label="Type"
              fullWidth
              value={finance.type}
              onChange={(e) => setFinance({ ...finance, type: e.target.value })}
            />
            <TextField
              required
              id="amount"
              label="Amount"
              fullWidth
              value={finance.amount}
              onChange={(e) =>
                setFinance({ ...finance, amount: e.target.value })
              }
            />
            <TextField
              id="document"
              fullWidth
              type="file"
              onChange={(e) =>
                setFinance({ ...finance, document: e.target.files[0] })
              }
            />
            <div className="flex justify-end mt-4">
              <Button onClick={handleClose} color="error">
                Cancel
              </Button>
              <Button type="submit" variant="contained" className="!bg-[#FC8908]" disabled={isSubmitting}>
                {isSubmitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  selected ? "Update Finance" : "Add Finance"
                )}
              </Button>
            </div>
          </Box>
        </Box>
      </Modal>

      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this finance record?
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleCloseConfirmDialog} color="primary">
            Cancel
            </Button>
            <Button onClick={confirmDelete} color="error" autoFocus>
            Delete
            </Button>
        </DialogActions>
        </Dialog>

      <Pagination
        totalEntries={data.length}
        entriesPerPage={entriesPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onEntriesPerPageChange={handleEntriesChange}
      />
    </Box>
  );
};

export default Finances;
