import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
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
} from "@mui/material";
import { ReactComponent as VisibilityIcon } from "../Icons/quickView.svg";
import { ReactComponent as DeleteIcon } from "../Icons/bin.svg";
import DescriptionIcon from "@mui/icons-material/Description";
import Pagination from "../../Pagination";
import { DotLoader } from "react-spinners";
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

const SupplyTracking = () => {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const initialData = {
    refNumber: "",
    amountFulfilled: "",
    document: "",
  };
  const [supplyTracking, setSupplyTracking] = useState(initialData);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/supply");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSupplyTracking(initialData);
  };

  const handleCreate = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("refNumber", supplyTracking.refNumber);
    formData.append("amountFulfilled", supplyTracking.amountFulfilled);
    if (supplyTracking.document) {
      formData.append("document", supplyTracking.document);
    }

    setSubmitting(true);
    try {
      await apiClient.post("/supply", formData);
      fetchData();
    } catch (error) {
      console.error("Error creating supply:", error);
    }
    setSubmitting(false);
    handleClose();
  };

  const handleDelete = async (id) => {
    setSubmitting(true);
    try {
      await apiClient.delete(`/supply/${id}`);
      fetchData();
    } catch (error) {
      console.error("Error deleting supply:", error);
    }
    setSubmitting(false);
  };

  const paginatedData = data.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  return (
    <Box className="p-6">
      <Box className="flex justify-between items-center mb-4">
        <Typography variant="h5" className="mb-4 font-semibold text-gray-800">
          Projects &gt; Supply Tracking
        </Typography>
        <Button variant="contained" className="mb-4 !bg-[#FC8908]" onClick={handleOpen}>
          + Add Supply Tracking
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={0} className="p-4">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><Typography className="!font-semibold">Order Reference Number</Typography></TableCell>
              <TableCell><Typography className="!font-semibold">Amount Adequately Fulfilled</Typography></TableCell>
              <TableCell><Typography className="!font-semibold">Picture/Document</Typography></TableCell>
              <TableCell><Typography className="!font-semibold">Action</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <DotLoader color="#f1780e" loading={loading} />
                </TableCell>
              </TableRow>
            ) : (
                paginatedData.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell>{row.refNumber}</TableCell>
                  <TableCell>
                    <span
                      style={{
                        background: row.amountFulfilled === "Yes" ? "#62912C47" : "red",
                        borderRadius: "30px",
                        padding: "0 8px",
                      }}
                    >
                      {row.amountFulfilled}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="text"
                      style={{ color: "#007bff", textTransform: "none" }}
                      startIcon={<DescriptionIcon />}
                    >
                      {row.document}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Box
                      className="flex items-center justify-between rounded-lg border border-gray-300"
                      sx={{ backgroundColor: "#f8f9fa" }}
                    >
                      <IconButton aria-label="view" sx={{ color: "#6c757d" }}>
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        sx={{ color: "#dc3545" }}
                        onClick={() => handleDelete(row.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
        <Box sx={style}>
          <Typography id="modal-title" variant="h6" component="h2">
            Add Supply Tracking
          </Typography>
          <Box component="form" noValidate autoComplete="off" className="flex flex-col gap-4 mt-4" onSubmit={handleCreate}>
            <TextField
              required
              id="order-reference-number"
              label="Order Reference Number"
              fullWidth
              value={supplyTracking.refNumber}
              onChange={(e) => setSupplyTracking({ ...supplyTracking, refNumber: e.target.value })}
            />
            <Select
              required
              fullWidth
              displayEmpty
              value={supplyTracking.amountFulfilled}
              onChange={(e) => setSupplyTracking({ ...supplyTracking, amountFulfilled: e.target.value })}
            >
              <MenuItem value="">Select Fulfillment</MenuItem>
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </Select>
            <TextField
              required
              id="picture-document"
              type="file"
              fullWidth
              onChange={(e) => setSupplyTracking({ ...supplyTracking, document: e.target.files[0] })}
            />
            <div className="flex justify-end mt-4">
              <Button onClick={handleClose} color="error">
                Cancel
              </Button>
              <Button type="submit" variant="contained" className="!bg-[#FC8908]">
                {submitting ? <DotLoader color="#f1780e" loading={submitting} size={20} /> : "Add Tracking"}
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

export default SupplyTracking;
