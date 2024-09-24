import React, { useEffect, useState } from 'react';
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography, Link, IconButton, InputAdornment } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import apiClient from '../../api/apiClient';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const AddNewEmployee = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('');
  const [roles, setRoles] = useState([
    "owner",
    "owner_assistant",
    "site_assistant",
    "office_assistant",
    "site_head",
    "project_manager",
    "supply_manager",
    "vendor"
  ]);
  
  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    profileImage: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const [employeeData, setEmployeeData] = useState({
    name: '',
    employeeId: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    //profileImage: null,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      // Fetch employee data and populate the form
      const fetchEmployee = async () => {
        try {
          const response = await apiClient.get(`/users/${id}`);
          setEmployeeData(response.data);
        } catch (error) {
          console.error('Error fetching employee data:', error);
        }
      };
      fetchEmployee();
    }
  }, [id]);

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, profileImage: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const form = new FormData();
    form.append('name', formData.name);
    form.append('employeeId', formData.employeeId);
    form.append('email', formData.email);
    form.append('password', formData.password);
    form.append('phone', formData.phone);
    form.append('address', formData.address);
    form.append('role', role);
    if (formData.profileImage) {
      form.append('profileImage', formData.profileImage);
    }

    try {
        setLoading(true);
      const response = await apiClient.post('/users', form);
      navigate(`/employees`);

      if (response.status !== 200) {
        throw new Error('Failed to add employee');
      }

      console.log('Employee added successfully');
    } catch (error) {
      console.error('Error:', error);
      setError('Error adding employee');
    } finally {
        setLoading(false);
    }
  };

  return (
    <Box p={4} bgcolor="#f8f9fa" className='add-employee'>
      <Typography variant="h5" className="mb-4 font-semibold text-gray-800">
        Add New Employee
      </Typography>
      <Box p={4} bgcolor="white" borderRadius="8px" boxShadow={3} component="form" onSubmit={handleSubmit}>
        <Typography variant="h6" gutterBottom>
          Employee Information
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Fill in the information below to add a new employee
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <Grid container spacing={2} mt={2}>
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center">
              <InputLabel shrink sx={{ flexBasis: '35%', fontWeight: '500', fontSize: '20px' }}>Name</InputLabel>
              <TextField name="name" value={formData.name} onChange={handleChange} placeholder="Enter user name" variant="outlined" fullWidth />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center">
              <InputLabel shrink sx={{ flexBasis: '35%', fontWeight: '500', fontSize: '20px' }}>Employee ID</InputLabel>
              <TextField name="employeeId" value={formData.employeeId} onChange={handleChange} placeholder="Enter ID" variant="outlined" fullWidth />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center">
              <InputLabel shrink sx={{ flexBasis: '35%', fontWeight: '500', fontSize: '20px' }}>Email</InputLabel>
              <TextField name="email" value={formData.email} onChange={handleChange} placeholder="Enter email" variant="outlined" fullWidth />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center">
              <InputLabel shrink sx={{ flexBasis: '35%', fontWeight: '500', fontSize: '20px' }}>Role</InputLabel>
              <FormControl fullWidth variant="outlined">
                <Select value={role} onChange={handleRoleChange} label="Role">
                  {roles.map((role, index) => (
                    <MenuItem key={index} value={role}>
                      {role}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center">
              <InputLabel shrink sx={{ flexBasis: '35%', fontWeight: '500', fontSize: '20px' }}>Password</InputLabel>
              <TextField
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                variant="outlined"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center">
              <InputLabel shrink sx={{ flexBasis: '35%', fontWeight: '500', fontSize: '20px' }}>Confirm Password</InputLabel>
              <TextField
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                variant="outlined"
                type={showConfirmPassword ? 'text' : 'password'}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowConfirmPassword}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center">
              <InputLabel shrink sx={{ flexBasis: '35%', fontWeight: '500', fontSize: '20px' }}>Phone</InputLabel>
              <TextField name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter Phone" variant="outlined" fullWidth />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center">
              <InputLabel shrink sx={{ flexBasis: '35%', fontWeight: '500', fontSize: '20px' }}>Address</InputLabel>
              <TextField name="address" value={formData.address} onChange={handleChange} placeholder="Address" variant="outlined" fullWidth />
            </Box>
          </Grid>

          {/* Profile Image Upload */}
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center">
              <InputLabel shrink sx={{ flexBasis: '35%', fontWeight: '500', fontSize: '20px' }}>Profile Image</InputLabel>
              <TextField
                type="file"
                onChange={handleImageChange}
                variant="outlined"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Box>
          </Grid>
        </Grid>

        <Box display="flex" justifyContent="flex-end" alignItems="center" mt={4}>
          <Link href="/employees" underline="none" variant="button" sx={{ mr: 2, color: '#979797 !important', textTransform: 'capitalize !important' }}>
            Cancel
          </Link>
          <Button variant="contained" color="warning" type="submit" className='!capitalize' disabled={loading}>
                {loading ? 'Saving...' : 'Save'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AddNewEmployee;
