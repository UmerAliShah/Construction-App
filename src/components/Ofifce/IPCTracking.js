import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
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
import Pagination from "../../Pagination";
import { ReactComponent as VisibilityIcon } from "../Icons/quickView.svg";
import { ReactComponent as DeleteIcon } from "../Icons/bin.svg";
import DescriptionIcon from "@mui/icons-material/Description";
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

const IPCTracking = () => {
  const [selected, setSelected] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [ipcData, setIpcData] = useState([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false); // To handle Edit modal
  const [loading, setLoading] = useState(false); // Loader for fetching data
  const [submitLoading, setSubmitLoading] = useState(false); // Loader state for Add/Update submission
  const [projects, setProjects] = useState([]);
  const [newIpc, setNewIpc] = useState({
    site: "",
    ipcNumber: "",
    ipcAmount: "",
    status: "",
    document: null,
  });
  const [editIpc, setEditIpc] = useState({
    id: "",
    site: "",
    ipcNumber: "",
    ipcAmount: "",
    status: "",
    document: null,
  }); // State for Edit IPC
  const [deleteModalOpen, setDeleteModalOpen] = useState(false); // State for delete confirmation modal
  const [deleteId, setDeleteId] = useState(null); // Hold the ID of the record to be deleted

  useEffect(() => {
    fetchSites(setProjects);
  }, []);

  // Fetch data from the backend
  const fetchIPCData = async () => {
    try {
      setLoading(true); // Set loading to true when fetching starts
      const response = await apiClient.get("/ipc");
      setIpcData(response.data);
      setLoading(false); // Set loading to false once fetching is done
    } catch (error) {
      console.error("Failed to fetch IPC data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIPCData();
  }, []);

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(ipcData.map((ipc) => ipc._id));
    } else {
      setSelected([]);
    }
  };

  const handleSelect = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
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

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleEditOpen = (row) => {
    setEditIpc({
      id: row._id,
      site: row.site._id,
      ipcNumber: row.ipcNumber,
      ipcAmount: row.ipcAmount,
      status: row.status,
      document: null, // You can add document logic if necessary
    });
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
  };

  const handleDeleteModalOpen = (id) => {
    setDeleteId(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    setDeleteId(null);
    setDeleteModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    // Create formData to handle file upload (document)
    const formData = new FormData();
    formData.append("site", newIpc.site);
    formData.append("ipcNumber", newIpc.ipcNumber);
    formData.append("ipcAmount", newIpc.ipcAmount);
    formData.append("status", newIpc.status);
    if (newIpc.document) {
      formData.append("document", newIpc.document);
    }

    try {
      await apiClient.post("/ipc", formData);
      handleClose();
      fetchIPCData();
      setSubmitLoading(false);
      setNewIpc({
        site: "",
        ipcNumber: "",
        ipcAmount: "",
        status: "",
        document: null,
      });
    } catch (error) {
      console.error("Error adding IPC record:", error);
      setSubmitLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    const formData = new FormData();
    formData.append("site", editIpc.site);
    formData.append("ipcNumber", editIpc.ipcNumber);
    formData.append("ipcAmount", editIpc.ipcAmount);
    formData.append("status", editIpc.status);
    if (editIpc.document) {
      formData.append("document", editIpc.document);
    }

    try {
      await apiClient.put(`/ipc/${editIpc.id}`, formData);
      handleEditClose();
      fetchIPCData();
      setSubmitLoading(false);
    } catch (error) {
      console.error("Error updating IPC record:", error);
      setSubmitLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await apiClient.delete(`/ipc/${deleteId}`);
      setIpcData(ipcData.filter((ipc) => ipc._id !== deleteId));
      handleDeleteModalClose();
    } catch (error) {
      console.error("Error deleting IPC record:", error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h5" className="mb-4 font-semibold text-gray-800">
          Office &gt; IPC Tracking
        </Typography>
        <Button
          variant="contained"
          className="mb-4 !bg-[#FC8908]"
          onClick={handleOpen}
        >
          + Add IPC Tracking
        </Button>
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
                        selected.length > 0 && selected.length < ipcData.length
                      }
                      checked={
                        ipcData.length > 0 && selected.length === ipcData.length
                      }
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell>Project Name</TableCell>
                  <TableCell>IPC Number</TableCell>
                  <TableCell>IPC Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Documents</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ipcData.map((row) => (
                  <TableRow key={row._id}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={selected.includes(row._id)}
                        onChange={() => handleSelect(row._id)}
                      />
                    </TableCell>
                    <TableCell>{row.site.name}</TableCell>
                    <TableCell>{row.ipcNumber}</TableCell>
                    <TableCell>{row.ipcAmount}</TableCell>
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
                        {row.status}
                      </Button>
                    </TableCell>
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
                    <Box
                        className="flex items-center justify-between rounded-lg border border-gray-300"
                        sx={{ backgroundColor: '#f8f9fa' }}>
                        <IconButton aria-label="edit" onClick={() => handleEditOpen(row)} sx={{ color: '#6c757d' }}>
                            <VisibilityIcon />
                        </IconButton>
                        <Divider orientation="vertical" flexItem sx={{ borderColor: '#e0e0e0' }} />
                        <IconButton aria-label="delete" onClick={() => handleDeleteModalOpen(row._id)} sx={{ color: '#dc3545' }}>
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

      {/* Modal for adding new IPC tracking */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-title" variant="h6" component="h2">
            Add IPC Tracking
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
              value={newIpc.site}
              onChange={(e) => setNewIpc({ ...newIpc, site: e.target.value })}
            >
              <MenuItem value="">Select Project</MenuItem>
              {projects.map((project) => (
                <MenuItem key={project._id} value={project._id}>
                  {project.name}
                </MenuItem>
              ))}
            </Select>

            <TextField
              required
              id="ipc-number"
              label="IPC Number"
              fullWidth
              value={newIpc.ipcNumber}
              onChange={(e) =>
                setNewIpc({ ...newIpc, ipcNumber: e.target.value })
              }
            />

            <TextField
              required
              id="ipc-amount"
              label="IPC Amount"
              fullWidth
              value={newIpc.ipcAmount}
              onChange={(e) =>
                setNewIpc({ ...newIpc, ipcAmount: e.target.value })
              }
            />

            <Select
              required
              fullWidth
              value={newIpc.status}
              onChange={(e) => setNewIpc({ ...newIpc, status: e.target.value })}
              displayEmpty
            >
              <MenuItem value="">Select Status</MenuItem>
              <MenuItem value="In-Progress">In-Progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>

            <TextField
              required
              id="document"
              fullWidth
              type="file"
              onChange={(e) =>
                setNewIpc({ ...newIpc, document: e.target.files[0] })
              }
            />

            <div className="flex justify-end mt-4">
              <Button onClick={handleClose} color="error">
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                className="!bg-[#FC8908]"
                disabled={submitLoading}
              >
                {submitLoading ? <CircularProgress size={20} /> : "Add IPC Tracking"}
              </Button>
            </div>
          </Box>
        </Box>
      </Modal>

      {/* Modal for editing IPC tracking */}
      <Modal
        open={editOpen}
        onClose={handleEditClose}
        aria-labelledby="edit-modal-title"
        aria-describedby="edit-modal-description"
      >
        <Box sx={style}>
          <Typography id="edit-modal-title" variant="h6" component="h2">
            Edit IPC Tracking
          </Typography>
          <Box
            component="form"
            noValidate
            autoComplete="off"
            className="flex flex-col gap-4 mt-4"
            onSubmit={handleUpdate}
          >
            <Select
              required
              fullWidth
              displayEmpty
              value={editIpc.site}
              onChange={(e) => setEditIpc({ ...editIpc, site: e.target.value })}
            >
              <MenuItem value="">Select Project</MenuItem>
              {projects.map((project) => (
                <MenuItem key={project._id} value={project._id}>
                  {project.name}
                </MenuItem>
              ))}
            </Select>

            <TextField
              required
              id="edit-ipc-number"
              label="IPC Number"
              fullWidth
              value={editIpc.ipcNumber}
              onChange={(e) =>
                setEditIpc({ ...editIpc, ipcNumber: e.target.value })
              }
            />

            <TextField
              required
              id="edit-ipc-amount"
              label="IPC Amount"
              fullWidth
              value={editIpc.ipcAmount}
              onChange={(e) =>
                setEditIpc({ ...editIpc, ipcAmount: e.target.value })
              }
            />

            <Select
              required
              fullWidth
              value={editIpc.status}
              onChange={(e) =>
                setEditIpc({ ...editIpc, status: e.target.value })
              }
              displayEmpty
            >
              <MenuItem value="">Select Status</MenuItem>
              <MenuItem value="In-Progress">In-Progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>

            <TextField
              id="edit-document"
              fullWidth
              type="file"
              onChange={(e) =>
                setEditIpc({ ...editIpc, document: e.target.files[0] })
              }
            />

            <div className="flex justify-end mt-4">
              <Button onClick={handleEditClose} color="error">
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                className="!bg-[#FC8908]"
                disabled={submitLoading}
              >
                {submitLoading ? <CircularProgress size={20} /> : "Update IPC Tracking"}
              </Button>
            </div>
          </Box>
        </Box>
      </Modal>

      {/* Modal for confirming delete */}
      <Modal
        open={deleteModalOpen}
        onClose={handleDeleteModalClose}
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-description"
      >
        <Box sx={style}>
          <Typography id="delete-modal-title" variant="h6" component="h2">
            Confirm Delete
          </Typography>
          <Typography id="delete-modal-description" className="mt-2">
            Are you sure you want to delete this IPC tracking record? This action
            cannot be undone.
          </Typography>
          <div className="flex justify-end mt-4">
            <Button onClick={handleDeleteModalClose} color="error">
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              variant="contained"
              color="primary"
              sx={{ ml: 2 }}
            >
              Delete
            </Button>
          </div>
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
            of {ipcData.length} entries
          </Typography>
        </div>
        <Pagination
          count={Math.ceil(ipcData.length / entriesPerPage)}
          onPageChange={(page) => console.log("Page:", page)}
        />
      </div>
    </div>
  );
};

export default IPCTracking;
