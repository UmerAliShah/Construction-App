import React from 'react';
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography, Switch, FormControlLabel, Link, IconButton, InputAdornment } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const roles = ['Owner Assistants', 'Office Assistants', 'Site Head', 'Project Manager', 'Supply Manager'];

const AddNewEmployee = () => {
  const [role, setRole] = React.useState('');
  const [permissions, setPermissions] = React.useState({
    finances: true,
    ipcTracking: true,
    inventory: true,
    progress: true,
  });

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const handlePermissionChange = (permission, allow) => () => {
    setPermissions({ ...permissions, [permission]: allow });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Box p={4} bgcolor="#f8f9fa" className='add-employee'>
      <Typography variant="h5" className="mb-4 font-semibold text-gray-800">
        Add New Employee
      </Typography>
      <Box p={4} bgcolor="white" borderRadius="8px" boxShadow={3}>
        <Typography variant="h6" gutterBottom>
          Employee Information
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Fill in the information below to add a new employee
        </Typography>
        <Grid container spacing={2} mt={2}>
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center">
              <InputLabel shrink sx={{ flexBasis: '35%', fontWeight: '500', fontSize: '20px' }}>Name</InputLabel>
              <TextField placeholder="Enter user name" variant="outlined" fullWidth />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center">
              <InputLabel shrink sx={{ flexBasis: '35%', fontWeight: '500', fontSize: '20px' }}>Employee ID</InputLabel>
              <TextField placeholder="Enter ID" variant="outlined" fullWidth />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center">
              <InputLabel shrink sx={{ flexBasis: '35%', fontWeight: '500', fontSize: '20px' }}>Email</InputLabel>
              <TextField placeholder="Enter email" variant="outlined" fullWidth />
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
              <TextField placeholder="Enter Phone" variant="outlined" fullWidth />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center">
              <InputLabel shrink sx={{ flexBasis: '35%', fontWeight: '500', fontSize: '20px' }}>Address</InputLabel>
              <TextField placeholder="Address" variant="outlined" fullWidth />
            </Box>
          </Grid>
        </Grid>

        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Permission
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Role allowed to employee
          </Typography>
          <Grid container spacing={2} mt={2}>
            {Object.keys(permissions).map((permission, index) => (
              <Grid item xs={12} key={index}>
                <Box display="flex" alignItems="center">
                  <Typography sx={{ flexBasis: '30%', fontWeight: '600', fontSize: '18px' }}>
                    {permission.charAt(0).toUpperCase() + permission.slice(1).replace(/([A-Z])/g, ' $1')}
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={permissions[permission]}
                        onChange={handlePermissionChange(permission, true)}
                        color="primary"
                      />
                    }
                    label="Allow"
                    labelPlacement="end"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={!permissions[permission]}
                        onChange={handlePermissionChange(permission, false)}
                        color="secondary"
                      />
                    }
                    label="Deny"
                    labelPlacement="end"
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box display="flex" justifyContent="flex-end" alignItems="center" mt={4}>
          <Link href="/employees" underline="none" variant="button" sx={{ mr: 2, color: '#979797 !important', textTransform: 'capitalize !important' }}>
            Cancel
          </Link>
          <Button variant="contained" color="warning" className='!capitalize'>
            Save
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AddNewEmployee;
