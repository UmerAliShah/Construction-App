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
import DescriptionIcon from '@mui/icons-material/Description';
import Pagination from '../../Pagination'; 

const demoData = Array(10).fill({
  referenceNumber: '258963147',
  partsDemandedType: 'In-Progress',
  document: 'Site Inspection.pdf',
  amount: '$15000.00',
  date: '26 July, 2024',
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

const MachineryFinance = () => {
  const [selected, setSelected] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    referenceNumber: '',
    partsDemandedType: '',
    amount: '',
    document: null,
    date: ''
  });

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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewProject(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event) => {
    setNewProject(prev => ({ ...prev, document: event.target.files[0] }));
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('New Project Data:', newProject);
    handleClose();
  };

  return (
    <Box className="p-6">
      <Box className="flex justify-between items-center mb-4">
        <Typography variant="h5" className="font-semibold text-gray-800">
          Machinery &gt; Machinery Finance
        </Typography>
        <Button
          variant="contained"
          onClick={handleOpen}
          sx={{ textTransform: 'none', backgroundColor: '#FC8908', fontWeight: '400', borderRadius: '8px' }}
        >
          + Create New Project
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
              <Typography className="flex-1 !font-semibold">Machinery Reference Number</Typography>
              <Typography className="flex-1 !font-semibold">Parts Demanded Type</Typography>
              <Typography className="flex-1 !font-semibold">Picture/Documents</Typography>
              <Typography className="flex-1 !font-semibold">Amount</Typography>
              <Typography className="flex-1 !font-semibold">Date</Typography>
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
                <Typography className="flex-1">{row.referenceNumber}</Typography>
                <Typography className="flex-1"></Typography>
                <Typography className="flex-1">
                  <Button
                    variant="text"
                    style={{ color: '#007bff', textTransform: 'none' }}
                    startIcon={<DescriptionIcon />}
                  >
                    {row.document}
                  </Button>
                </Typography>
                <Typography className="flex-1">{row.amount}</Typography>
                <Typography className="flex-1">{row.date}</Typography>
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

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="new-project-modal-title"
        aria-describedby="new-project-modal-description"
      >
        <Box sx={style}>
          <Typography id="new-project-modal-title" variant="h6" component="h2">
            Create New Project
          </Typography>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <TextField
              name="referenceNumber"
              label="Machinery Reference Number"
              fullWidth
              required
              onChange={handleChange}
            />
            <TextField
              name="partsDemandedType"
              label="Parts Demanded Type"
              fullWidth
              required
              onChange={handleChange}
            />
            <TextField
              name="amount"
              label="Amount"
              fullWidth
              required
              onChange={handleChange}
            />
            <TextField
              name="document"
              type="file"
              fullWidth
              onChange={handleFileChange}
            />
            <TextField
              name="date"
              label="Date"
              type="date"
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              onChange={handleChange}
            />
            <div className="flex justify-between">
              <Button onClick={handleClose} color="error">
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
            </div>
          </form>
        </Box>
      </Modal>

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
            of 10,678 entries
          </Typography>
        </div>
        <Pagination count={5} onPageChange={(page) => console.log('Page:', page)} />
      </div>
    </Box>
  );
};

export default MachineryFinance;
