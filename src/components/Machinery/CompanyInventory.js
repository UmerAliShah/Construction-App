import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  CircularProgress,
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
import DescriptionIcon from "@mui/icons-material/Description";
import Pagination from "../../Pagination";
import { ReactComponent as VisibilityIcon } from "../Icons/quickView.svg";
import { ReactComponent as DeleteIcon } from "../Icons/bin.svg";
import apiClient from "../../api/apiClient";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "8px",
};

const CompanyInventory = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    working: "",
    trackingNumber: "",
    partsDemandType: [{ partDemandType: "", status: "" }],
    status: "",
    document: null,
  });
  const [filter, setFilter] = useState(""); // Filter state

  // State for Delete Confirmation Dialog
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // State for Edit Modal
  const [sites, setSites] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    type: "",
    working: "",
    workingOn: "",
    trackingNumber: "",
    partsDemandType: [{ partDemandType: "", status: "" }],
    status: "",
    document: null,
  });
  const [editing, setEditing] = useState(false);

  // Fetching data from the backend
  const fetchData = async () => {
    try {
      const response = await apiClient.get("/machinery");
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching machinery:", error);
      setLoading(false);
    }
  };
  const fetchSites = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/projects/");
      console.log(response);
      if (response.status === 200 && Array.isArray(response.data)) {
        setSites(response.data);
      } else {
        setSites([]); // Ensure `data` is an array even if the response isn't an array
      }
    } catch (error) {
      console.error("Error fetching sites:", error);
      setSites([]); // Set as empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchSites();
  }, []);

  const handleInputChange = (event) => {
    const { name, value, files } = event.target;
    if (name === "document") {
      setFormData({
        ...formData,
        [name]: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleDemandPartTypeChange = (index, key, value) => {
    const newDemandPartTypes = [...formData.partsDemandType];
    if (!newDemandPartTypes[index]) {
      newDemandPartTypes[index] = { partDemandType: "", status: "" };
    }
    newDemandPartTypes[index] = {
      ...newDemandPartTypes[index],
      [key]: value,
    };
    setFormData({ ...formData, partsDemandType: newDemandPartTypes });
  };

  const handleAddDemandPartType = () => {
    setFormData({
      ...formData,
      partsDemandType: [
        ...formData.partsDemandType,
        { partDemandType: "", status: "" },
      ],
    });
  };

  const handleRemoveDemandPartType = (index) => {
    const newDemandPartTypes = formData.partsDemandType.filter(
      (_, i) => i !== index
    );
    setFormData({ ...formData, partsDemandType: newDemandPartTypes });
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("type", formData.type);
    payload.append("trackingNumber", formData.trackingNumber);
    payload.append("document", formData.document);

    // formData.partsDemandType.forEach((part, index) => {
    //   payload.append(
    //     `partsDemandType[${index}][partDemandType]`,
    //     part.partDemandType
    //   );
    //   payload.append(`partsDemandType[${index}][status]`, part.status);
    // });

    try {
      setLoading(true); // Show CircularProgress
      const response = await apiClient.post("/machinery", payload);
      console.log("Response from server:", response.data);
      setData([...data, response.data]); // Update state with new item
      setFormData({
        name: "",
        type: "",
        working: "",
        trackingNumber: "",
        partsDemandType: [{ partDemandType: "", status: "" }],
        status: "",
        document: null,
      });
      handleClose();
    } catch (error) {
      console.error("Error submitting the form:", error);
    } finally {
      fetchData();
      setLoading(false); // Hide CircularProgress
    }
  };

  const paginatedData = data
    .filter((row) => filter === "" || row.workingOn?.name === filter)
    .slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

  // Delete Handlers
  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      setDeleting(true);
      await apiClient.delete(`/machinery/${itemToDelete._id}`);
      setData(data.filter((item) => item.id !== itemToDelete.id));
      setOpenDeleteDialog(false);
      setItemToDelete(null);
    } catch (error) {
      console.error("Error deleting the item:", error);
    } finally {
      setDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
    setItemToDelete(null);
  };

  // Edit Handlers
  const handleEditClick = (item) => {
    setItemToEdit(item);
    setEditFormData({
      name: item.name || "",
      type: item.type || "",
      working: item.working || "",
      trackingNumber: item.trackingNumber || "",
      partsDemandType:
        item.partsDemandType?.length > 0
          ? item.partsDemandType
          : [{ partDemandType: "", status: "" }],
      status: item.status || "",
      document: null, // Assuming you might want to upload a new document
    });
    setOpenEditModal(true);
  };

  const handleEditInputChange = (event) => {
    const { name, value, files } = event.target;
    if (name === "document") {
      setEditFormData({
        ...editFormData,
        [name]: files[0],
      });
    } else {
      setEditFormData({
        ...editFormData,
        [name]: value,
      });
    }
  };

  const handleEditDemandPartTypeChange = (index, key, value) => {
    const newDemandPartTypes = [...editFormData.partsDemandType];
    if (!newDemandPartTypes[index]) {
      newDemandPartTypes[index] = { partDemandType: "", status: "" };
    }
    newDemandPartTypes[index] = {
      ...newDemandPartTypes[index],
      [key]: value,
    };
    setEditFormData({ ...editFormData, partsDemandType: newDemandPartTypes });
  };

  const handleEditAddDemandPartType = () => {
    setEditFormData({
      ...editFormData,
      partsDemandType: [
        ...editFormData.partsDemandType,
        { partDemandType: "", status: "" },
      ],
    });
  };

  const handleEditRemoveDemandPartType = (index) => {
    const newDemandPartTypes = editFormData.partsDemandType.filter(
      (_, i) => i !== index
    );
    setEditFormData({ ...editFormData, partsDemandType: newDemandPartTypes });
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();

    const payload = new FormData();
    payload.append("name", editFormData.name);
    payload.append("type", editFormData.type);
    payload.append("trackingNumber", editFormData.trackingNumber);
    if (editFormData.workingOn) {
      payload.append("workingOn", editFormData.workingOn);
    }
    if (editFormData.document) {
      payload.append("document", editFormData.document);
    }

    editFormData.partsDemandType.forEach((part, index) => {
      payload.append(
        `partsDemandType[${index}][partDemandType]`,
        part.partDemandType
      );
      payload.append(`partsDemandType[${index}][status]`, part.status);
    });

    try {
      setEditing(true);
      const response = await apiClient.put(
        `/machinery/${itemToEdit._id}`,
        payload
      );
      console.log("Edit response:", response.data);
      setData(
        data.map((item) => (item.id === itemToEdit.id ? response.data : item))
      );
      setEditFormData({
        name: "",
        type: "",
        working: "",
        trackingNumber: "",
        partsDemandType: [{ partDemandType: "", status: "" }],
        status: "",
        document: null,
      });
      setOpenEditModal(false);
      setItemToEdit(null);
    } catch (error) {
      console.error("Error editing the item:", error);
    } finally {
      setEditing(false);
    }
  };

  return (
    <Box className="p-6">
      <Box className="flex justify-between items-center mb-4">
        <Typography variant="h5" className="mb-4 font-semibold text-gray-800">
          Machinery &gt; Company Inventory
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
          + Add Mechinary in Compnay
        </Button>
      </Box>

      {/* Filter Dropdown */}
      <Box className="mb-4">
        <Typography variant="h6">Filter by Working On</Typography>
        <Select
          value={filter}
          onChange={handleFilterChange}
          displayEmpty
          fullWidth
          sx={{ mb: 2 }}
        >
          <MenuItem value="">All</MenuItem>
          {data.map((row, index) => (
            <MenuItem key={index} value={row.workingOn?.name || ""}>
              {row.workingOn?.name || "Free To Use"}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Paper elevation={0}>
        <TableContainer component={Paper} sx={{ overflowY: "auto" }}>
          <Table stickyHeader aria-label="site inventory table">
            <TableHead>
              <TableRow>
                <TableCell>Machinery Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Documents</TableCell>
                <TableCell>Working</TableCell>
                <TableCell>Reference Number</TableCell>
                <TableCell>Part Demand</TableCell>
                <TableCell>Demand Part Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
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
                    <TableCell>
                      <Button
                        variant="contained"
                        size="small"
                        style={{
                          backgroundColor: "#ffcc80",
                          color: "#f57c00",
                          borderRadius: "16px",
                        }}
                      >
                        {row.workingOn?.name || "Free To Use"}
                      </Button>
                    </TableCell>
                    <TableCell>{row.trackingNumber}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        size="small"
                        style={{
                          backgroundColor: "#ffcc80",
                          color: "#f57c00",
                          borderRadius: "16px",
                        }}
                      >
                        {row?.partsDemandType?.length > 0 ? "Yes" : "No"}
                      </Button>
                    </TableCell>
                    <TableCell>
                      {row.partsDemandType?.map((part, idx) => (
                        <div key={idx}>
                          {part.partDemandType} - {part.status}
                        </div>
                      ))}
                    </TableCell>
                    <TableCell>
                      <span
                        style={{
                          background: "orange",
                          borderRadius: "30px",
                          padding: "0 8px",
                        }}
                      >
                        {row.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Box
                        className="flex items-center justify-between rounded-lg border border-gray-300"
                        sx={{ backgroundColor: "#f8f9fa" }}
                      >
                        <IconButton
                          aria-label="view"
                          sx={{ color: "#6c757d" }}
                          onClick={() => handleEditClick(row)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          aria-label="delete"
                          sx={{ color: "#dc3545" }}
                          onClick={() => handleDeleteClick(row)}
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

      {/* Modal for creating a new project */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-title" variant="h6" component="h2">
            Create a New Inventory
          </Typography>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
            <Box className="flex flex-col gap-4">
              {/* Machinery Name and Type */}
              <Box className="flex gap-4">
                <TextField
                  name="name"
                  label="Machinery Name"
                  fullWidth
                  onChange={handleInputChange}
                  required
                />
                <TextField
                  name="type"
                  label="Type"
                  fullWidth
                  onChange={handleInputChange}
                  required
                />
              </Box>

              {/* Working and Tracking Number */}
              <Box className="flex gap-4">
                {itemToEdit !== null && (
                  <TextField
                    select
                    name="working"
                    label="Working"
                    fullWidth
                    value={formData.working}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="">Select Working</MenuItem>
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                  </TextField>
                )}
                <TextField
                  name="trackingNumber"
                  label="Tracking Number"
                  fullWidth
                  onChange={handleInputChange}
                  required
                />
              </Box>
              {/* Part Demand and Demand Part Type */}
              {itemToEdit !== null
                ? formData.partsDemandType.map((partType, index) => (
                    <Box className="flex gap-4" key={index}>
                      <TextField
                        name={`partDemandType-${index}`}
                        label={`Demand Part Type ${index + 1}`}
                        fullWidth
                        value={partType.partDemandType}
                        onChange={(event) =>
                          handleDemandPartTypeChange(
                            index,
                            "partDemandType",
                            event.target.value
                          )
                        }
                        required
                      />
                      <TextField
                        select
                        name={`status-${index}`}
                        label="Status"
                        fullWidth
                        value={partType.status}
                        onChange={(event) =>
                          handleDemandPartTypeChange(
                            index,
                            "status",
                            event.target.value
                          )
                        }
                        required
                      >
                        <MenuItem value="in-progress">In Progress</MenuItem>
                        <MenuItem value="in-transport">In Transport</MenuItem>
                        <MenuItem value="completed">Completed</MenuItem>
                      </TextField>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleRemoveDemandPartType(index)}
                        disabled={formData.partsDemandType.length === 1} // Disable remove if only 1 field
                      >
                        Remove
                      </Button>
                    </Box>
                  ))
                : ""}
              {itemToEdit !== null && (
                <Button variant="outlined" onClick={handleAddDemandPartType}>
                  + Add Another Part Demand Type
                </Button>
              )}

              {/* Status and Document Upload */}
              <Box className="flex gap-4">
                <TextField
                  name="document"
                  type="file"
                  fullWidth
                  onChange={handleInputChange}
                  required
                />
              </Box>
            </Box>

            {/* Buttons */}
            <Box className="flex justify-end mt-4">
              <Button onClick={handleClose} color="error">
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                className="!bg-[#FC8908]"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Submit"}
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>

      {/* Modal for editing an inventory item */}
      <Modal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        aria-labelledby="edit-modal-title"
        aria-describedby="edit-modal-description"
      >
        <Box sx={style}>
          <Typography id="edit-modal-title" variant="h6" component="h2">
            Edit Inventory
          </Typography>
          <form
            onSubmit={handleEditSubmit}
            className="flex flex-col gap-4 mt-4"
          >
            <Box className="flex flex-col gap-4">
              {/* Machinery Name and Type */}
              <Box className="flex gap-4">
                <TextField
                  name="name"
                  label="Machinery Name"
                  fullWidth
                  value={editFormData.name}
                  onChange={handleEditInputChange}
                  required
                />
                <TextField
                  name="type"
                  label="Type"
                  fullWidth
                  value={editFormData.type}
                  onChange={handleEditInputChange}
                  required
                />
              </Box>

              {/* Working and Tracking Number */}
              <Box className="flex gap-4">
                <TextField
                  select
                  name="working"
                  label="Working"
                  fullWidth
                  value={editFormData.working}
                  onChange={handleEditInputChange}
                  required
                >
                  <MenuItem value="">Select Working</MenuItem>
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </TextField>
                <TextField
                  name="trackingNumber"
                  label="Tracking Number"
                  fullWidth
                  value={editFormData.trackingNumber}
                  onChange={handleEditInputChange}
                  required
                />
              </Box>

              {editFormData.working === "Yes" && (
                <Box className="flex gap-4">
                  <TextField
                    select
                    name="workingOn"
                    label="Working On"
                    fullWidth
                    value={editFormData.workingOn}
                    onChange={handleEditInputChange}
                    required
                  >
                    <MenuItem value="">Select Working</MenuItem>
                    {sites.map((item) => {
                      return <MenuItem value={item._id}>{item.name}</MenuItem>;
                    })}
                  </TextField>
                </Box>
              )}

              {/* Part Demand and Demand Part Type */}
              {editFormData.partsDemandType.map((partType, index) => (
                <Box className="flex gap-4" key={index}>
                  <TextField
                    name={`partDemandType-${index}`}
                    label={`Demand Part Type ${index + 1}`}
                    fullWidth
                    value={partType.partDemandType}
                    onChange={(event) =>
                      handleEditDemandPartTypeChange(
                        index,
                        "partDemandType",
                        event.target.value
                      )
                    }
                    required
                  />
                  <TextField
                    select
                    name={`status-${index}`}
                    label="Status"
                    fullWidth
                    value={partType.status}
                    onChange={(event) =>
                      handleEditDemandPartTypeChange(
                        index,
                        "status",
                        event.target.value
                      )
                    }
                    required
                  >
                    <MenuItem value="in-progress">In Progress</MenuItem>
                    <MenuItem value="in-transport">In Transport</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                  </TextField>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleEditRemoveDemandPartType(index)}
                    disabled={editFormData.partsDemandType.length === 1} // Disable remove if only 1 field
                  >
                    Remove
                  </Button>
                </Box>
              ))}
              <Button variant="outlined" onClick={handleEditAddDemandPartType}>
                + Add Another Part Demand Type
              </Button>

              {/* Status and Document Upload */}
              <Box className="flex gap-4">
                <TextField
                  name="document"
                  type="file"
                  fullWidth
                  onChange={handleEditInputChange}
                />
              </Box>
            </Box>

            {/* Buttons */}
            <Box className="flex justify-end mt-4">
              <Button onClick={() => setOpenEditModal(false)} color="error">
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                className="!bg-[#FC8908]"
                disabled={editing}
              >
                {editing ? <CircularProgress size={24} /> : "Update"}
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCancelDelete}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this inventory item?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
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

export default CompanyInventory;
