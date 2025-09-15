import React, { useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Avatar, Stack, Chip } from '@mui/material';
import { Schedule, History, LocationOn, Face } from '@mui/icons-material';
import AttendanceInterface from './AttendanceInterface';
import { useAuth } from '../../contexts/AuthContext';
import { brandColors } from '../../theme';

const AttendancePage: React.FC = () => {
  const { user } = useAuth();
  const [currentStatus, setCurrentStatus] = useState<'CHECKED_IN' | 'CHECKED_OUT' | null>('CHECKED_OUT');
  const [loading, setLoading] = useState(false);

  const handleCheckIn = async (faceImage: string, location: { lat: number; lng: number }) => {
    try {
      setLoading(true);
      // API call would go here
      console.log('Check in:', { faceImage, location });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCurrentStatus('CHECKED_IN');
    } catch (error) {
      console.error('Check-in failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async (faceImage: string, location: { lat: number; lng: number }) => {
    try {
      setLoading(true);
      // API call would go here
      console.log('Check out:', { faceImage, location });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCurrentStatus('CHECKED_OUT');
    } catch (error) {
      console.error('Check-out failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const todayStats = {
    checkInTime: '9:15 AM',
    currentHours: '6h 45m',
    location: 'Office Premises',
    status: currentStatus,
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
        Attendance Management
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Manage your daily attendance with facial recognition and location verification.
      </Typography>

      <Grid container spacing={3}>
        {/* Main Attendance Interface */}
        <Grid item xs={12} lg={8}>
          <AttendanceInterface
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
            currentStatus={currentStatus}
            loading={loading}
          />
        </Grid>

        {/* Today's Summary */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar sx={{ bgcolor: brandColors.secondary[100], color: brandColors.secondary[700] }}>
                  <Schedule />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Today's Summary
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Your attendance for today
                  </Typography>
                </Box>
              </Box>

              <Stack spacing={3}>
                {/* Status */}
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Current Status
                  </Typography>
                  <Chip
                    label={todayStats.status === 'CHECKED_IN' ? 'Checked In' : 'Checked Out'}
                    color={todayStats.status === 'CHECKED_IN' ? 'success' : 'default'}
                    sx={{ fontWeight: 600 }}
                  />
                </Box>

                {/* Check-in Time */}
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Check-in Time
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {todayStats.status === 'CHECKED_IN' ? todayStats.checkInTime : 'Not checked in'}
                  </Typography>
                </Box>

                {/* Working Hours */}
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Working Hours
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {todayStats.status === 'CHECKED_IN' ? todayStats.currentHours : '0h 0m'}
                  </Typography>
                </Box>

                {/* Location */}
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Location
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOn fontSize="small" color="success" />
                    <Typography variant="body2" sx={{ fontWeight: 500, color: 'success.main' }}>
                      {todayStats.location}
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Instructions Card */}
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar sx={{ bgcolor: brandColors.primary[100], color: brandColors.primary[700] }}>
                  <Face />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    How to Use Facial Recognition Attendance
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Follow these steps for accurate attendance marking
                  </Typography>
                </Box>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Avatar sx={{ width: 48, height: 48, mx: 'auto', mb: 2, bgcolor: 'info.light' }}>
                      <LocationOn />
                    </Avatar>
                    <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                      1. Enable Location
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Allow location access to verify you're at the office
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Avatar sx={{ width: 48, height: 48, mx: 'auto', mb: 2, bgcolor: 'warning.light' }}>
                      <Face />
                    </Avatar>
                    <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                      2. Position Face
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Look directly at the camera and position your face in the frame
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Avatar sx={{ width: 48, height: 48, mx: 'auto', mb: 2, bgcolor: 'success.light' }}>
                      <Schedule />
                    </Avatar>
                    <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                      3. Capture Photo
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Take a clear photo when the system detects your face
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Avatar sx={{ width: 48, height: 48, mx: 'auto', mb: 2, bgcolor: 'primary.light' }}>
                      <History />
                    </Avatar>
                    <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                      4. Complete
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Your attendance will be recorded automatically
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AttendancePage;
