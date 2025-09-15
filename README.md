# Full-Stack Employee Attendance System

A comprehensive web-based attendance system for companies with facial recognition and location verification features.

## 🚀 Features

### Core Features
- **Facial Recognition**: Employees check in/out using facial recognition technology
- **Location Verification**: GPS-based location verification to ensure employees are at office premises
- **Real-time Attendance Tracking**: Live monitoring of check-in/check-out status
- **Working Hours Calculation**: Automatic calculation of daily working hours
- **Role-based Access Control**: Admin and Employee roles with appropriate permissions

### Admin Features
- **Employee Management**: Create, update, delete, and manage employee credentials
- **Attendance Reports**: View comprehensive attendance history and statistics
- **Dashboard**: Real-time overview of attendance data
- **Force Check-out**: Admin can force check-out employees when needed

### Employee Features
- **Easy Check-in/Check-out**: Simple facial recognition-based attendance marking
- **Personal Attendance History**: View own attendance records and working hours
- **Real-time Status**: See current attendance status

## 🛠 Technology Stack

### Backend
- **Java 17** with **Spring Boot 3.1.5**
- **Spring Security** with JWT authentication
- **Spring Data JPA** with Hibernate
- **SQLite** database for data storage
- **OpenCV** for facial recognition processing

### Frontend
- **React 18** with TypeScript
- **Material-UI (MUI)** for modern UI components
- **React Router** for navigation
- **Axios** for API communication
- **React Webcam** for camera integration

### Additional Libraries
- **JWT** for secure authentication
- **BCrypt** for password hashing
- **Apache Commons** for utility functions

## 📁 Project Structure

```
employee-attendance-system/
├── backend/
│   ├── src/main/java/com/attendancesystem/backend/
│   │   ├── config/           # Configuration classes
│   │   ├── controller/       # REST API controllers
│   │   ├── dto/              # Data Transfer Objects
│   │   ├── model/            # JPA entities
│   │   ├── repository/       # Data access layer
│   │   ├── security/         # Security configurations
│   │   └── service/          # Business logic layer
│   ├── src/main/resources/   # Application properties
│   └── pom.xml              # Maven dependencies
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service calls
│   │   └── utils/           # Utility functions
│   ├── public/              # Static assets
│   └── package.json         # NPM dependencies
└── README.md
```

## 🔧 Setup Instructions

### Prerequisites
- **Java 17** or higher
- **Node.js 16** or higher
- **Maven 3.6** or higher
- **Git**

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies and compile:
   ```bash
   mvn clean compile
   ```

3. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```

The backend server will start on `http://localhost:8080`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```

The frontend will start on `http://localhost:3000`

## 🔑 Default Admin Account

The system automatically creates a default admin account on first run:
- **Email**: `admin@company.com`
- **Password**: `admin123`

**Important**: Change the default admin password after first login for security.

## 📊 Database

The application uses **SQLite** database which will be automatically created as `attendance_system.db` in the backend directory when the application starts.

### Database Tables
- **employees**: Employee information and credentials
- **attendance**: Check-in/check-out records with timestamps and locations

## 🌍 Location Configuration

The office location is configured in `application.properties`:
```properties
app.allowed-location.latitude=40.7128
app.allowed-location.longitude=-74.0060
app.location-tolerance=0.001
```

Update these coordinates to match your office location.

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Encryption**: BCrypt hashing for password security
- **Role-based Authorization**: Different access levels for Admin and Employee
- **CORS Configuration**: Properly configured for frontend-backend communication

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/login` - Employee login
- `POST /api/auth/logout` - Employee logout

### Attendance
- `POST /api/attendance/check-in` - Check in with facial recognition
- `POST /api/attendance/check-out` - Check out with facial recognition
- `GET /api/attendance/history` - Get attendance history
- `GET /api/attendance/status` - Get current attendance status

### Admin Endpoints
- `GET /api/admin/employees` - Get all employees
- `POST /api/admin/employees` - Create new employee
- `PUT /api/admin/employees/{id}` - Update employee
- `DELETE /api/admin/employees/{id}` - Delete employee
- `GET /api/admin/attendance/all` - Get all attendance records

## 🚀 Performance Optimizations

The system includes several performance enhancements:
- **Lazy Loading**: Database relationships are loaded on-demand
- **Connection Pooling**: Optimized database connections
- **Caching**: Strategic caching of frequently accessed data
- **Compressed Images**: Facial recognition images are processed and compressed
- **Efficient Queries**: Optimized JPA queries for better performance

## 🔄 Facial Recognition

The system uses a simplified facial recognition approach suitable for demonstration:
- **Face Detection**: Uses OpenCV Haar cascades for face detection
- **Face Encoding**: Generates simple pixel-based encodings
- **Face Verification**: Compares face encodings with configurable similarity threshold

**Note**: For production use, consider integrating advanced face recognition libraries like:
- **FaceNet**
- **dlib**
- **Amazon Rekognition**
- **Microsoft Face API**

## 📱 Mobile Responsiveness

The frontend is designed to be responsive and works well on:
- **Desktop browsers**
- **Tablet devices**
- **Mobile phones**

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**:
   - Backend: Change `server.port` in `application.properties`
   - Frontend: Use `PORT=3001 npm start`

2. **Database Connection Issues**:
   - Ensure SQLite permissions are correct
   - Check if `attendance_system.db` is created in backend directory

3. **Facial Recognition Not Working**:
   - Ensure camera permissions are granted in browser
   - Check OpenCV library initialization in backend logs

4. **CORS Issues**:
   - Verify CORS configuration in `EmployeeAttendanceApplication.java`
   - Check that frontend URL matches allowed origins

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please create an issue in the repository or contact the development team.

---

**Built with ❤️ for efficient employee attendance management**