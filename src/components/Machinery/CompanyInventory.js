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
    const [editData, setEditData] = useState(null); // For editing machinery
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // For delete confirmation dialog
    const [deleting, setDeleting] = useState(false);
    const [formData, setFormData] = useState({
        machineryName: "",
        type: "",
        trackingNumber: "",
        working: "",
        site: "",
        document: null,
    });

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
    useEffect(() => {

        fetchData();
        fetchSites(setProjects);
    }, []);

    const handleEntriesChange = (event) => {
        setEntriesPerPage(event.target.value);
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setEditData(null); // Reset edit state
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
        console.log(row)
        setEditData(row); // Populate edit form with selected row data
        setFormData({
            machineryName: row.name,
            type: row.type,
            trackingNumber: row.trackingNumber,
            working: row.working ? "yes" : "no",
            site: row.site || "",
            document: null,
        });
        handleOpen(); // Open the modal for editing
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
            const newData = await apiClient.get("/machinery");
            setData(newData.data);
        } catch (error) {
            console.error("Error adding inventory:", error);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        console.log(editData, 'update');
        setLoading(true);
        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.machineryName);
        formDataToSend.append("type", formData.type);
        formDataToSend.append("trackingNumber", formData.trackingNumber);
        formDataToSend.append("workingOn", formData.site);
        if (formData.document) formDataToSend.append("document", formData.document);

        try {
            const response = await apiClient.put(`/machinery/${editData._id}`, formDataToSend); // Update the existing machinery
            if (response.status === 200) {
                fetchData();
              }
            console.log('updated')
            //const updatedData = await apiClient.get("/machinery");
            //setData(updatedData.data);
            setOpen(false);
        } catch (error) {
            console.error("Error updating inventory:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        setDeleting(true);
        console.log(id)
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
            <Paper elevation={0} className="">
                <TableContainer component={Paper}>
                    <Table stickyHeader aria-label="company inventory table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Machinery Name</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Picture/Documents</TableCell>
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
                                                style={{ color: '#007bff', textTransform: 'none' }}
                                                startIcon={<DescriptionIcon />}
                                                href={row.document}
                                                target="_blank"
                                            >
                                                View Document
                                            </Button>
                                        </TableCell>
                                        <TableCell>{row.trackingNumber}</TableCell>
                                        <TableCell>
                                            <Box
                                                className="flex items-center justify-around rounded-lg border border-gray-300"
                                                sx={{ backgroundColor: "#f8f9fa" }}
                                            >
                                                <IconButton
                                                    aria-label="view"
                                                    sx={{ color: "#6c757d" }}
                                                    onClick={() => handleEdit(row)}
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
                        {editData ? "Edit Company Inventory" : "Add Company Inventory"}
                    </Typography>
                    <Box
                        component="form"
                        noValidate
                        autoComplete="off"
                        className="flex flex-col gap-4 mt-4"
                        onSubmit={editData ? handleUpdate : handleSubmit}
                    >
                        <TextField
                            required
                            name="machineryName"
                            label="Machinery Name"
                            fullWidth
                            value={formData.machineryName}
                            onChange={handleInputChange}
                        />
                        <TextField
                            required
                            name="type"
                            label="Type"
                            fullWidth
                            value={formData.type}
                            onChange={handleInputChange}
                        />
                        <TextField
                            required
                            name="trackingNumber"
                            label="Tracking Number"
                            fullWidth
                            value={formData.trackingNumber}
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
                                {loading ? <CircularProgress size={24} /> : editData ? "Update" : "Add Inventory"}
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

export default CompanyInventory;
