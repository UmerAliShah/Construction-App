import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Divider,
  IconButton,
  MenuItem,
  Modal,
  Paper,
  Select,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress
} from '@mui/material';
import { ReactComponent as VisibilityIcon } from '../Icons/quickView.svg';
import { ReactComponent as DeleteIcon } from '../Icons/bin.svg';
import DescriptionIcon from '@mui/icons-material/Description';
import Pagination from '../../Pagination'; 

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
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Simulate data fetching
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Replace this with your actual data fetching logic
        // For demonstration, we're using a timeout to simulate an API call
        const response = await new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                referenceNumber: '258963147',
                partsDemandedType: 'In-Progress',
                document: 'Site Inspection.pdf',
                amount: '$15000.00',
                date: '26 July, 2024',
              },
              // Add more data objects as needed
            ]);
          }, 2000);
        });
        setData(response);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle error appropriately
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(data.map((_, index) => index));
    } else {
      setSelected([]);
    }
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
          + Create New Finance
        </Button>
      </Box>
      
      <Paper elevation={0} className="p-4">
        {loading ? (
          <Box className="flex justify-center items-center" style={{ minHeight: '200px' }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><Typography className="!font-semibold">Machinery Reference Number</Typography></TableCell>
                  <TableCell><Typography className="!font-semibold">Parts Demanded Type</Typography></TableCell>
                  <TableCell><Typography className="!font-semibold">Picture/Documents</Typography></TableCell>
                  <TableCell><Typography className="!font-semibold">Amount</Typography></TableCell>
                  <TableCell><Typography className="!font-semibold">Date</Typography></TableCell>
                  <TableCell><Typography className="!font-semibold">Action</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row, index) => (
                  <TableRow key={index} hover>
                    <TableCell>{row.referenceNumber}</TableCell>
                    <TableCell>{row.partsDemandedType}</TableCell>
                    <TableCell>
                      <Button
                        variant="text"
                        style={{ color: '#007bff', textTransform: 'none' }}
                        startIcon={<DescriptionIcon />}
                        href={`path/to/documents/${row.document}`} // Update the path as needed
                        target="_blank"
                      >
                        {row.document}
                      </Button>
                    </TableCell>
                    <TableCell>{row.amount}</TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>
                      <Box
                        className="flex items-center justify-between rounded-lg border border-gray-300"
                        sx={{ backgroundColor: '#f8f9fa' }}
                      >
                        <IconButton aria-label="view" sx={{ color: '#6c757d' }}>
                          <VisibilityIcon />
                        </IconButton>
                        <Divider orientation="vertical" flexItem sx={{ borderColor: '#e0e0e0' }} />
                        <IconButton aria-label="delete" sx={{ color: '#dc3545' }}>
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

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="new-project-modal-title"
        aria-describedby="new-project-modal-description"
      >
        <Box sx={style}>
          <Typography id="new-project-modal-title" variant="h6" component="h2">
            Create New Finance
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
                onChange={handleChange}
                required
            />
            {newProject.document && (
              <Typography variant="body2">
                Selected File: {newProject.document.name}
              </Typography>
            )}
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
            of {/* Update this to reflect actual total entries */}
            {data.length} entries
          </Typography>
        </div>
        <Pagination count={5} onPageChange={(page) => console.log('Page:', page)} />
      </div>
    </Box>
  );
};

export default MachineryFinance;
