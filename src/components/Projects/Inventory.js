import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Typography,
  Select,
  MenuItem,
  Divider,
  Button,
  Modal,
  TextField,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { styled } from '@mui/system';
import { ReactComponent as VisibilityIcon } from '../Icons/quickView.svg';
import { ReactComponent as DeleteIcon } from '../Icons/bin.svg';
import DescriptionIcon from '@mui/icons-material/Description';
import Pagination from '../../Pagination';

const demoData = Array(10).fill({
  product: 'Cement',
  amountAvailable: '$15000.00',
  moreNeeded: 'Yes',
  document: 'Site Inspection.pdf',
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

const ImageUploadBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(2),
  border: `1px dashed grey`,
  borderRadius: '8px',
  cursor: 'pointer',
  marginBottom: theme.spacing(2),
}));

const Inventory = () => {
  const [selected, setSelected] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const handleEntriesChange = (event) => {
    setEntriesPerPage(event.target.value);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const paginatedData = demoData.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

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
          style={{ float: 'right', textTransform: 'capitalize', fontWeight: '400', borderRadius: '8px' }}
          onClick={handleOpen}
        >
          + Add New Inventory
        </Button>
      </div>

      <TableContainer component={Paper} elevation={0} className="p-4">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><Typography className="!font-semibold">Type of Product</Typography></TableCell>
              <TableCell><Typography className="!font-semibold">Amount Available</Typography></TableCell>
              <TableCell><Typography className="!font-semibold">More Needed</Typography></TableCell>
              <TableCell><Typography className="!font-semibold">Document</Typography></TableCell>
              <TableCell><Typography className="!font-semibold">Action</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row, index) => (
              <TableRow key={index} selected={selected.indexOf(index) !== -1}>
                <TableCell>{row.product}</TableCell>
                <TableCell>{row.amountAvailable}</TableCell>
                <TableCell>
                  <span style={{ background: row.moreNeeded === 'Yes' ? '#62912C47' : 'red', borderRadius: '30px', padding: '0 8px' }}>
                    {row.moreNeeded}
                  </span>
                </TableCell>
                <TableCell>
                  <Button
                    variant="text"
                    style={{ color: '#007bff', textTransform: 'none' }}
                    startIcon={<DescriptionIcon />}
                  >
                    {row.document}
                  </Button>
                </TableCell>
                <TableCell>
                  <Box
                    className="flex items-center justify-around rounded-lg border border-gray-300"
                    sx={{ backgroundColor: '#f8f9fa' }}>
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

      <Pagination
            totalEntries={demoData.length}
            entriesPerPage={entriesPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onEntriesPerPageChange={handleEntriesChange}
            />

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
          >
            <ImageUploadBox>
              <Avatar
                src={image}
                alt="Product Image"
                sx={{ width: 56, height: 56, marginBottom: 2 }}
              />
              <Typography variant="body2" color="textSecondary">
                Drag image here or{' '}
                <label htmlFor="upload-image" style={{ color: '#FC8908', cursor: 'pointer' }}>
                  Browse image
                </label>
              </Typography>
              <input
                type="file"
                id="upload-image"
                style={{ display: 'none' }}
                onChange={handleImageChange}
              />
            </ImageUploadBox>

            <Box className="flex flex-wrap gap-4">
              <TextField required id="product-name" label="Product Name" fullWidth />
              <TextField required id="product-id" label="Product ID" fullWidth />
              <TextField required id="category" label="Category" fullWidth />
              <TextField required id="buying-price" label="Buying Price" fullWidth />
              <TextField required id="quantity" label="Quantity" fullWidth />
              <TextField required id="unit" label="Unit" fullWidth />
              <TextField required id="expiry-date" label="Expiry Date" fullWidth />
              <TextField required id="threshold-value" label="Threshold Value" fullWidth />
            </Box>

            <div className="flex justify-between mt-4">
              <Button onClick={handleClose} color="error">
                Discard
              </Button>
              <Button type="submit" variant="contained" color="warning">
                Add Product
              </Button>
            </div>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default Inventory;
