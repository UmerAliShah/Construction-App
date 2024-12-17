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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputLabel,
} from "@mui/material";
import { ReactComponent as VisibilityIcon } from "../Icons/quickView.svg";
import { ReactComponent as DeleteIcon } from "../Icons/bin.svg";
import DescriptionIcon from "@mui/icons-material/Description";
import Pagination from "../../Pagination";
import apiClient from "../../api/apiClient";
import { fetchSites } from "../../Sidebar";
import { useSelector } from "react-redux";

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

const SiteInventory = () => {
  const { role: currentRole } = useSelector((state) => state.auth);
  const [selected, setSelected] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [projects, setProjects] = useState([]);
  const [open, setOpen] = useState(false);
  const [partOpen, setPartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [availableMachinary, setAvailableMachinary] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editData, setEditData] = useState(null); // For editing machinery
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // For delete confirmation dialog
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const initialData = {
    machineryName: "",
    type: "",
    trackingNumber: "",
    working: "",
    site: "",
    document: null,
  };
  const [formData, setFormData] = useState(initialData);

  const fetchData = async () => {
    try {
      const response = await apiClient.get("/machinery/bySite");
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };
  const fetchAvailable = async () => {
    try {
      const response = await apiClient.get("/machinery");
      setAvailableMachinary(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching machinery:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
    fetchSites(setProjects);
    fetchAvailable();
  }, []);

  const handleEntriesChange = (event) => {
    setEntriesPerPage(event.target.value);
  };

  const handleOpen = () => setOpen(true);
  const handlePartOpen = () => setPartOpen(true);
  const handleClose = () => {
    setOpen(false);
    setEditData(null); // Reset edit state
  };
  const handlePartClose = () => {
    setPartOpen(false);
    setFormData(initialData); // Reset edit state
  };

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

  const handleEdit = (row) => {
    console.log(row, "test");
    setEditData(row);
    setFormData({
      name: row.name,
      site: row.site || "",
    });
    handleOpen(); // Open the modal for editing
  };

  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   const formDataToSend = new FormData();
  //   formDataToSend.append("name", formData.machineryName);
  //   formDataToSend.append("type", formData.type);
  //   formDataToSend.append("trackingNumber", formData.trackingNumber);
  //   formDataToSend.append("workingOn", formData.site);
  //   formDataToSend.append("document", formData.document);

  //   try {
  //     const response = await apiClient.post("/machinery", formDataToSend);
  //     console.log("Inventory added:", response.data);
  //     setOpen(false);
  //     const newData = await apiClient.get("/machinery");
  //     setData(newData.data);
  //   } catch (error) {
  //     console.error("Error adding inventory:", error);
  //   }
  // };

  const handlePartSubmit = async (event) => {
    event.preventDefault();

    const payload = new FormData();
    payload.append("name", formData.name);

    const partToAdd = {
      partDemandType: formData.partDemandType,
      status: formData.status || "in-progress",
    };

    payload.append("partsDemandType", JSON.stringify([partToAdd]));

    try {
      setEditing(true);
      const response = await apiClient.put(`/machinery/${itemToEdit}`, payload);
      console.log("Edit response:", response.data);
      setFormData({
        name: "",
        partsDemandType: [{ partDemandType: "", status: "" }],
      });
      setPartOpen(false);
    } catch (error) {
      console.error("Error editing the item:", error);
    } finally {
      fetchData();
      setItemToEdit(null);
      setEditing(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);

    // Handle the 'workingOn' field
    if (formData.site === "Yes" || formData.site === "yes") {
      formDataToSend.append("workingOn", "yes"); // To trigger removal in backend
    } else {
      formDataToSend.append("workingOn", formData.site); // Use the actual site value
    }

    // Optionally append partsDemandType if required
    if (formData.partsDemandType) {
      formDataToSend.append(
        "partsDemandType",
        JSON.stringify(formData.partsDemandType)
      );
    }

    try {
      const response = await apiClient.put(
        `/machinery/${itemToEdit}`,
        formDataToSend
      ); // Update the existing machinery

      if (response.status === 200) {
        fetchData(); // Refresh data after successful update
      }

      console.log("updated");
      setOpen(false); // Close the modal or form after success
    } catch (error) {
      console.error("Error updating inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleting(true);
    try {
      await apiClient.delete(`/machinery/${id}`);
      const updatedData = await apiClient.get("/machinery");
      setData(updatedData.data);
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting inventory:", error);
    } finally {
      setDeleting(false);
    }
  };

  const paginatedData = data.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  const allowed = ["site_head", "owner", "owner_assistant"];
  return (
    <Box className="p-6">
      <Box className="flex justify-between items-center mb-4">
        <Typography variant="h5" className="mb-4 font-semibold text-gray-800">
          Machinery &gt; Site Machinery
        </Typography>
        <Box className="flex justify-between items-center mb-4">
          {allowed.includes(currentRole) && (
            <Button
              variant="contained"
              className="mb-4 me-2 !bg-[#FC8908]"
              onClick={handleOpen}
            >
              + Add Machinery On Site
            </Button>
          )}
          <Button
            variant="contained"
            className="mb-4 !bg-[#FC8908]"
            onClick={handlePartOpen}
          >
            + Add New Part Demand
          </Button>
        </Box>
      </Box>
      <Paper elevation={0} className="">
        <TableContainer component={Paper}>
          <Table stickyHeader aria-label="company inventory table">
            <TableHead>
              <TableRow>
                <TableCell>Machinery Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Picture/Documents</TableCell>
                <TableCell>Reference Number</TableCell>
                <TableCell>Parts Demand</TableCell>
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
                        href={row.document}
                        target="_blank"
                      >
                        View Document
                      </Button>
                    </TableCell>
                    <TableCell>{row.trackingNumber}</TableCell>
                    <TableCell>
                      {row.partsDemandType?.map((part, idx) => (
                        <div key={idx}>
                          {part.partDemandType} - {part.status}
                        </div>
                      ))}
                    </TableCell>
                    <TableCell>
                      <Box
                        className="flex items-center justify-around rounded-lg border border-gray-300"
                        sx={{ backgroundColor: "#f8f9fa" }}
                      >
                        <IconButton
                          aria-label="view"
                          sx={{ color: "#6c757d" }}
                          onClick={() => {
                            handleEdit(row);
                            setItemToEdit(row._id);
                          }}
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
                          sx={{ color: "#dc3545" }}
                          onClick={() => setDeleteDialogOpen(true)}
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

      {/* Modal for adding or editing Company Inventory */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-title" variant="h6" component="h2">
            Add Machinery To Site
          </Typography>
          <Box
            component="form"
            noValidate
            autoComplete="off"
            className="flex flex-col gap-4 mt-4"
            onSubmit={handleUpdate}
          >
            {editData === null ? (
              <Select
                required
                fullWidth
                label="Machinery Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                displayEmpty
              >
                <MenuItem value="">Select Machinery</MenuItem>
                {availableMachinary.map((item, index) => (
                  <MenuItem
                    key={index}
                    value={item.name}
                    onClick={() => {
                      setItemToEdit(item._id);
                    }}
                  >
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            ) : (
              <TextField
                fullWidth
                disabled
                label="Machinery Name"
                name="name"
                value={formData.name}
              />
            )}
            {editData === null ? (
              <Select
                required
                fullWidth
                displayEmpty
                label="Site"
                name="site"
                value={formData.site}
                onChange={(e) =>
                  setFormData({ ...formData, site: e.target.value })
                }
              >
                <MenuItem value="">Select Project</MenuItem>
                {projects.map((project) => (
                  <MenuItem key={project._id} value={project._id}>
                    {project.name}
                  </MenuItem>
                ))}
              </Select>
            ) : (
              <>
                <InputLabel id="site">
                  Do you want to remove from site?
                </InputLabel>
                <Select
                  labelId="site"
                  id="site"
                  fullWidth
                  value={formData.site}
                  onChange={(e) =>
                    setFormData({ ...formData, site: e.target.value })
                  }
                >
                  <MenuItem value="yes">Yes</MenuItem>
                  <MenuItem value="no">No</MenuItem>
                </Select>
              </>
            )}

            <div className="flex justify-end mt-4">
              <Button onClick={handleClose} color="error">
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                className="!bg-[#FC8908]"
              >
                {loading ? (
                  <CircularProgress size={24} />
                ) : editData ? (
                  "Update"
                ) : (
                  "Add Inventory"
                )}
              </Button>
            </div>
          </Box>
        </Box>
      </Modal>

      {/* Modal for adding parts */}

      <Modal
        open={partOpen}
        onClose={handlePartClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-title" variant="h6" component="h2">
            Add Part Demand
          </Typography>
          <Box
            component="form"
            noValidate
            autoComplete="off"
            className="flex flex-col gap-4 mt-4"
            onSubmit={handlePartSubmit}
          >
            <Select
              required
              fullWidth
              label="Machinery Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              displayEmpty
            >
              <MenuItem value="">Select Machinery</MenuItem>
              {data.map((item, index) => (
                <MenuItem
                  key={index}
                  value={item.name}
                  onClick={() => {
                    console.log("Clicked item:", item, item._id);
                    setItemToEdit(item._id);
                  }}
                >
                  {item.name}
                </MenuItem>
              ))}
            </Select>

            <TextField
              required
              name="partDemandType"
              label="Part Demand"
              fullWidth
              value={formData.partDemandType}
              onChange={handleInputChange}
            />

            <div className="flex justify-end mt-4">
              <Button onClick={handlePartClose} color="error">
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                className="!bg-[#FC8908]"
                disabled={editing}
              >
                {editing ? <CircularProgress size={24} /> : "Add Demand"}
              </Button>
            </div>
          </Box>
        </Box>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this inventory item?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => handleDelete(editData?._id)}
            color="error"
            autoFocus
            disabled={deleting}
          >
            {deleting ? <CircularProgress size={24} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

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

export default SiteInventory;
