import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  CircularProgress,
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
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import Pagination from '../../Pagination';
import { ReactComponent as VisibilityIcon } from '../Icons/quickView.svg';
import { ReactComponent as DeleteIcon } from '../Icons/bin.svg';
import apiClient from '../../api/apiClient';

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
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    machineryName: '',
    type: '',
    working: '',
    trackingNumber: '',
    partDemand: '',
    demandPartType: '',
    status: '',
    document: null,
  });

  useEffect(() => {
    // Fetching data from the backend
    const fetchData = async () => {
      try {
        const response = await apiClient.get('/machinery');
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching mechinaries:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEntriesChange = (event) => {
    setEntriesPerPage(event.target.value);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Form Data:', formData);
    handleClose();
  };

  const paginatedData = data.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

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
      <Paper elevation={0}>
        <TableContainer component={Paper} sx={{ maxHeight: 400, overflowY: 'auto' }}>
          <Table stickyHeader aria-label="site inventory table">
            <TableHead>
              <TableRow>
                <TableCell>Machinery Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Documents</TableCell>
                <TableCell>Working</TableCell>
                <TableCell>Tracking Number</TableCell>
                <TableCell>Part Demand</TableCell>
                <TableCell>Demand Part Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
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
                    <TableCell>
                    <Button
                        variant="contained"
                        size="small"
                        style={{
                          backgroundColor: "#ffcc80",
                          color: "#f57c00",
                          borderRadius: "16px",
                        }}
                      >
                        {row.working ? 'Yes' : 'No'}
                      </Button>
                    </TableCell>
                    <TableCell>{row.trackingNumber}</TableCell>
                    <TableCell>
                        <Button
                            variant="contained"
                            size="small"
                            style={{
                            backgroundColor: "#ffcc80",
                            color: "#f57c00",
                            borderRadius: "16px",
                            }}
                        >
                            {row.partDemand ? 'Yes' : 'No'}
                        </Button>
                    </TableCell>
                    <TableCell>{row.partsDemandType}</TableCell>
                    <TableCell>
                      <span style={{ background: 'orange', borderRadius: '30px', padding: '0 8px' }}>
                        {row.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Box
                        className="flex items-center justify-between rounded-lg border border-gray-300"
                        sx={{ backgroundColor: '#f8f9fa' }}
                      >
                        <IconButton aria-label="view" sx={{ color: '#6c757d' }}>
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton aria-label="delete" sx={{ color: '#dc3545' }}>
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
                      <Box className="flex flex-col gap-4">
                          {/* Machinery Name and Type */}
                          <Box className="flex gap-4">
                              <TextField
                                  name="machineryName"
                                  label="Machinery Name"
                                  fullWidth
                                  onChange={handleInputChange}
                                  required
                              />
                              <TextField
                                  name="type"
                                  label="Type"
                                  fullWidth
                                  onChange={handleInputChange}
                                  required
                              />
                          </Box>

                          {/* Working and Tracking Number */}
                          <Box className="flex gap-4">
                              <TextField
                                  select
                                  name="working"
                                  label="Working"
                                  fullWidth
                                  value={formData.working}
                                  onChange={handleInputChange}
                                  required
                              >
                                  <MenuItem value="">Select Working</MenuItem>
                                  <MenuItem value="Yes">Yes</MenuItem>
                                  <MenuItem value="No">No</MenuItem>
                              </TextField>
                              <TextField
                                  name="trackingNumber"
                                  label="Tracking Number"
                                  fullWidth
                                  onChange={handleInputChange}
                                  required
                              />
                          </Box>

                          {/* Part Demand and Demand Part Type */}
                          <Box className="flex gap-4">
                              <TextField
                                  select
                                  name="partDemand"
                                  label="Part Demand"
                                  fullWidth
                                  value={formData.partDemand}
                                  onChange={handleInputChange}
                                  required
                              >
                                  <MenuItem value="">Select Part Demand</MenuItem>
                                  <MenuItem value="Yes">Yes</MenuItem>
                                  <MenuItem value="No">No</MenuItem>
                              </TextField>
                              <TextField
                                  name="demandPartType"
                                  label="Demand Part Type"
                                  fullWidth
                                  onChange={handleInputChange}
                                  required
                              />
                          </Box>

                          {/* Status and Document Upload */}
                          <Box className="flex gap-4">
                              <TextField
                                  select
                                  name="status"
                                  label="Status"
                                  fullWidth
                                  value={formData.status}
                                  onChange={handleInputChange}
                                  required
                              >
                                  <MenuItem value="">Select Status of Demand</MenuItem>
                                  <MenuItem value="In Progress">In Progress</MenuItem>
                                  <MenuItem value="In Transport">In Transport</MenuItem>
                                  <MenuItem value="Completed">Completed</MenuItem>
                              </TextField>
                              <TextField
                                  name="document"
                                  type="file"
                                  fullWidth
                                  onChange={handleInputChange}
                                  required
                              />
                          </Box>
                      </Box>

                      {/* Buttons */}
                      <Box className="flex justify-end mt-4">
                          <Button onClick={handleClose} color="error">
                              Cancel
                          </Button>
                          <Button type="submit" variant="contained" className="!bg-[#FC8908]">
                              Submit Project
                          </Button>
                      </Box>
                  </form>
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

export default SiteInventory;
