# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**ROSAE Employee Attendance System** is a full-stack web application featuring facial recognition and location-based attendance tracking. The system combines Spring Boot backend with a modern React TypeScript frontend using Material-UI components and professional ROSAE branding.

## Architecture

### Backend (Spring Boot 3.1.5 + Java 17)
- **Location**: `backend/`
- **Main Class**: `com.attendancesystem.backend.EmployeeAttendanceApplication`
- **Database**: SQLite with JPA/Hibernate
- **Security**: JWT-based authentication with Spring Security
- **Key Features**: 
  - Facial recognition with OpenCV
  - Location verification
  - Role-based access control (ADMIN/EMPLOYEE)

**Package Structure**:
- `config/` - Security, database configuration
- `controller/` - REST API endpoints
- `model/` - JPA entities (Employee, Attendance)
- `service/` - Business logic layer
- `security/` - JWT utilities, authentication
- `repository/` - Data access layer

### Frontend (React 18 + TypeScript + Material-UI)
- **Location**: `frontend/src/`
- **Theme**: Custom ROSAE brand theme with professional rose/pink color palette
- **State Management**: React Context API for authentication
- **Key Features**:
  - Professional dashboard layouts
  - Facial recognition camera interface
  - Location-based check-in/out
  - Admin employee management
  - Responsive design with animations

**Component Structure**:
- `components/auth/` - Login and authentication
- `components/dashboard/` - Employee and Admin dashboards
- `components/attendance/` - Facial recognition attendance interface
- `components/layout/` - Navigation and layout components
- `components/admin/` - Employee management and reports
- `contexts/` - React Context providers
- `services/` - API client and service layers
- `theme/` - ROSAE brand theme configuration

## Development Commands

### Backend
```powershell
# Navigate to backend
cd backend

# Compile and run (requires Java 17 and Maven)
mvn clean compile
mvn spring-boot:run

# Run tests
mvn test

# Package for deployment
mvn clean package
```

### Frontend
```powershell
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Employee login with JWT token
- `POST /api/auth/logout` - Employee logout

### Attendance (Employee)
- `POST /api/attendance/check-in` - Check in with facial recognition and location
- `POST /api/attendance/check-out` - Check out with facial recognition and location
- `GET /api/attendance/history` - Get employee attendance history
- `GET /api/attendance/status` - Get current attendance status

### Admin Management
- `GET /api/admin/employees` - List all employees
- `POST /api/admin/employees` - Create new employee
- `PUT /api/admin/employees/{id}` - Update employee
- `DELETE /api/admin/employees/{id}` - Delete employee
- `GET /api/admin/attendance/all` - Get all attendance records
- `POST /api/admin/attendance/force-checkout/{id}` - Force checkout employee

## Key Configuration

### Database Configuration
- **File**: `backend/src/main/resources/application.properties`
- **Database**: SQLite (`attendance_system.db`)
- **Location Settings**: Configure office coordinates for location verification

### Frontend Environment
- **API Base URL**: `http://localhost:8080/api` (configurable via environment)
- **Proxy**: Configured in `package.json` for development

### Default Credentials
- **Admin Email**: `admin@company.com`
- **Admin Password**: `admin123`
- **Note**: Change default credentials in production

## ROSAE Brand Guidelines

### Color Palette
- **Primary**: Rose/pink gradient (`#f43f5e` to `#e11d48`)
- **Secondary**: Slate gray (`#64748b` to `#334155`)
- **Accent**: Orange (`#f97316` to `#ea580c`)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Headers**: 600-700 weight
- **Body**: 400-500 weight

### Component Styling
- **Border Radius**: 12px default, 8px for buttons, 16px for cards
- **Shadows**: Subtle elevation with professional depth
- **Animations**: Smooth 0.2-0.3s transitions

## Facial Recognition Implementation

### Current Implementation
- **Library**: OpenCV for Java (simplified approach)
- **Process**: Face detection → encoding → verification
- **Limitations**: Basic pixel-based comparison for demonstration

### Production Recommendations
- **FaceNet**: Deep learning-based face recognition
- **dlib**: C++ library with Python/Java bindings
- **Cloud Services**: Amazon Rekognition, Microsoft Face API
- **Security**: Encrypt face encodings, implement rate limiting

## Location Verification

### Configuration
```properties
# Office location coordinates
app.allowed-location.latitude=40.7128
app.allowed-location.longitude=-74.0060
app.location-tolerance=0.001
```

### Implementation
- **GPS Accuracy**: High accuracy mode enabled
- **Tolerance**: Configurable radius for office premises
- **Fallback**: Manual location override for admins

## Security Features

### Authentication
- **JWT Tokens**: 24-hour expiration
- **Password Hashing**: BCrypt with salt
- **Role-Based Access**: ADMIN and EMPLOYEE roles

### Data Protection
- **CORS**: Configured for frontend domain
- **Input Validation**: Server-side validation with Bean Validation
- **SQL Injection**: Protected via JPA parameterized queries

## Testing Strategy

### Backend Testing
```powershell
# Unit tests
mvn test

# Integration tests
mvn test -Dtest="*IntegrationTest"

# Test specific service
mvn test -Dtest="AttendanceServiceTest"
```

### Frontend Testing
```powershell
# Component tests
npm test

# Coverage report
npm test -- --coverage

# E2E tests (if configured)
npm run test:e2e
```

## Deployment Considerations

### Backend Deployment
- **Database**: SQLite for development, consider PostgreSQL/MySQL for production
- **File Storage**: Face images stored as base64 (consider cloud storage)
- **Environment**: Configure production JWT secret and database credentials

### Frontend Deployment
- **Build**: `npm run build` creates optimized production build
- **Static Hosting**: Compatible with Nginx, Apache, or cloud providers
- **Environment Variables**: Configure API base URL for production

### Production Checklist
- [ ] Change default admin credentials
- [ ] Configure production database
- [ ] Set secure JWT secret
- [ ] Enable HTTPS
- [ ] Configure proper CORS origins
- [ ] Set up backup strategy
- [ ] Implement monitoring and logging

## Performance Optimizations

### Backend
- **Connection Pooling**: Configured for database connections
- **Lazy Loading**: JPA relationships loaded on-demand
- **Caching**: Strategic caching of user sessions

### Frontend
- **Code Splitting**: React.lazy() for route-based splitting
- **Image Optimization**: Compressed face recognition images
- **Bundle Size**: Tree shaking enabled in production builds

## Troubleshooting

### Common Issues
1. **Backend won't start**: Check Java 17 installation and JAVA_HOME
2. **Frontend build fails**: Clear node_modules and reinstall dependencies
3. **Camera not working**: Ensure HTTPS in production, check browser permissions
4. **Location verification fails**: Check GPS permissions and office coordinates
5. **JWT errors**: Verify token expiration and secret configuration

### Development Tips
- **Hot Reload**: Both frontend and backend support hot reloading
- **Database Reset**: Delete `attendance_system.db` to reset data
- **CORS Issues**: Ensure frontend URL matches backend CORS configuration
- **Face Recognition**: Good lighting and clear face positioning improve accuracy

## Future Enhancements

### Planned Features
- [ ] Mobile app with React Native
- [ ] Advanced reporting and analytics
- [ ] Integration with payroll systems
- [ ] Multi-location support
- [ ] Biometric alternatives (fingerprint, iris)
- [ ] Real-time notifications
- [ ] Shift scheduling integration

### Technical Debt
- [ ] Migrate to production-grade face recognition
- [ ] Implement proper database migrations
- [ ] Add comprehensive error monitoring
- [ ] Enhance security with 2FA
- [ ] Optimize bundle size and loading performance