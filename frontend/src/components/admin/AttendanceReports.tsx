import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const AttendanceReports: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Attendance Reports
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="h6">Reports & Analytics</Typography>
          <Typography variant="body2" color="text.secondary">
            Attendance reports and analytics will be here.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AttendanceReports;