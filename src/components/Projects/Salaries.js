import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Modal,
  Paper,
  Select,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { ReactComponent as VisibilityIcon } from "../Icons/quickView.svg";
import { ReactComponent as DeleteIcon } from "../Icons/bin.svg";
import Pagination from "../../Pagination";
import { useLocation, useParams } from "react-router-dom";
import apiClient from "../../api/apiClient";
import { CloseFullscreen } from "@mui/icons-material";
import useApi from "../../hooks/useApi";

const demoData = Array(10).fill({
  employeeName: "Conrad Webber",
  salaryPaid: "Yes",
});

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

const Salaries = () => {
  const location = useLocation();
  const { id } = useParams();
  const [selected, setSelected] = useState({});
  const [data, setData] = useState([]);

  const [currentMonthPayStatus, setCurrentMonthPayStatus] = useState();
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handleEntriesChange = (event) => {
    setEntriesPerPage(event.target.value);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const paginatedData = data.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );
  const { request, loading, error } = useApi((data) =>
    apiClient.put(`/users/${selected._id}`,data)
);
  const getUsers = async () => {

    const response = await apiClient.get(`/projects/${id}`);
    if (response.status === 200) {
      setData([
        ...response.data.employees,
        response.data.siteHead,
        response.data.assistant,
      ]);
    }
  };
  useEffect(() => {
    getUsers();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {
      currentMonthPayStatus,
    }
    const response = await request(data);
    if (response.status === 200) {
      getUsers();
      handleClose();
    }
  };

  return (
    <Box className="p-6">
      <Box className="flex justify-between items-center mb-4">
        <Typography variant="h5" className="mb-4 font-semibold text-gray-800">
          Projects &gt; Salaries
        </Typography>
        {/* <Button
          variant="contained"
          className="mb-4 !bg-[#FC8908]"
          onClick={handleOpen}
        >
          + Add Salary
        </Button> */}
      </Box>
      <Paper elevation={0} className="p-4">
        <Grid container>
          {/* Table Headings */}
          <Grid item xs={12}>
            <Box className="bg-white-50 p-2 rounded-md flex items-center justify-between">
              <Typography className="flex-1 !font-semibold">
                Employee Name
              </Typography>
              <Typography className="flex-1 !font-semibold">
                Salary Paid
              </Typography>
              <Typography className="!font-semibold">Action</Typography>
            </Box>
          </Grid>

          {/* Table Rows */}
          {paginatedData.map((row, index) => (
            <Grid item xs={12} key={index}>
              <Box className="shadow-sm rounded-lg p-2 flex items-center justify-between border-b-2 my-2">
                <Typography className="flex-1">{row.name}</Typography>
                <Typography className="flex-1">
                  <span
                    style={{
                      background:
                        row.currentMonthPayStatus === "paid"
                          ? "#62912C47"
                          : "red",
                      borderRadius: "30px",
                      padding: "0 8px",
                    }}
                  >
                    {row.currentMonthPayStatus}
                  </span>
                </Typography>
                <Box
                  className="flex items-center justify-between rounded-lg border border-gray-300"
                  sx={{ backgroundColor: "#f8f9fa" }}
                >
                  <IconButton aria-label="view" sx={{ color: "#6c757d" }}>
                    <VisibilityIcon
                      onClick={() => {
                        handleOpen();
                        setSelected(row);
                        setCurrentMonthPayStatus(row.currentMonthPayStatus);
                      }}
                    />
                  </IconButton>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Modal for adding new Salary */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-title" variant="h6" component="h2">
            Edit Salary
          </Typography>
          <Box
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 mt-4"
          >
            <TextField
              required
              id="employee-name"
              label="Employee Name"
              fullWidth
              disabled
              value={selected?.name}
            />
            <Select
              required
              fullWidth
              label="Salary Paid"
              value={currentMonthPayStatus}
              onChange={(e) => {
                setCurrentMonthPayStatus(e.target.value);
              }}
            >
              <MenuItem value="">Select</MenuItem>
              <MenuItem value="paid">Paid</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
            </Select>
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
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Edit Salary"
                )}
                
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

export default Salaries;
