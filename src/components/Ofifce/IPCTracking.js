import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Modal,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Pagination from "../../Pagination";
import { ReactComponent as VisibilityIcon } from "../Icons/quickView.svg";
import { ReactComponent as DeleteIcon } from "../Icons/bin.svg";
import EditIcon from "@mui/icons-material/Edit";
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
  const [projects, setProjects] = useState([]);
  const [newIpc, setNewIpc] = useState({
    site: "",
    ipcNumber: "",
    ipcAmount: "",
    status: "",
    document: null,
  });

  const [editOpen, setEditOpen] = useState(false);
  const initialData = {
    id: "",
    site: "",
    ipcNumber: "",
    ipcAmount: "",
    status: "",
    document: null,
  };
  const [editIpc, setEditIpc] = useState(initialData);

  useEffect(() => {
    fetchSites(setProjects);
  }, []);

  // Fetch data from the backend
  const fetchIPCData = async () => {
    try {
      const response = await apiClient.get("/ipc");
      setIpcData(response.data);
      console.log(response.data, "test");
    } catch (error) {
      console.error("Failed to fetch IPC data:", error);
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

  const handleEditOpen = (ipc) => {
    setEditIpc({
      id: ipc._id,
      site: ipc.site._id,
      ipcNumber: ipc.ipcNumber,
      ipcAmount: ipc.ipcAmount,
      status: ipc.status,
      document: null,
    });
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setEditIpc(initialData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      setEditIpc(initialData);
    } catch (error) {
      console.error("Error adding IPC record:", error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("site", editIpc.site);
    formData.append("ipcNumber", editIpc.ipcNumber);
    formData.append("ipcAmount", editIpc.ipcAmount);
    formData.append("status", editIpc.status);
    if (editIpc.document) {
      formData.append("document", editIpc.document);
    }

    try {
      await apiClient.put(`/ipc/${editIpc.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      handleEditClose();
      fetchIPCData();
    } catch (error) {
      console.error("Error updating IPC record:", error);
    }
  };
  

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this IPC record?"))
      return;

    try {
      await apiClient.delete(`/ipc/${id}`);
      setIpcData(ipcData.filter((ipc) => ipc._id !== id));
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
        <Grid container>
          {/* Table Headings */}
          <Grid item xs={12}>
            <Box className="bg-white-50 p-2 rounded-md flex items-center justify-between">
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
              <Typography className="flex-1 !font-semibold">
                Project Name
              </Typography>
              <Typography className="flex-1 !font-semibold">
                IPC Number
              </Typography>
              <Typography className="flex-1 !font-semibold">
                IPC Amount
              </Typography>
              <Typography className="flex-1 !font-semibold">Status</Typography>
              <Typography className="flex-1 !font-semibold">
                Documents
              </Typography>
              <Typography className="!font-semibold">Action</Typography>
            </Box>
          </Grid>

          {/* Table Rows */}
          {ipcData.map((row) => (
            <Grid item xs={12} key={row._id}>
              <Box className="shadow-sm rounded-lg p-2 flex items-center justify-between border-b-2 my-2">
                <Checkbox
                  color="primary"
                  checked={selected.includes(row._id)}
                  onChange={() => handleSelect(row._id)}
                />
                <Typography className="flex-1">{row.site.name}</Typography>{" "}
                {/* Assuming 'site' has a 'name' field */}
                <Typography className="flex-1">{row.ipcNumber}</Typography>
                <Typography className="flex-1">{row.ipcAmount}</Typography>
                <Typography className="flex-1">
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
                </Typography>
                <Typography className="flex-1">
                  <Button
                    variant="text"
                    style={{ color: "#007bff", textTransform: "none" }}
                    startIcon={<DescriptionIcon />}
                    href={row.document} // Assuming 'document' is a URL
                    target="_blank"
                  >
                    View Document
                  </Button>
                </Typography>
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
                    aria-label="edit"
                    sx={{ color: "#007bff" }}
                    onClick={() => handleEditOpen(row)}
                  >
                    <EditIcon />
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
              </Box>
            </Grid>
          ))}
        </Grid>
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
              <MenuItem value="in-proress">In-Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
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
              >
                Add IPC Tracking
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
              >
                Update IPC Tracking
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
