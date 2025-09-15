import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import theme from './theme';
import LoginPage from './components/auth/LoginPage';
import DashboardLayout from './components/layout/DashboardLayout';
import EmployeeDashboard from './components/dashboard/EmployeeDashboard';
import AdminDashboard from './components/dashboard/AdminDashboard';
import AttendancePage from './components/attendance/AttendancePage';
import EmployeeManagement from './components/admin/EmployeeManagement';
import AttendanceReports from './components/admin/AttendanceReports';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({ 
  children, 
  adminOnly = false 
}) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (adminOnly && user?.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Login Route */}
              <Route path="/login" element={<LoginPage />} />
              
              {/* Dashboard Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Routes>
                      <Route index element={<DashboardRouter />} />
                      <Route path="attendance" element={<AttendancePage />} />
                      
                      {/* Admin Routes */}
                      <Route path="admin/employees" element={
                        <ProtectedRoute adminOnly>
                          <EmployeeManagement />
                        </ProtectedRoute>
                      } />
                      <Route path="admin/reports" element={
                        <ProtectedRoute adminOnly>
                          <AttendanceReports />
                        </ProtectedRoute>
                      } />
                    </Routes>
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              
              {/* Redirect root to dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* 404 fallback */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </Router>
        
        {/* Toast Notifications */}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          toastStyle={{
            borderRadius: '12px',
            fontSize: '14px',
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  );
};

// Component to route to appropriate dashboard based on user role
const DashboardRouter: React.FC = () => {
  const { user } = useAuth();
  
  if (user?.role === 'ADMIN') {
    return <AdminDashboard />;
  }
  
  return <EmployeeDashboard />;
};

export default App;