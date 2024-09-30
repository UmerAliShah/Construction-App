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
  const [loading, setLoading] = useState(false); // Add loading state
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
                            className="flex items-center justify-around rounded-lg border border-gray-300"
                            sx={{ backgroundColor: '#f8f9fa' }}>
                            <IconButton aria-label="edit" onClick={() => handleEditOpen(row)} sx={{ color: '#6c757d' }}>
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
