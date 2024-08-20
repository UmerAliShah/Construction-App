import React, { useState } from 'react';
import { Box, Checkbox, IconButton, Typography, Grid, Paper, Select, MenuItem, Button, LinearProgress, Divider } from '@mui/material';
import { ReactComponent as VisibilityIcon } from '../Icons/quickView.svg';
import { ReactComponent as DeleteIcon } from '../Icons/bin.svg';
import Pagination from '../../Pagination'; 
import DescriptionIcon from '@mui/icons-material/Description';

const demoData = Array(10).fill({
  sectionNo: '52142154',
  progress: 70, // Progress percentage
  document: 'Site Inspection.pdf',
});

const OfficeProgress = () => {
  const [selected, setSelected] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

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

  return (
    <div className="p-6">
      <Typography variant="h5" className="mb-4 font-semibold text-gray-800 d-inline-block">
        Office &gt; Progress
      </Typography>
      <Button
        variant="contained"
        color="warning"
        className="mb-4 !bg-[#FC8908]"
        style={{ float: 'right', textTransform: 'capitalize', fontWeight: '400', borderRadius: '8px' }}
      >
        + Create New Project
      </Button>
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
              <Typography className="flex-1 !font-semibold">Section No</Typography>
              <Typography className="flex-1 !font-semibold">Progress Report</Typography>
              <Typography className="flex-1 !font-semibold">Documents</Typography>
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
                <Typography className="flex-1">{row.sectionNo}</Typography>
                <Box className="flex-1 flex items-center">
                  <LinearProgress
                    variant="determinate"
                    value={row.progress}
                    style={{ width: '80%', marginRight: '8px', height: '8px', borderRadius: '4px' }}
                  />
                  <Typography>{`${row.progress}%`}</Typography>
                </Box>
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
    </div>
  );
};

export default OfficeProgress;
