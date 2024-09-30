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
  CircularProgress, // Import CircularProgress for the loader
  IconButton,
  Divider,
} from "@mui/material";
import { ReactComponent as EditIcon } from "../Icons/edit.svg";
import { ReactComponent as VisibilityIcon } from "../Icons/quickView.svg";
import { ReactComponent as DeleteIcon } from "../Icons/bin.svg";
import apiClient from "../../api/apiClient";
import Pagination from "../../Pagination";
import { useLocation } from "react-router-dom";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '8px',
  };

const Finances = () => {
  const location = useLocation();
  const selectedProject = location.state?.data;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const initialData = {
    nameOfConcerned: "",
    type: "",
    amount: "",
    document: "",
  };
  const [finance, setFinance] = useState(initialData);
  const [selected, setSelected] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [open, setOpen] = useState(false);

  const handleEntriesChange = (event) => {
    setEntriesPerPage(event.target.value);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const fetchFinance = async () => {
    setLoading(true); // Show loader before fetching data
    try {
      const response = await apiClient.get(
        `/finance/site/${selectedProject._id}`
      );
      if (response.status === 200) {
        setData(response.data);
      }
    } catch (error) {
      console.error("Error fetching finance data:", error);
    } finally {
      setLoading(false); // Hide loader after fetching data
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create formData to handle file upload (document)
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
      await apiClient.post("/finance", formData);
      handleClose();
      fetchFinance();
      setFinance(initialData);
    } catch (error) {
      console.error("Error adding finance record:", error);
    }
  };

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
            <CircularProgress color="primary" /> {/* Show loader while loading */}
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
                  <TableCell>Total Given So Far</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Approved By</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row, index) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.department}</TableCell>
                    <TableCell>{row.nameOfConcerned?.name || "no name"}</TableCell>
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
                    <TableCell>{row.approvedBy?.name || "Not Approved"}</TableCell>
                    <TableCell>
                        <Box
                            className="flex items-center justify-between rounded-lg border border-gray-300"
                            sx={{ backgroundColor: '#f8f9fa' }}>
                            <IconButton aria-label="edit" sx={{ color: '#6c757d' }}>
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

      {/* Modal for adding new Daily Expense */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-title" variant="h6" component="h2">
            Add Office Finance Entry
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
              {employees.map((user) => (
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
              onChange={(e) => setFinance({ ...finance, type: e.target.value })}
            />
            <TextField
              required
              id="amount"
              label="Amount"
              fullWidth
              onChange={(e) =>
                setFinance({ ...finance, amount: e.target.value })
              }
            />
            <TextField
              required
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
              <Button type="submit" variant="contained" className="!bg-[#FC8908]">
                Add Finance Entry
              </Button>
            </div>
          </Box>
        </Box>
      </Modal>

      <div className="flex justify-between items-center mt-6">
        <div className="flex items-center">
          <Typography
            variant="body2"
            color="textSecondary"
            className="mr-2 pr-2"
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
        <Pagination count={5} onPageChange={(page) => console.log("Page:", page)} />
      </div>
    </Box>
  );
};

export default Finances;
