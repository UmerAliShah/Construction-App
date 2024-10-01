import React, { useState, useEffect } from "react";
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
import { ReactComponent as VisibilityIcon } from "../Icons/quickView.svg";
import { ReactComponent as DeleteIcon } from "../Icons/bin.svg";
import DescriptionIcon from "@mui/icons-material/Description";
import Pagination from "../../Pagination";
import apiClient from "../../api/apiClient";
import { fetchSites } from "../../Sidebar";

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

const CompanyInventory = () => {
  const [selected, setSelected] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [projects, setProjects] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    machineryName: "",
    type: "",
    trackingNumber: "",
    working: "",
    site: "",
    document: null,
  });

  useEffect(() => {
    // Fetch data from the backend
    const fetchData = async () => {
      try {
        const response = await apiClient.get("/machinery");
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
    fetchSites(setProjects);
  }, []);

  const handleEntriesChange = (event) => {
    setEntriesPerPage(event.target.value);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (event) => {
    setFormData({
      ...formData,
      document: event.target.files[0],
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.machineryName);
    formDataToSend.append("type", formData.type);
    formDataToSend.append("trackingNumber", formData.trackingNumber);
    formDataToSend.append("workingOn", formData.site);
    formDataToSend.append("document", formData.document);

    try {
      const response = await apiClient.post("/machinery", formDataToSend);
      console.log("Inventory added:", response.data);
      setOpen(false);
      // Optionally refetch the data after adding the inventory
      const newData = await apiClient.get("/machinery");
      setData(newData.data);
    } catch (error) {
      console.error("Error adding inventory:", error);
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
          Machinery &gt; Company Inventory
        </Typography>
        <Button
          variant="contained"
          className="mb-4 !bg-[#FC8908]"
          onClick={handleOpen}
        >
          + Add Company Inventory
        </Button>
      </Box>
      <Paper elevation={0} className="p-4">
        <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
          <Table stickyHeader aria-label="company inventory table">
            <TableHead>
              <TableRow>
                <TableCell>Machinery Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Picture/Documents</TableCell>
                <TableCell>Working</TableCell>
                <TableCell>Tracking Number</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((row, index) => (
                  <TableRow key={index} hover>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell>
                      <Button
                        variant="text"
                        style={{ color: "#007bff", textTransform: "none" }}
                        startIcon={<DescriptionIcon />}
                      >
                        {row.document}
                      </Button>
                    </TableCell>
                    <TableCell>{row.workingOn?.name}</TableCell>
                    <TableCell>{row.trackingNumber}</TableCell>
                    <TableCell>
                      <Box
                        className="flex items-center justify-between rounded-lg border border-gray-300"
                        sx={{ backgroundColor: "#f8f9fa" }}
                      >
                        <IconButton aria-label="view" sx={{ color: "#6c757d" }}>
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
      </Paper>

      {/* Modal for adding new Company Inventory */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-title" variant="h6" component="h2">
            Add Company Inventory
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
              name="machineryName"
              label="Machinery Name"
              fullWidth
              onChange={handleInputChange}
            />
            <TextField
              required
              name="type"
              label="Type"
              fullWidth
              onChange={handleInputChange}
            />
            <TextField
              required
              name="trackingNumber"
              label="Tracking Number"
              fullWidth
              onChange={handleInputChange}
            />
            <Select
              required
              fullWidth
              name="working"
              value={formData.working}
              onChange={handleInputChange}
              displayEmpty
            >
              <MenuItem value="">Select Working</MenuItem>
              <MenuItem value="yes">Yes</MenuItem>
              <MenuItem value="no">No</MenuItem>
            </Select>
            {formData.working === "yes" ? (
              <Select
                required
                fullWidth
                displayEmpty
                value={formData.site}
                onChange={(e) => setFormData({ ...formData, site: e.target.value })}
              >
                <MenuItem value="">Select Project</MenuItem>
                {projects.map((project) => (
                  <MenuItem key={project._id} value={project._id}>
                    {project.name}
                  </MenuItem>
                ))}
              </Select>
            ) : (
              ""
            )}
            <TextField
              required
              name="document"
              type="file"
              fullWidth
              onChange={handleFileChange}
            />
            <div className="flex justify-end mt-4">
              <Button onClick={handleClose} color="error">
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                className="!bg-[#FC8908]"
              >
                Add Inventory
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

export default CompanyInventory;
