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
  machineryName: 'Excavators',
  type: 'loaders',
  document: 'Site Inspection.pdf',
  working: 'Yes',
  trackingNumber: '258963147',
  partDemand: 'Yes',
  demandPartType: 'In-Progress',
  status: 'In-Progress',
});

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '8px',
};

const SiteInventory = () => {
  const [selected, setSelected] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    machineryName: '',
    type: '',
    working: '',
    trackingNumber: '',
    partDemand: '',
    demandPartType: '',
    status: '',
    document: null
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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Form Data:', formData);
    handleClose();
  };

  return (
    <Box className="p-6">
        <Box className="flex justify-between items-center mb-4">
            <Typography variant="h5" className="mb-4 font-semibold text-gray-800">
                Machinery &gt; Site Inventory
            </Typography>
            <Button
                variant="contained"
                onClick={handleOpen}
                sx={{ textTransform: 'none', backgroundColor: '#FC8908', fontWeight: '400', borderRadius: '8px' }}
                >
                Create a New Project
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
              <Typography className="!font-semibold">Machinery Name</Typography>
              <Typography className="!font-semibold">Type</Typography>
              <Typography className="!font-semibold">Documents</Typography>
              <Typography className="!font-semibold">Working</Typography>
              <Typography className="!font-semibold">Tracking Number</Typography>
              <Typography className="!font-semibold">Part Demand</Typography>
              <Typography className="!font-semibold">Demand Part Type</Typography>
              <Typography className="!font-semibold">Status</Typography>
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
                <Typography className="">{row.machineryName}</Typography>
                <Typography className="">{row.type}</Typography>
                <Typography className="">
                  <Button
                    variant="text"
                    style={{ color: '#007bff', textTransform: 'none' }}
                    startIcon={<DescriptionIcon />}
                  >
                    {row.document}
                  </Button>
                </Typography>
                <Typography className="" sx={{ background: '#62912C47', borderRadius: '30px', padding: '0 8px' }}>{row.working}</Typography>
                <Typography className="">{row.trackingNumber}</Typography>
                <Typography className="" sx={{ background: '#62912C47', borderRadius: '30px', padding: '0 8px' }}>{row.partDemand}</Typography>
                <Typography className="">
                  {/*<span style={{ color: 'orange' }}>{row.demandPartType}</span>*/}
                </Typography>
                <Typography className="">
                  <span style={{ background: 'orange', borderRadius: '30px', padding: '0 8px' }}>{row.status}</span>
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

      {/* Modal for creating a new project */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-title" variant="h6" component="h2">
            Create a New Project
          </Typography>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField name="machineryName" label="Machinery Name" fullWidth onChange={handleInputChange} required />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField name="type" label="Type" fullWidth onChange={handleInputChange} required />
                        </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Select name="working" fullWidth required value={formData.working} onChange={handleInputChange} displayEmpty>
                                <MenuItem value="">Select Working</MenuItem>
                                <MenuItem value="Yes">Yes</MenuItem>
                                <MenuItem value="No">No</MenuItem>
                            </Select>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField name="trackingNumber" label="Tracking Number" fullWidth onChange={handleInputChange} required />
                        </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Select name="partDemand" fullWidth required value={formData.partDemand} onChange={handleInputChange} displayEmpty>
                                <MenuItem value="">Select Part Demand</MenuItem>
                                <MenuItem value="Yes">Yes</MenuItem>
                                <MenuItem value="No">No</MenuItem>
                            </Select>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField name="demandPartType" label="Demand Part Type" fullWidth onChange={handleInputChange} required />
                        </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Select name="status" fullWidth required value={formData.status} onChange={handleInputChange} displayEmpty>
                                <MenuItem value="">Select Status of Demand</MenuItem>
                                <MenuItem value="In Progress">In Progress</MenuItem>
                                <MenuItem value="In Transport">In Transport</MenuItem>
                                <MenuItem value="Completed">Completed</MenuItem>
                            </Select>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField name="document" type="file" fullWidth onChange={handleInputChange} required />
                        </Grid>
                    </Grid>

                    <div className="flex justify-end mt-4">
                        <Button onClick={handleClose} color="error">
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained" className="!bg-[#FC8908]">
                            Submit Project
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

export default SiteInventory;
