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
import DescriptionIcon from "@mui/icons-material/Description";
import apiClient from "../../api/apiClient";
import Toast from "../Toast";

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

const OfficeFinance = () => {
  const [selected, setSelected] = useState([]);
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastData, SetToastData] = useState({
    bg: null,
    message: null,
  });
  const initialData = {
    nameOfConcerned: "",
    type: "",
    amount: "",
    document: "",
  };
  const [finance, setFinance] = useState(initialData);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [open, setOpen] = useState(false);

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(data.map((_, index) => index));
    } else {
      setSelected([]);
    }
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
  const showToastMessage = (message, bg) => {
    SetToastData({ message, bg });
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDelete = async (id) => {
    const response = await apiClient.delete(`/finance/${id}`);
    if (response.status === 200) {
      showToastMessage("Entry Deleted SuccussFully", "bg-success");
      fetchFinance();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create formData to handle file upload (document)
    const formData = new FormData();
    formData.append("nameOfConcerned", finance.nameOfConcerned);
    formData.append("partstype", finance.type);
    formData.append("amount", finance.amount);
    formData.append("department", "office");
    if (finance.document) {
      formData.append("document", finance.document);
    }

    try {
      await apiClient.post("/finance", formData);
      handleClose();
      fetchFinance();
      setFinance(initialData);
    } catch (error) {
      console.error("Error adding finance record:", error);
    }
  };

  const fetchFinance = async () => {
    const response = await apiClient.get("/finance/office");
    if (response.status === 200) {
      setData(response.data);
      console.log(response.data, "res");
    }
  };

  const fetchUsers = async () => {
    const response = await apiClient.get("/users/");
    if (response.status === 200) {
      setUsers(response.data);
      console.log(response.data, "res");
    }
  };

  useEffect(() => {
    fetchFinance();
    fetchUsers();
  }, []);
  return (
    <Box className="p-6">
      {showToast ? (
        <Toast bg={toastData.bg} message={toastData.message} />
      ) : null}
      <Box className="flex justify-between items-center mb-4">
        <Typography variant="h5" className="mb-4 font-semibold text-gray-800">
          Office &gt; Finance
        </Typography>
        <Button
          variant="contained"
          className="mb-4 !bg-[#FC8908]"
          onClick={handleOpen}
        >
          + Add Office Finance
        </Button>
      </Box>
      <Paper elevation={0} className="p-4">
        <Grid container>
          {/* Table Headings */}
          <Grid item xs={12}>
            <Box className="bg-white-50 p-2 rounded-md flex items-center justify-between">
              <Checkbox
                color="primary"
                indeterminate={
                  selected.length > 0 && selected.length < data.length
                }
                checked={data.length > 0 && selected.length === data.length}
                onChange={handleSelectAll}
              />
              <Typography className="flex-1 !font-semibold">Type</Typography>
              <Typography className="flex-1 !font-semibold">Amount</Typography>
              <Typography className="flex-1 !font-semibold">
                Documents
              </Typography>
              <Typography className="flex-1 !font-semibold">Status</Typography>
              <Typography className="flex-1 !font-semibold">
                Approved By
              </Typography>
              <Typography className="!font-semibold">Action</Typography>
            </Box>
          </Grid>

          {data.map((row, index) => (
            <Grid item xs={12} key={index}>
              <Box className="shadow-sm rounded-lg p-2 flex items-center justify-between border-b-2 my-2">
                <Checkbox
                  color="primary"
                  checked={selected.indexOf(index) !== -1}
                  onChange={() => handleSelect(index)}
                />
                <Typography className="flex-1">{row.partstype}</Typography>
                <Typography className="flex-1">{row.amount}</Typography>
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
                <Typography className="flex-1">
                  <span
                    style={{
                      background: "#62912C47",
                      borderRadius: "30px",
                      padding: "10px",
                    }}
                  >
                    {row.status}
                  </span>
                </Typography>
                <Typography className="flex-1">
                  {row.approvedBy?.name || ""}
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
                  <IconButton aria-label="delete" sx={{ color: "#dc3545" }}>
                    <DeleteIcon onClick={() => handleDelete(row._id)} />
                  </IconButton>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-title" variant="h6" component="h2">
            Add Office Finance Entry
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
              value={finance.nameOfConcerned}
              onChange={(e) => setFinance({ ...finance, nameOfConcerned: e.target.value })}
            >
              <MenuItem value="">Name of Concerned</MenuItem>
              {users.map((user) => (
                <MenuItem key={user._id} value={user._id}>
                  {user.name}
                </MenuItem>
              ))}
            </Select>
            <TextField
              required
              id="type"
              label="Type"
              fullWidth
              onChange={(e) => setFinance({ ...finance, type: e.target.value })}
            />
            <TextField
              required
              id="amount"
              label="Amount"
              fullWidth
              onChange={(e) =>
                setFinance({ ...finance, amount: e.target.value })
              }
            />
            <TextField
              required
              id="document"
              //  label="Document"
              fullWidth
              type="file"
              onChange={(e) =>
                setFinance({ ...finance, document: e.target.files[0] })
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
                Add Finance Entry
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
            of {data.length} entries
          </Typography>
        </div>
        <Pagination
          count={5}
          onPageChange={(page) => console.log("Page:", page)}
        />
      </div>
    </Box>
  );
};

export default OfficeFinance;
