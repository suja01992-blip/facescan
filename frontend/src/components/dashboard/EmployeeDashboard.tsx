import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Chip,
  LinearProgress,
  IconButton,
  Paper,
  Divider,
  Stack,
  Alert,
} from '@mui/material';
import {
  Schedule,
  CheckCircle,
  Cancel,
  AccessTime,
  TrendingUp,
  CalendarToday,
  LocationOn,
  CameraAlt,
  PlayArrow,
  Stop,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { brandColors } from '../../theme';

interface AttendanceStats {
  totalDays: number;
  presentDays: number;
  totalHours: number;
  avgHours: number;
  currentStatus: 'CHECKED_IN' | 'CHECKED_OUT' | null;
  checkInTime?: string;
  checkOutTime?: string;
}

const EmployeeDashboard: React.FC = () => {
  const { user } = useAuth();
  const [attendanceStats, setAttendanceStats] = useState<AttendanceStats>({
    totalDays: 22,
    presentDays: 20,
    totalHours: 176,
    avgHours: 8.2,
    currentStatus: 'CHECKED_OUT',
  });

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const attendancePercentage = (attendanceStats.presentDays / attendanceStats.totalDays) * 100;
  const isCheckedIn = attendanceStats.currentStatus === 'CHECKED_IN';

  const handleCheckInOut = () => {
    // This will be implemented with actual API calls
    console.log(isCheckedIn ? 'Checking out...' : 'Checking in...');
  };

  return (
    <Box>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
          Welcome back, {user?.firstName}! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {currentTime.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })} • {currentTime.toLocaleTimeString()}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Check In/Out Card */}
        <Grid item xs={12} lg={8}>
          <Card 
            sx={{ 
              height: '100%',
              background: `linear-gradient(135deg, ${brandColors.primary[50]} 0%, ${brandColors.primary[100]} 100%)`,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background: `linear-gradient(90deg, ${brandColors.primary[500]} 0%, ${brandColors.primary[600]} 100%)`,
              }
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Quick Check-In/Out
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Chip
                      label={isCheckedIn ? 'Checked In' : 'Checked Out'}
                      color={isCheckedIn ? 'success' : 'default'}
                      icon={isCheckedIn ? <CheckCircle /> : <Cancel />}
                      sx={{ fontWeight: 600 }}
                    />
                    {isCheckedIn && (
                      <Typography variant="body2" color="text.secondary">
                        since 9:15 AM
                      </Typography>
                    )}
                  </Box>
                </Box>
                
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleCheckInOut}
                  startIcon={isCheckedIn ? <Stop /> : <PlayArrow />}
                  sx={{
                    minWidth: 140,
                    height: 48,
                    borderRadius: 3,
                    textTransform: 'none',
                    fontWeight: 600,
                    background: isCheckedIn 
                      ? `linear-gradient(135deg, ${brandColors.accent[500]} 0%, ${brandColors.accent[600]} 100%)`
                      : `linear-gradient(135deg, ${brandColors.primary[500]} 0%, ${brandColors.primary[600]} 100%)`,
                    '&:hover': {
                      background: isCheckedIn 
                        ? `linear-gradient(135deg, ${brandColors.accent[600]} 0%, ${brandColors.accent[700]} 100%)`
                        : `linear-gradient(135deg, ${brandColors.primary[600]} 0%, ${brandColors.primary[700]} 100%)`,
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {isCheckedIn ? 'Check Out' : 'Check In'}
                </Button>
              </Box>

              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  Facial recognition and location verification will be used for attendance.
                </Typography>
              </Alert>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Paper sx={{ p: 2, backgroundColor: 'background.paper', borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: brandColors.primary[100], color: brandColors.primary[700] }}>
                        <AccessTime />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Today's Hours
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {isCheckedIn ? '6h 45m' : '8h 15m'}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Paper sx={{ p: 2, backgroundColor: 'background.paper', borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: brandColors.secondary[100], color: brandColors.secondary[700] }}>
                        <LocationOn />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Location Status
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                          Office Premises
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Attendance Status Card */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar sx={{ bgcolor: brandColors.primary[100], color: brandColors.primary[700] }}>
                  <Schedule />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    This Month
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Attendance Overview
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Attendance Rate
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {attendancePercentage.toFixed(1)}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={attendancePercentage} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    backgroundColor: brandColors.primary[100],
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                      background: `linear-gradient(90deg, ${brandColors.primary[500]} 0%, ${brandColors.primary[600]} 100%)`,
                    }
                  }}
                />
              </Box>

              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Present Days</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{attendanceStats.presentDays}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Total Days</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{attendanceStats.totalDays}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Total Hours</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{attendanceStats.totalHours}h</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Avg Hours/Day</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{attendanceStats.avgHours}h</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: brandColors.secondary[100], color: brandColors.secondary[700] }}>
                    <CalendarToday />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Recent Activity
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Your attendance history for this week
                    </Typography>
                  </Box>
                </Box>
                <Button 
                  variant="outlined" 
                  size="small"
                  sx={{ borderRadius: 2 }}
                >
                  View All
                </Button>
              </Box>

              <Stack spacing={2}>
                {[
                  { date: 'Today', checkIn: '9:15 AM', checkOut: isCheckedIn ? 'Working...' : '6:30 PM', hours: isCheckedIn ? '6h 45m' : '8h 15m', status: isCheckedIn ? 'active' : 'completed' },
                  { date: 'Yesterday', checkIn: '9:05 AM', checkOut: '6:25 PM', hours: '8h 20m', status: 'completed' },
                  { date: 'Dec 12', checkIn: '8:55 AM', checkOut: '6:35 PM', hours: '8h 40m', status: 'completed' },
                  { date: 'Dec 11', checkIn: '9:10 AM', checkOut: '6:15 PM', hours: '8h 05m', status: 'completed' },
                ].map((record, index) => (
                  <Paper key={index} sx={{ p: 2, backgroundColor: 'background.default' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, minWidth: 80 }}>
                          {record.date}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            {record.checkIn} - {record.checkOut}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {record.hours}
                        </Typography>
                        <Chip
                          label={record.status === 'active' ? 'Active' : 'Completed'}
                          size="small"
                          color={record.status === 'active' ? 'success' : 'default'}
                          sx={{ minWidth: 80 }}
                        />
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EmployeeDashboard;
