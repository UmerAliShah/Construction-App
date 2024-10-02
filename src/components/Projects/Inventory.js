import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Modal,
  Typography,
  TextField,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/system';
import { useParams } from 'react-router-dom';
import DescriptionIcon from '@mui/icons-material/Description';
import { ReactComponent as VisibilityIcon } from '../Icons/quickView.svg';
import { ReactComponent as DeleteIcon } from '../Icons/bin.svg';
import apiClient from '../../api/apiClient'; // Assuming this is your API client

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

const Inventory = () => {
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [inventoryData, setInventoryData] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    demand: '',
    document: null,
  });

  // Fetch inventory data from the backend
  const fetchInventoryData = async () => {
    try {
      const response = await apiClient.get(`/inventory/site/${id}`);
      setInventoryData(response.data);
      console.log(response.data,'res')
    } catch (error) {
      console.error('Error fetching inventory data:', error);
    }
  };

  useEffect(() => {
    fetchInventoryData(); // Load data when the component mounts
  }, [id]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (event) => {
    setFormData({
      ...formData,
      document: event.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create FormData object to send the form data including the file
      const data = new FormData();
      data.append('name', formData.name);
      data.append('amount', formData.amount);
      data.append('demand', formData.demand);
      // data.append('type', formData.type);
      // data.append('quantity', formData.quantity);
      data.append('site', id);
      if (formData.document) {
        data.append('document', formData.document);
      }

      // Send the form data to the backend
      const response = await apiClient.post('/inventory', data);
      console.log('Inventory added:', response.data);

      // Add the new entry to the table (assuming backend returns the created entry)
      setInventoryData([...inventoryData, response.data]);

      // Reset the form and close the modal
      setFormData({
        name: '',
        amount: '',
        demand: '',
        document: null,
      });
      handleClose();
    } catch (error) {
      console.error('Error submitting inventory data:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiClient.delete(`/inventory/${id}`);
      // Remove the deleted entry from the table
      setInventoryData(inventoryData.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error deleting inventory item:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h5" className="mb-4 font-semibold text-gray-800">
          Projects &gt; Inventory
        </Typography>
        <Button
          variant="contained"
          color="warning"
          className="mb-4 !bg-[#FC8908]"
          style={{
            float: 'right',
            textTransform: 'capitalize',
            fontWeight: '400',
            borderRadius: '8px',
          }}
          onClick={handleOpen}
        >
          + Add New Inventory
        </Button>
      </div>

      {/* Table to show inventory details */}
      <TableContainer component={Paper} elevation={0} className="p-4">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><Typography className="!font-semibold">Type of Product</Typography></TableCell>
              <TableCell><Typography className="!font-semibold">Amount</Typography></TableCell>
              <TableCell><Typography className="!font-semibold">Demand</Typography></TableCell>
              <TableCell><Typography className="!font-semibold">Document</Typography></TableCell>
              <TableCell><Typography className="!font-semibold">Action</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventoryData.map((row) => (
              <TableRow key={row}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.amount}</TableCell>
                <TableCell>
                  <span
                    style={{
                      background: row.demand === 'Yes' ? '#62912C47' : 'red',
                      borderRadius: '30px',
                      padding: '0 8px',
                    }}
                  >
                    {row.demand}
                  </span>
                </TableCell>
                <TableCell>
                  <Button
                    variant="text"
                    style={{ color: '#007bff', textTransform: 'none' }}
                    startIcon={<DescriptionIcon />}
                    href={row.document} // Assuming the document URL is returned
                    target="_blank"
                  >
                    View Document
                  </Button>
                </TableCell>

                <TableCell>
                  <Box
                    className="flex items-center justify-between rounded-lg border border-gray-300"
                    sx={{ backgroundColor: '#f8f9fa' }}
                  >
                    <IconButton aria-label="view" sx={{ color: '#6c757d' }}>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      sx={{ color: '#dc3545' }}
                      onClick={() => handleDelete(row.id)}
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

      {/* Modal for adding new inventory item */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-title" variant="h6" component="h2">
            New Product
          </Typography>
          <Box
            component="form"
            noValidate
            autoComplete="off"
            className="flex flex-col gap-4 mt-4"
            onSubmit={handleSubmit}
          >
            <TextField
              required
              id="product-name"
              name="name"
              label="Type of Product"
              fullWidth
              value={formData.name}
              onChange={handleInputChange}
            />

            <TextField
              required
              id="amount"
              name="amount"
              label="Amount"
              fullWidth
              value={formData.amount}
              onChange={handleInputChange}
            />

            <Select
              labelId="demand-label"
              id="demand"
              name="demand"
              value={formData.demand}
              onChange={handleInputChange}
              fullWidth
            >
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </Select>

            <TextField
              required
              name="document"
              type="file"
              fullWidth
              onChange={handleFileChange}
            />

            <div className="flex justify-between mt-4">
              <Button onClick={handleClose} color="error">
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="warning">
                Submit
              </Button>
            </div>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default Inventory;
