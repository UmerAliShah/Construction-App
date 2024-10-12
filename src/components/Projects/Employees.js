import React, { useState, useEffect } from "react";
import {
  Box,
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
  CircularProgress,
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
  const [currentPage, setCurrentPage] = useState(1); // Manage the current page state
  const [openDialog, setOpenDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/add-employee");
  };

  const isEmployeesPage = location.pathname === "/employees";
  useEffect(() => {
    if (selectedProject) {
      setEmployees([
        ...selectedProject.employees,
        selectedProject.siteHead,
        selectedProject.assistant,
      ]);
      setLoading(false);
    }
    if (isEmployeesPage) {
      fetchUsers();
    }
  }, [selectedProject]);

  const fetchUsers = async () => {
    setLoading(true);
    const response = await apiClient.get("/users/");
    setEmployees(response.data);
    setLoading(false);
  };

  const handleEntriesChange = (event) => {
    setEntriesPerPage(event.target.value);
    setCurrentPage(1); // Reset page to 1 when changing entries per page
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

  const paginatedEmployees = employees.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h5" className="mb-4 font-semibold text-gray-800">
          {isEmployeesPage ? "Office" : "Projects"} &gt; Employees
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
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <TableContainer component={Paper} style={{ overflowX: "auto" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Employee Name</TableCell>
                  <TableCell>ID</TableCell>
                  <TableCell>Phone Number</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Salary Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedEmployees.map((employee, index) => (
                  <TableRow key={index}>
                    <TableCell>{employee?.name || "No Name"}</TableCell>
                    <TableCell>{employee?.employeeId}</TableCell>
                    <TableCell>{employee?.phone}</TableCell>
                    <TableCell>{employee?.role}</TableCell>
                    <TableCell>
                      <span
                        style={{
                          background: employee?.currentMonthPayStatus === "pending" ? "orange" : "#62912C47",
                          borderRadius: "30px",
                          padding: "10px",
                        }}
                      >
                        {employee?.currentMonthPayStatus}
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

      <Pagination
        totalEntries={employees.length}
        entriesPerPage={entriesPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onEntriesPerPageChange={handleEntriesChange}
      />

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
