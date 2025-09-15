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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  IconButton,
  Badge,
} from '@mui/material';
import {
  People,
  Schedule,
  TrendingUp,
  Warning,
  CheckCircle,
  Cancel,
  MoreVert,
  Visibility,
  Edit,
  PersonAdd,
  Assessment,
  AccessTime,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { brandColors } from '../../theme';

interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  presentToday: number;
  avgAttendanceRate: number;
  totalHoursToday: number;
}

interface RecentActivity {
  id: string;
  employeeName: string;
  action: 'check_in' | 'check_out';
  time: string;
  location: string;
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalEmployees: 45,
    activeEmployees: 42,
    presentToday: 38,
    avgAttendanceRate: 89.5,
    totalHoursToday: 304,
  });

  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([
    { id: '1', employeeName: 'Alice Johnson', action: 'check_in', time: '9:15 AM', location: 'Office' },
    { id: '2', employeeName: 'Bob Smith', action: 'check_out', time: '6:30 PM', location: 'Office' },
    { id: '3', employeeName: 'Carol Davis', action: 'check_in', time: '8:45 AM', location: 'Office' },
    { id: '4', employeeName: 'David Wilson', action: 'check_out', time: '5:45 PM', location: 'Office' },
  ]);

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const attendanceRate = (dashboardStats.presentToday / dashboardStats.activeEmployees) * 100;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
          Admin Dashboard 📊
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back, {user?.firstName}! Here's what's happening today.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {currentTime.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })} • {currentTime.toLocaleTimeString()}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} lg={3}>
          <Card
            sx={{
              background: `linear-gradient(135deg, ${brandColors.primary[500]} 0%, ${brandColors.primary[600]} 100%)`,
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: -50,
                right: -50,
                width: 100,
                height: 100,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
              }
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                    Total Employees
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {dashboardStats.totalEmployees}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }}>
                  <People />
                </Avatar>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
                {dashboardStats.activeEmployees} active
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <Card
            sx={{
              background: `linear-gradient(135deg, ${brandColors.accent[500]} 0%, ${brandColors.accent[600]} 100%)`,
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                    Present Today
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {dashboardStats.presentToday}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }}>
                  <CheckCircle />
                </Avatar>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
                {attendanceRate.toFixed(1)}% attendance rate
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Avg Attendance
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    {dashboardStats.avgAttendanceRate}%
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: brandColors.secondary[100], color: brandColors.secondary[700] }}>
                  <TrendingUp />
                </Avatar>
              </Box>
              <Box sx={{ mt: 2 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={dashboardStats.avgAttendanceRate} 
                  sx={{ 
                    height: 6, 
                    borderRadius: 3,
                    backgroundColor: brandColors.secondary[100],
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 3,
                      background: `linear-gradient(90deg, ${brandColors.secondary[500]} 0%, ${brandColors.secondary[600]} 100%)`,
                    }
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Total Hours Today
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    {dashboardStats.totalHoursToday}h
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: brandColors.primary[100], color: brandColors.primary[700] }}>
                  <AccessTime />
                </Avatar>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Across all employees
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: brandColors.primary[100], color: brandColors.primary[700] }}>
                    <Schedule />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Recent Activity
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Latest check-ins and check-outs
                    </Typography>
                  </Box>
                </Box>
                <Button variant="outlined" size="small" sx={{ borderRadius: 2 }}>
                  View All
                </Button>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Employee</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Time</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Location</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentActivities.map((activity) => (
                      <TableRow key={activity.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ width: 32, height: 32, fontSize: '0.875rem' }}>
                              {activity.employeeName.charAt(0)}
                            </Avatar>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {activity.employeeName}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={activity.action === 'check_in' ? 'Check In' : 'Check Out'}
                            size="small"
                            color={activity.action === 'check_in' ? 'success' : 'default'}
                            icon={activity.action === 'check_in' ? <CheckCircle /> : <Cancel />}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{activity.time}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {activity.location}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <IconButton size="small">
                            <Visibility fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar sx={{ bgcolor: brandColors.accent[100], color: brandColors.accent[700] }}>
                  <Assessment />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Quick Actions
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Manage your team efficiently
                  </Typography>
                </Box>
              </Box>

              <Stack spacing={2}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<PersonAdd />}
                  sx={{
                    justifyContent: 'flex-start',
                    py: 1.5,
                    textTransform: 'none',
                    borderRadius: 2,
                  }}
                >
                  Add New Employee
                </Button>
                
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Assessment />}
                  sx={{
                    justifyContent: 'flex-start',
                    py: 1.5,
                    textTransform: 'none',
                    borderRadius: 2,
                  }}
                >
                  Generate Report
                </Button>
                
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Edit />}
                  sx={{
                    justifyContent: 'flex-start',
                    py: 1.5,
                    textTransform: 'none',
                    borderRadius: 2,
                  }}
                >
                  Manage Employees
                </Button>
                
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Warning />}
                  sx={{
                    justifyContent: 'flex-start',
                    py: 1.5,
                    textTransform: 'none',
                    borderRadius: 2,
                    color: 'warning.main',
                    borderColor: 'warning.main',
                    '&:hover': {
                      borderColor: 'warning.dark',
                      backgroundColor: 'warning.light',
                    }
                  }}
                >
                  <Badge badgeContent={2} color="error" sx={{ width: '100%' }}>
                    View Alerts
                  </Badge>
                </Button>
              </Stack>

              {/* System Status */}
              <Box sx={{ mt: 4, p: 2, bgcolor: 'success.light', borderRadius: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.dark', mb: 1 }}>
                  System Status
                </Typography>
                <Typography variant="body2" sx={{ color: 'success.dark' }}>
                  All systems operational • Last backup: 2 hours ago
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
