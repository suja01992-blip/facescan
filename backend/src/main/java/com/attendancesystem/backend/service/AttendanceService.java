package com.attendancesystem.backend.service;

import com.attendancesystem.backend.model.Attendance;
import com.attendancesystem.backend.model.Employee;
import com.attendancesystem.backend.repository.AttendanceRepository;
import com.attendancesystem.backend.repository.EmployeeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class AttendanceService {

    private static final Logger logger = LoggerFactory.getLogger(AttendanceService.class);

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private LocationService locationService;

    @Autowired
    private FacialRecognitionService facialRecognitionService;

    /**
     * Process employee check-in with facial recognition and location verification
     */
    public Attendance checkIn(Long employeeId, String faceImage, double latitude, double longitude) {
        try {
            // Validate employee
            Employee employee = employeeRepository.findById(employeeId)
                    .orElseThrow(() -> new RuntimeException("Employee not found"));

            if (!employee.isActive()) {
                throw new RuntimeException("Employee account is disabled");
            }

            // Check if employee is already checked in today
            Optional<Attendance> existingAttendance = attendanceRepository
                    .findActiveAttendanceByEmployee(employee);
            
            if (existingAttendance.isPresent()) {
                throw new RuntimeException("Employee is already checked in. Please check out first.");
            }

            // Validate location
            if (!locationService.areCoordinatesValid(latitude, longitude)) {
                throw new RuntimeException("Invalid GPS coordinates provided");
            }

            if (!locationService.isLocationValid(latitude, longitude)) {
                double distance = locationService.getDistanceFromOffice(latitude, longitude);
                throw new RuntimeException(String.format(
                    "Location verification failed. You are %.2f km away from office. Please check in from office premises.", 
                    distance));
            }

            // Verify face if face encoding exists
            if (employee.getFaceEncoding() != null && !employee.getFaceEncoding().isEmpty()) {
                if (faceImage == null || faceImage.trim().isEmpty()) {
                    throw new RuntimeException("Face image is required for check-in");
                }

                boolean faceMatch = facialRecognitionService.verifyFace(faceImage, employee.getFaceEncoding());
                if (!faceMatch) {
                    throw new RuntimeException("Face verification failed. Please ensure your face is clearly visible.");
                }
            } else if (faceImage != null && !faceImage.trim().isEmpty()) {
                // First time check-in - store face encoding
                String faceEncoding = facialRecognitionService.extractFaceEncoding(faceImage);
                employee.setFaceEncoding(faceEncoding);
                employeeRepository.save(employee);
                logger.info("Face encoding stored for employee: {}", employee.getEmail());
            }

            // Create attendance record
            Attendance attendance = new Attendance(employee, LocalDateTime.now(), latitude, longitude);
            attendance = attendanceRepository.save(attendance);

            logger.info("Employee {} checked in successfully at {}", employee.getEmail(), attendance.getCheckInTime());
            return attendance;

        } catch (Exception e) {
            logger.error("Check-in failed for employee {}: {}", employeeId, e.getMessage());
            throw new RuntimeException("Check-in failed: " + e.getMessage());
        }
    }

    /**
     * Process employee check-out with facial recognition and location verification
     */
    public Attendance checkOut(Long employeeId, String faceImage, double latitude, double longitude) {
        try {
            // Validate employee
            Employee employee = employeeRepository.findById(employeeId)
                    .orElseThrow(() -> new RuntimeException("Employee not found"));

            // Find active attendance record
            Optional<Attendance> activeAttendance = attendanceRepository
                    .findActiveAttendanceByEmployee(employee);
            
            if (activeAttendance.isEmpty()) {
                throw new RuntimeException("No active check-in found. Please check in first.");
            }

            Attendance attendance = activeAttendance.get();

            // Validate location
            if (!locationService.areCoordinatesValid(latitude, longitude)) {
                throw new RuntimeException("Invalid GPS coordinates provided");
            }

            if (!locationService.isLocationValid(latitude, longitude)) {
                double distance = locationService.getDistanceFromOffice(latitude, longitude);
                throw new RuntimeException(String.format(
                    "Location verification failed. You are %.2f km away from office. Please check out from office premises.", 
                    distance));
            }

            // Verify face
            if (employee.getFaceEncoding() != null && !employee.getFaceEncoding().isEmpty()) {
                if (faceImage == null || faceImage.trim().isEmpty()) {
                    throw new RuntimeException("Face image is required for check-out");
                }

                boolean faceMatch = facialRecognitionService.verifyFace(faceImage, employee.getFaceEncoding());
                if (!faceMatch) {
                    throw new RuntimeException("Face verification failed. Please ensure your face is clearly visible.");
                }
            }

            // Update attendance record
            attendance.checkOut(LocalDateTime.now(), latitude, longitude);
            attendance = attendanceRepository.save(attendance);

            logger.info("Employee {} checked out successfully at {}", employee.getEmail(), attendance.getCheckOutTime());
            return attendance;

        } catch (Exception e) {
            logger.error("Check-out failed for employee {}: {}", employeeId, e.getMessage());
            throw new RuntimeException("Check-out failed: " + e.getMessage());
        }
    }

    /**
     * Get attendance history for an employee
     */
    public List<Attendance> getAttendanceHistory(Long employeeId, LocalDateTime startDate, LocalDateTime endDate) {
        if (startDate != null && endDate != null) {
            return attendanceRepository.findByEmployeeIdAndDateRange(employeeId, startDate, endDate);
        } else {
            return attendanceRepository.findByEmployeeIdOrderByCheckInTimeDesc(employeeId);
        }
    }

    /**
     * Get all attendance records (admin only)
     */
    public List<Attendance> getAllAttendanceRecords(LocalDateTime startDate, LocalDateTime endDate) {
        if (startDate != null && endDate != null) {
            return attendanceRepository.findByDateRange(startDate, endDate);
        } else {
            return attendanceRepository.findAllOrderByCheckInTimeDesc();
        }
    }

    /**
     * Get current attendance status for employee
     */
    public Optional<Attendance> getCurrentAttendanceStatus(Long employeeId) {
        return attendanceRepository.findActiveAttendanceByEmployeeId(employeeId);
    }

    /**
     * Get today's attendance for employee
     */
    public Optional<Attendance> getTodayAttendance(Long employeeId) {
        return attendanceRepository.findByEmployeeIdAndDate(employeeId, LocalDateTime.now());
    }

    /**
     * Calculate total working hours for employee in date range
     */
    public Double getTotalWorkingHours(Long employeeId, LocalDateTime startDate, LocalDateTime endDate) {
        Double total = attendanceRepository.getTotalWorkingHoursByEmployeeAndDateRange(employeeId, startDate, endDate);
        return total != null ? total : 0.0;
    }

    /**
     * Calculate average working hours for employee in date range
     */
    public Double getAverageWorkingHours(Long employeeId, LocalDateTime startDate, LocalDateTime endDate) {
        Double average = attendanceRepository.getAverageWorkingHoursByEmployeeAndDateRange(employeeId, startDate, endDate);
        return average != null ? average : 0.0;
    }

    /**
     * Count attendance days for employee in date range
     */
    public long getAttendanceDaysCount(Long employeeId, LocalDateTime startDate, LocalDateTime endDate) {
        return attendanceRepository.countAttendanceByEmployeeAndDateRange(employeeId, startDate, endDate);
    }

    /**
     * Get currently checked-in employees
     */
    public List<Attendance> getCurrentlyCheckedInEmployees() {
        return attendanceRepository.findCurrentlyCheckedInEmployees();
    }

    /**
     * Force check-out for employee (admin only)
     */
    public Attendance forceCheckOut(Long employeeId, String reason) {
        try {
            Optional<Attendance> activeAttendance = attendanceRepository.findActiveAttendanceByEmployeeId(employeeId);
            
            if (activeAttendance.isEmpty()) {
                throw new RuntimeException("No active check-in found for this employee");
            }

            Attendance attendance = activeAttendance.get();
            
            // Use last known location or office location for forced check-out
            double lat = attendance.getCheckInLocationLat() != null ? attendance.getCheckInLocationLat() : 40.7128;
            double lng = attendance.getCheckInLocationLng() != null ? attendance.getCheckInLocationLng() : -74.0060;
            
            attendance.checkOut(LocalDateTime.now(), lat, lng);
            attendance = attendanceRepository.save(attendance);

            logger.info("Admin forced check-out for employee ID: {} - Reason: {}", employeeId, reason);
            return attendance;

        } catch (Exception e) {
            logger.error("Force check-out failed for employee {}: {}", employeeId, e.getMessage());
            throw new RuntimeException("Force check-out failed: " + e.getMessage());
        }
    }
}