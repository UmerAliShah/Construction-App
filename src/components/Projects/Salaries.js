import React, { useState } from 'react';
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
  Typography
} from '@mui/material';
import { ReactComponent as VisibilityIcon } from '../Icons/quickView.svg';
import { ReactComponent as DeleteIcon } from '../Icons/bin.svg';
import Pagination from '../../Pagination'; 

const demoData = Array(10).fill({
  employeeName: 'Conrad Webber',
  salaryPaid: 'Yes',
});

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '8px',
};

const Salaries = () => {
  const [selected, setSelected] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [open, setOpen] = useState(false);

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(demoData.map((_, index) => index));
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

  return (
    <Box className="p-6">
        <Box className="flex justify-between items-center mb-4">
            <Typography variant="h5" className="mb-4 font-semibold text-gray-800">
                Projects &gt; Salaries
            </Typography>
            <Button
                variant="contained"
                className="mb-4 !bg-[#FC8908]"
                onClick={handleOpen}
            >
                + Add Salary
            </Button>
        </Box>
      <Paper elevation={0} className="p-4">
        <Grid container>
          {/* Table Headings */}
          <Grid item xs={12}>
            <Box className="bg-white-50 p-2 rounded-md flex items-center justify-between">
              <Checkbox
                color="primary"
                indeterminate={selected.length > 0 && selected.length < demoData.length}
                checked={demoData.length > 0 && selected.length === demoData.length}
                onChange={handleSelectAll}
              />
              <Typography className="flex-1 !font-semibold">Employee Name</Typography>
              <Typography className="flex-1 !font-semibold">Salary Paid</Typography>
              <Typography className="!font-semibold">Action</Typography>
            </Box>
          </Grid>

          {/* Table Rows */}
          {demoData.map((row, index) => (
            <Grid item xs={12} key={index}>
              <Box
                className="shadow-sm rounded-lg p-2 flex items-center justify-between border-b-2 my-2"
              >
                <Checkbox
                  color="primary"
                  checked={selected.indexOf(index) !== -1}
                  onChange={() => handleSelect(index)}
                />
                <Typography className="flex-1">{row.employeeName}</Typography>
                <Typography className="flex-1">
                  <span style={{ background: row.salaryPaid === 'Yes' ? '#62912C47' : 'red', borderRadius: '30px', padding: '0 8px'  }}>
                    {row.salaryPaid}
                  </span>
                </Typography>
                <Box
                  className="flex items-center justify-between rounded-lg border border-gray-300"
                  sx={{ backgroundColor: '#f8f9fa' }}>
                  <IconButton aria-label="view" sx={{ color: '#6c757d' }}>
                    <VisibilityIcon />
                  </IconButton>
                  <Divider orientation="vertical" flexItem sx={{ borderColor: '#e0e0e0' }} />
                  <IconButton aria-label="delete" sx={{ color: '#dc3545' }}>
                    <DeleteIcon />
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
            Add Salary
          </Typography>
          <Box
            component="form"
            noValidate
            autoComplete="off"
            className="flex flex-col gap-4 mt-4"
          >
            <TextField
              required
              id="employee-name"
              label="Employee Name"
              fullWidth
            />
            <Select
              required
              fullWidth
              label="Salary Paid"
              value=""
              onChange={() => {}}
              displayEmpty
            >
              <MenuItem value="">Select</MenuItem>
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </Select>
            <div className="flex justify-end mt-4">
              <Button onClick={handleClose} color="error">
                Cancel
              </Button>
              <Button type="submit" variant="contained" className="!bg-[#FC8908]">
                Add Salary
              </Button>
            </div>
          </Box>
        </Box>
      </Modal>

      <Box className="flex justify-between items-center mt-6">
        <Box className="flex items-center">
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
            of 10,678 entries
          </Typography>
        </Box>
        <Pagination count={5} onPageChange={(page) => console.log('Page:', page)} />
      </Box>
    </Box>
  );
};

export default Salaries;
