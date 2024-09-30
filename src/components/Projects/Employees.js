import React, { useState, useEffect } from "react";
import {
  Box,
  Checkbox,
  IconButton,
  Typography,
  Paper,
  Select,
  MenuItem,
  Divider,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress, // Import CircularProgress for loader
} from "@mui/material";
import { ReactComponent as VisibilityIcon } from "../Icons/quickView.svg";
import { ReactComponent as DeleteIcon } from "../Icons/bin.svg";
import Pagination from "../../Pagination";
import { useLocation, useNavigate } from "react-router-dom";
import apiClient from "../../api/apiClient";

const Employees = () => {
  const location = useLocation();
  const selectedProject = location.state?.data;
  const [employees, setEmployees] = useState([]);
  const [selected, setSelected] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state for data fetching
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/add-employee");
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(employees.map((_, index) => index));
    } else {
      setSelected([]);
    }
  };

  useEffect(() => {
    if (selectedProject) {
      setEmployees([
        ...selectedProject.employees,
        selectedProject.siteHead,
        selectedProject.assistant,
      ]);
      setLoading(false); // Set loading to false once employees are loaded
    } else {
      fetchUsers();
    }
  }, [selectedProject]);

  const fetchUsers = async () => {
    setLoading(true); // Set loading to true before fetching data
    const response = await apiClient.get("/users/");
    setEmployees(response.data);
    setLoading(false); // Set loading to false once data is fetched
  };

  const handleSelect = (index) => {
    const selectedIndex = selected.indexOf(index);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, index);
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

  const handleViewEmployee = (id) => {
    navigate(`/add-employee/${id}`);
  };

  const handleDelete = async () => {
    try {
      await apiClient.delete(`/users/${userToDelete}`);
      setEmployees(
        employees.filter((employee) => employee._id !== userToDelete)
      );
      setOpenDialog(false);
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const handleOpenDialog = (userId) => {
    setUserToDelete(userId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h5" className="mb-4 font-semibold text-gray-800">
          Projects &gt; Employees
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
          onClick={handleClick}
        >
          + Add New Employee
        </Button>
      </div>

      <Paper elevation={0} className="p-4">
        {loading ? (
          <Box className="flex justify-center my-6">
            <CircularProgress color="primary" /> {/* Circular progress shown while loading */}
          </Box>
        ) : (
          <TableContainer component={Paper} style={{ overflowX: "auto" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      indeterminate={
                        selected.length > 0 && selected.length < employees.length
                      }
                      checked={
                        employees.length > 0 && selected.length === employees.length
                      }
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell>Employee Name</TableCell>
                  <TableCell>ID</TableCell>
                  <TableCell>Phone Number</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employees.map((employee, index) => (
                  <TableRow key={index}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={selected.indexOf(index) !== -1}
                        onChange={() => handleSelect(index)}
                      />
                    </TableCell>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>{employee.employeeId}</TableCell>
                    <TableCell>{employee.phone}</TableCell>
                    <TableCell>{employee.role}</TableCell>
                    <TableCell>
                      <span
                        style={{
                          background: "#62912C47",
                          borderRadius: "30px",
                          padding: "10px",
                        }}
                      >
                        {employee.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Box className="flex items-center justify-around rounded-lg border border-gray-300">
                        <IconButton
                          aria-label="view"
                          sx={{ color: "#6c757d" }}
                          onClick={() => handleViewEmployee(employee._id)}
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
                          onClick={() => handleOpenDialog(employee._id)}
                        >
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
          <Typography variant="body2" color="textSecondary" className="mr-2 pr-2">
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
            of {employees.length} entries
          </Typography>
        </div>
        <Pagination count={5} onPageChange={(page) => console.log("Page:", page)} />
      </div>

      {/* Confirmation Dialog */}
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

export default Employees;
