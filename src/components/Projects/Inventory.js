import React, { useState } from 'react';
import {
  Box,
  Checkbox,
  IconButton,
  Typography,
  Grid,
  Paper,
  Select,
  MenuItem,
  Divider,
  Button,
  Modal,
  TextField,
  Avatar,
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
  width: 600, // Adjusted width to accommodate two columns
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
              <Typography className="flex-1 !font-semibold">Type of Product</Typography>
              <Typography className="flex-1 !font-semibold">Amount Available</Typography>
              <Typography className="flex-1 !font-semibold">More Needed</Typography>
              <Typography className="flex-1 !font-semibold">Document</Typography>
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
                <Typography className="flex-1">{row.product}</Typography>
                <Typography className="flex-1">{row.amountAvailable}</Typography>
                <Typography className="flex-1">
                  <span style={{ background: row.moreNeeded === 'Yes' ? '#62912C47' : 'red', borderRadius: '30px', padding: '0 8px'  }}>
                    {row.moreNeeded}
                  </span>
                </Typography>
                <Typography className="flex-1">
                  <Button
                    variant="text"
                    style={{ color: '#007bff', textTransform: 'none' }}
                    startIcon={<DescriptionIcon />}
                  >
                    {row.document}
                  </Button>
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

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField required id="product-name" label="Product Name" fullWidth />
              </Grid>
              <Grid item xs={6}>
                <TextField required id="product-id" label="Product ID" fullWidth />
              </Grid>
              <Grid item xs={6}>
                <TextField required id="category" label="Category" fullWidth />
              </Grid>
              <Grid item xs={6}>
                <TextField required id="buying-price" label="Buying Price" fullWidth />
              </Grid>
              <Grid item xs={6}>
                <TextField required id="quantity" label="Quantity" fullWidth />
              </Grid>
              <Grid item xs={6}>
                <TextField required id="unit" label="Unit" fullWidth />
              </Grid>
              <Grid item xs={6}>
                <TextField required id="expiry-date" label="Expiry Date" fullWidth />
              </Grid>
              <Grid item xs={6}>
                <TextField required id="threshold-value" label="Threshold Value" fullWidth />
              </Grid>
            </Grid>

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
