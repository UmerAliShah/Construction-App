import React, { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Typography,
  Paper,
  Select,
  MenuItem,
  Divider,
  Avatar,
  Button,
  TextField,
  Modal,
  CircularProgress,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { ReactComponent as VisibilityIcon } from "../Icons/quickView.svg";
import { ReactComponent as DeleteIcon } from "../Icons/bin.svg";
import { styled } from "@mui/system";
import Pagination from "../../Pagination";
import apiClient from "../../api/apiClient";
import { useLocation } from "react-router-dom";

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

const ImageUploadBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: theme.spacing(2),
  border: `1px dashed grey`,
  borderRadius: "8px",
  cursor: "pointer",
  marginBottom: theme.spacing(2),
}));

const Vendors = () => {
  const location = useLocation();
  const selectedProject = location.state?.data;
  const [vendors, setVendors] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [selected, setSelected] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [newVendor, setNewVendor] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    //   if (selectedProject) {
    //     // Filter employees with role "vendor"
    //     const vendors = selectedProject.employees.filter(
    //       (employee) => employee.role === "vendor"
    //     );
    //     setVendors(vendors);
    //   }
    fetchVendors();
  }, [selectedProject]);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(
        `/users/vendors/${selectedProject._id}`
      );
      setVendors(response.data);
    } catch (error) {
      console.error("Error fetching vendors", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
    setProfileImage(file);
  };

  const handleEntriesChange = (event) => {
    setEntriesPerPage(event.target.value);
  };

  const handleNewVendorChange = (event) => {
    const { name, value } = event.target;
    setNewVendor((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleOpenDialog = (userId) => {
    setUserToDelete(userId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDelete = async () => {
    const result = await apiClient.delete(
      `/users/vendor/${userToDelete}/${selectedProject._id}`
    );
    if (result.status === 200) {
      setOpenDialog(false);
      fetchVendors();
    }
  };

  const handleCreateVendor = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("email", newVendor.email);
    formData.append("name", newVendor.name);
    formData.append("phone", newVendor.phone);
    formData.append("address", newVendor.address);
    formData.append("profileImage", profileImage);
    formData.append("siteId", selectedProject._id);

    try {
      const result = await apiClient.post("/users/vendor/", formData);

      if (result.status === 200) {
        fetchVendors();
        handleClose();
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data ||
        "An error occurred";
      alert(errorMessage);
    }
  };

  const paginatedData = vendors.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h5" className="mb-4 font-semibold text-gray-800">
          Projects &gt; Vendors
        </Typography>
        <Button
          variant="contained"
          color="warning"
          className="mb-4 !bg-[#FC8908]"
          style={{
            float: "right",
            textTransform: "capitalize",
            fontWeight: "400",
            borderRadius: "8px",
          }}
          onClick={handleOpen}
        >
          + Add New Vendor
        </Button>
      </div>

      <Paper elevation={0} className="p-4">
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100px"
          >
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Vendor Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone Number</TableCell>
                  <TableCell>Profile</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((vendor, index) => (
                  <TableRow key={vendor.id} hover>
                    <TableCell>{vendor.name}</TableCell>
                    <TableCell>{vendor.email}</TableCell>
                    <TableCell>{vendor.phone}</TableCell>
                    <TableCell>
                      <img src={vendor.profileImage} width="50" height="50" />
                    </TableCell>
                    <TableCell>
                      <IconButton aria-label="view" sx={{ color: "#6c757d" }}>
                        <VisibilityIcon />
                      </IconButton>
                      <Divider
                        orientation="vertical"
                        flexItem
                        sx={{ borderColor: "#e0e0e0" }}
                      />
                      <IconButton aria-label="delete" sx={{ color: "#dc3545" }}>
                        <DeleteIcon
                          onClick={() => handleOpenDialog(vendor._id)}
                        />
                      </IconButton>
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
            New Vendor
          </Typography>
          <Box
            component="form"
            noValidate
            autoComplete="off"
            className="flex flex-col gap-4 mt-4"
            onSubmit={handleCreateVendor}
          >
            <ImageUploadBox>
              <Avatar
                src={image}
                alt="Vendor Image"
                sx={{ width: 56, height: 56, marginBottom: 2 }}
              />
              <Typography variant="body2" color="textSecondary">
                Drag Image here or{" "}
                <label
                  htmlFor="upload-image"
                  style={{ color: "#FC8908", cursor: "pointer" }}
                >
                  Browse image
                </label>
              </Typography>
              <input
                type="file"
                id="upload-image"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
            </ImageUploadBox>
            <TextField
              required
              id="vendor-name"
              label="Vendor Name"
              name="name"
              value={newVendor.name}
              onChange={handleNewVendorChange}
              fullWidth
            />
            <TextField
              required
              id="email"
              label="Email"
              name="email"
              value={newVendor.email}
              onChange={handleNewVendorChange}
              fullWidth
            />
            <TextField
              required
              id="phone"
              label="Phone"
              name="phone"
              value={newVendor.phone}
              onChange={handleNewVendorChange}
              fullWidth
            />
            <TextField
              id="address"
              label="Address"
              name="address"
              value={newVendor.address}
              onChange={handleNewVendorChange}
              fullWidth
            />
            <div className="flex self-end mt-4">
              <Button
                onClick={handleClose}
                color="error"
                className="border !mr-4"
              >
                Discard
              </Button>
              <Button type="submit" variant="contained" color="warning">
                Add Vendor
              </Button>
            </div>
          </Box>
        </Box>
      </Modal>

      <Pagination
        totalEntries={vendors.length}
        entriesPerPage={entriesPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onEntriesPerPageChange={handleEntriesChange}
      />

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Vendors;
