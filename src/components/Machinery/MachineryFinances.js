import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Divider,
  IconButton,
  MenuItem,
  Modal,
  Paper,
  Select,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from "@mui/material";
import { DotLoader } from "react-spinners";
import { ReactComponent as VisibilityIcon } from "../Icons/quickView.svg";
import { ReactComponent as DeleteIcon } from "../Icons/bin.svg";
import DescriptionIcon from "@mui/icons-material/Description";
import Pagination from "../../Pagination";
import apiClient from "../../api/apiClient";
import Toast from "../Toast";

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

const MachineryFinance = () => {
  const [selected, setSelected] = useState([]);
  const [machinery, setMachinery] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [selectedFinance, setSelectedFinance] = useState(null);
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const initialData = {
    machinery: "",
    type: "",
    amount: "",
    document: "",
  };

  const [finance, setFinance] = useState(initialData);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toastData, SetToastData] = useState({
    bg: null,
    message: null,
  });
  const [showToast, setShowToast] = useState(false);
  // Simulate data fetching

  const fetchMachinery = async () => {
    const result = await apiClient.get("/machinery");
    setMachinery(result.data);
  };

  const showToastMessage = (message, bg) => {
    SetToastData({ message, bg });
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

  useEffect(() => {
    fetchMachinery();
    fetchFinance();
  }, []);



  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true); // Show loader during create/update

    // Create formData to handle file upload (document)
    const formData = new FormData();
    formData.append("machinery", finance.machinery);
    formData.append("partstype", finance.type);
    formData.append("amount", finance.amount);
    formData.append("department", "machinery");
    if (finance.document) {
      formData.append("document", finance.document);
    }

    try {
      if (selectedFinance) {
        // Update the existing finance entry
        await apiClient.put(`/finance/${selectedFinance._id}`, formData);
        showToastMessage("Finance Updated Successfully", "bg-success");
      } else {
        // Create new finance entry
        await apiClient.post("/finance", formData);
        showToastMessage("Finance Added Successfully", "bg-success");
      }

      handleClose();
      fetchFinance();
      setFinance(initialData);
    } catch (error) {
      console.error("Error adding/updating finance record:", error);
    } finally {
      setIsSaving(false); // Hide loader after saving
    }
  };

  const fetchFinance = async () => {
    setLoading(true); // Show loader during data fetching
    const response = await apiClient.get("/finance/machinery");
    if (response.status === 200) {
      console.log(response.data,'mac')
      setData(response.data);
    }
    setLoading(false); // Hide loader after data fetching
  };

  const handleEdit = (financeEntry) => {
    setSelectedFinance(financeEntry);
    setFinance({
      machinery: financeEntry.machinery._id || "",
      type: financeEntry.partstype || "",
      amount: financeEntry.amount || "",
      document: "",
    });
    setOpen(true); // Open the modal for editing
  };
  const paginatedData = data.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );
  const handleDelete = async (id) => {
    setLoading(true); // Show loader during delete
    const response = await apiClient.delete(`/finance/${id}`);
    if (response.status === 200) {
      showToastMessage("Entry Deleted Successfully", "bg-success");
      fetchFinance();
    }
    setLoading(false); // Hide loader after delete
  };

  return (
    <Box className="p-6">
      {showToast ? <Toast bg={toastData.bg} message={toastData.message} /> : null}
      <Box className="flex justify-between items-center mb-4">
        <Typography variant="h5" className="font-semibold text-gray-800">
          Machinery &gt; Machinery Finance
        </Typography>
        <Button
          variant="contained"
          onClick={handleOpen}
          sx={{
            textTransform: "none",
            backgroundColor: "#FC8908",
            fontWeight: "400",
            borderRadius: "8px",
          }}
        >
          + Create New Finance
        </Button>
      </Box>

      <Paper elevation={0} className="p-4">
        {loading ? (
          <Box
            className="flex justify-center items-center"
            style={{ minHeight: "200px" }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper} style={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Documents</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Approved By</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.partstype}</TableCell>
                  <TableCell>{row.amount}</TableCell>
                  <TableCell>
                    <Button
                      variant="text"
                      style={{ color: "#007bff", textTransform: "none" }}
                      startIcon={<DescriptionIcon />}
                      href={row.document} // Assuming 'document' is a URL
                      target="_blank"
                    >
                      View Document
                    </Button>
                  </TableCell>
                  <TableCell>
                    <span
                      style={{
                        background: "#62912C47",
                        borderRadius: "30px",
                        padding: "10px",
                      }}
                    >
                      {row.status}
                    </span>
                  </TableCell>
                  <TableCell>{row.approvedBy?.name || ""}</TableCell>
                  <TableCell>
                    <Box className="flex items-center justify-around rounded-lg border border-gray-300">
                      <IconButton aria-label="view" sx={{ color: "#6c757d" }} onClick={() => handleEdit(row)}>
                        <VisibilityIcon />
                      </IconButton>
                      <Divider
                        orientation="vertical"
                        flexItem
                        sx={{ borderColor: "#e0e0e0" }}
                      />
                      <IconButton
                        aria-label="delete"
                        sx={{ color: "#dc3545" }}
                        onClick={() => handleDelete(row._id)}
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

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-title" variant="h6" component="h2">
            {selectedFinance ? "Edit Office Finance Entry" : "Add Office Finance Entry"}
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
              value={finance.machinery}
              onChange={(e) => setFinance({ ...finance, machinery: e.target.value })}
            >
              <MenuItem value="">Name of Machinery</MenuItem>
              {machinery.map((user) => (
                <MenuItem key={user._id} value={user._id}>
                  {user.name}
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
              onChange={(e) => setFinance({ ...finance, amount: e.target.value })}
            />
            <TextField
              required
              id="document"
              fullWidth
              type="file"
              onChange={(e) => setFinance({ ...finance, document: e.target.files[0] })}
            />
            <div className="flex justify-end mt-4">
              <Button onClick={handleClose} color="error">
                Cancel
              </Button>
              <Button type="submit" variant="contained" className="!bg-[#FC8908]">
                {isSaving ? (
                  <DotLoader color="#fff" size={20} speedMultiplier={1} />
                ) : (
                  selectedFinance ? "Update Finance Entry" : "Add Finance Entry"
                )}
              </Button>
            </div>
          </Box>
        </Box>
      </Modal>

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

export default MachineryFinance;
