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
import { ReactComponent as EditIcon } from "../Icons/edit.svg";
import { ReactComponent as VisibilityIcon } from "../Icons/quickView.svg";
import { ReactComponent as DeleteIcon } from "../Icons/bin.svg";
import apiClient from "../../api/apiClient";


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

const Finances = () => {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState([]);
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

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  
  const fetchFinance = async () => {
    const response = await apiClient.get("/finance/all");
    if (response.status === 200) {
      setData(response.data);
      console.log(response.data, "res");
    }
  };

  useEffect(() => {
    fetchFinance();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h5" className="mb-4 font-semibold text-gray-800">
          Finances
        </Typography>
        <Button
          variant="contained"
          color="primary"
          className="mb-4 !bg-[#FC8908]"
          onClick={handleOpen}
        >
          + Add New Finance
        </Button>
      </div>

      <Paper elevation={0} className="p-4">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    indeterminate={
                      selected.length > 0 && selected.length < data.length
                    }
                    checked={data.length > 0 && selected.length === data.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Department Type</TableCell>
                <TableCell>Name of Person Concerned</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Amount Given</TableCell>
                <TableCell>Total Given So Far</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Approved By</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={selected.indexOf(index) !== -1}
                      onChange={() => handleSelect(index)}
                    />
                  </TableCell>
                  <TableCell className="flex-1">{row.department}</TableCell>
                  <TableCell className="flex-1">
                    {row.nameOfConcerned?.name || "no name"}
                  </TableCell>
                  <TableCell className="flex-1">{row.partstype}</TableCell>
                  <TableCell className="flex-1">{row.amount}</TableCell>
                  <TableCell className="flex-1">{row.amount}</TableCell>
                  <TableCell className="flex-1">
                    <span
                      style={{
                        background: "#62912C47",
                        borderRadius: "40px",
                        padding: "10px",
                      }}
                    >
                      {row.status}
                    </span>
                  </TableCell>
                  <TableCell className="flex-1">
                    {row.approvedBy?.name || "Not Approved"}
                  </TableCell>
                  <TableCell
                    className="flex items-center justify-between rounded-lg border border-gray-300"
                    sx={{ backgroundColor: "#f8f9fa" }}
                  >
                    <IconButton aria-label="edit" sx={{ color: "#6c757d" }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton aria-label="view" sx={{ color: "#6c757d" }}>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton aria-label="delete" sx={{ color: "#dc3545" }}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <div className="flex justify-between items-center mt-6">
        <div className="flex items-center">
          <Typography
            variant="body2"
            color="textSecondary"
            className="mr-2 pr-4"
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
            of 10,678 entries
          </Typography>
        </div>
        <Pagination
          count={5}
          onPageChange={(page) => console.log("Page:", page)}
        />
      </div>

      {/* Modal for adding new finance */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-title" variant="h6" component="h2">
            Add New Finance Entry
          </Typography>
          <Box
            component="form"
            noValidate
            autoComplete="off"
            className="flex flex-col gap-4 mt-4"
          >
            <TextField
              required
              id="department-type"
              label="Department Type"
              fullWidth
            />
            <TextField
              required
              id="name-of-person"
              label="Name of Person Concerned"
              fullWidth
            />
            <TextField
              required
              id="amount-given"
              label="Amount Given"
              fullWidth
            />
            <TextField
              required
              id="total-given"
              label="Total Given So Far"
              fullWidth
            />
            <div className="flex justify-end mt-4">
              <Button onClick={handleClose} color="error">
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className="!bg-[#FC8908]"
                sx={{ ml: 2 }}
              >
                Add Entry
              </Button>
            </div>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default Finances;
