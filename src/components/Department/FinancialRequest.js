import React, { useState } from 'react';
import { Box, Button, Checkbox, Divider, Grid, IconButton, MenuItem, Modal, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import Pagination from '../../Pagination'; 
import { ReactComponent as EditIcon } from '../Icons/edit.svg';
import { ReactComponent as VisibilityIcon } from '../Icons/quickView.svg';
import { ReactComponent as DeleteIcon } from '../Icons/bin.svg';

// Mock roles for demonstration
const userRole = 'Owner'; // Example user role

// Sample data based on roles
const demoData = Array(10).fill().map((_, index) => ({
  id: index + 1,
  requester: 'Employee ' + (index + 1),
  department: 'Finance',
  requestAmount: `$${(index + 1) * 1000}.00`,
  status: index % 4 === 0 ? 'Approved' : index % 4 === 1 ? 'Disapproved' : index % 4 === 2 ? 'Waiting for approval' : 'Completed',
  document: 'Link_to_Document.pdf'
}));

// Role-based filtering of data
const filterDataByRole = (data, role) => {
  switch (role) {
    case 'Owner':
    case 'Owner Assistant':
      return data;
    case 'Office Assistant':
      return data.filter(item => item.requester === 'Employee 1'); // Assuming 'Employee 1' is the Office Assistant
    case 'Site Head':
    case 'Project Manager':
      return data.filter(item => ['Employee 1', 'Employee 2', 'Employee 3'].includes(item.requester));
    case 'Supply Manager':
      return data.filter(item => item.requester === 'Employee 2'); // Assuming 'Employee 2' is the Supply Manager
    default:
      return [];
  }
};

const FinancialRequests = () => {
  const [selected, setSelected] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [filteredData, setFilteredData] = useState(filterDataByRole(demoData, userRole));

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(filteredData.map(item => item.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelect = (id) => {
    const selectedIndex = selected.indexOf(id);
    const newSelected = selectedIndex === -1
      ? selected.concat(id)
      : selected.filter(item => item !== id);
    setSelected(newSelected);
  };

  const handleEntriesChange = (event) => {
    setEntriesPerPage(event.target.value);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h5" className="mb-4 font-semibold text-gray-800">
          Financial Requests
        </Typography>
        <Button
          variant="contained"
          className="mb-4 !bg-[#FC8908]"
          onClick={() => {}}
        >
          + Add Request
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
                    indeterminate={selected.length > 0 && selected.length < filteredData.length}
                    checked={filteredData.length > 0 && selected.length === filteredData.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Requester</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Request Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Document</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map(row => (
                <TableRow key={row.id}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selected.indexOf(row.id) !== -1}
                      onChange={() => handleSelect(row.id)}
                      color="primary"
                    />
                  </TableCell>
                  <TableCell>{row.requester}</TableCell>
                  <TableCell>{row.department}</TableCell>
                  <TableCell>{row.requestAmount}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>
                    <Button
                      variant="text"
                      startIcon={<VisibilityIcon />}
                    >
                      View Document
                    </Button>
                  </TableCell>
                  <TableCell>
                    <IconButton><EditIcon /></IconButton>
                    <IconButton><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <div className="flex justify-between items-center mt-6">
        <Typography variant="body2" color="textSecondary" className="mr-2">
          Showing {entriesPerPage} of {filteredData.length} entries
        </Typography>
        <Pagination count={5} onPageChange={(page) => console.log('Page:', page)} />
      </div>
    </div>
  );
};

export default FinancialRequests;
