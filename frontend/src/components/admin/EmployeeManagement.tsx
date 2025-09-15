import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const EmployeeManagement: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Employee Management
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="h6">Manage Employees</Typography>
          <Typography variant="body2" color="text.secondary">
            Employee CRUD operations will be here.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EmployeeManagement;