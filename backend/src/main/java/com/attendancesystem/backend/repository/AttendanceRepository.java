package com.attendancesystem.backend.repository;

import com.attendancesystem.backend.model.Attendance;
import com.attendancesystem.backend.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    
    List<Attendance> findByEmployee(Employee employee);
    
    List<Attendance> findByEmployeeOrderByCheckInTimeDesc(Employee employee);
    
    @Query("SELECT a FROM Attendance a WHERE a.employee.id = :employeeId ORDER BY a.checkInTime DESC")
    List<Attendance> findByEmployeeIdOrderByCheckInTimeDesc(@Param("employeeId") Long employeeId);
    
    @Query("SELECT a FROM Attendance a WHERE a.employee = :employee AND a.status = 'CHECKED_IN'")
    Optional<Attendance> findActiveAttendanceByEmployee(@Param("employee") Employee employee);
    
    @Query("SELECT a FROM Attendance a WHERE a.employee.id = :employeeId AND a.status = 'CHECKED_IN'")
    Optional<Attendance> findActiveAttendanceByEmployeeId(@Param("employeeId") Long employeeId);
    
    @Query("SELECT a FROM Attendance a WHERE a.checkInTime BETWEEN :startDate AND :endDate ORDER BY a.checkInTime DESC")
    List<Attendance> findByDateRange(@Param("startDate") LocalDateTime startDate, 
                                   @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT a FROM Attendance a WHERE a.employee.id = :employeeId AND " +
           "a.checkInTime BETWEEN :startDate AND :endDate ORDER BY a.checkInTime DESC")
    List<Attendance> findByEmployeeIdAndDateRange(@Param("employeeId") Long employeeId,
                                                @Param("startDate") LocalDateTime startDate,
                                                @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT a FROM Attendance a WHERE DATE(a.checkInTime) = DATE(:date)")
    List<Attendance> findByDate(@Param("date") LocalDateTime date);
    
    @Query("SELECT a FROM Attendance a WHERE a.employee.id = :employeeId AND DATE(a.checkInTime) = DATE(:date)")
    Optional<Attendance> findByEmployeeIdAndDate(@Param("employeeId") Long employeeId, 
                                               @Param("date") LocalDateTime date);
    
    @Query("SELECT SUM(a.workingHours) FROM Attendance a WHERE a.employee.id = :employeeId AND " +
           "a.checkInTime BETWEEN :startDate AND :endDate AND a.workingHours IS NOT NULL")
    Double getTotalWorkingHoursByEmployeeAndDateRange(@Param("employeeId") Long employeeId,
                                                    @Param("startDate") LocalDateTime startDate,
                                                    @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT AVG(a.workingHours) FROM Attendance a WHERE a.employee.id = :employeeId AND " +
           "a.checkInTime BETWEEN :startDate AND :endDate AND a.workingHours IS NOT NULL")
    Double getAverageWorkingHoursByEmployeeAndDateRange(@Param("employeeId") Long employeeId,
                                                      @Param("startDate") LocalDateTime startDate,
                                                      @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.employee.id = :employeeId AND " +
           "a.checkInTime BETWEEN :startDate AND :endDate")
    long countAttendanceByEmployeeAndDateRange(@Param("employeeId") Long employeeId,
                                             @Param("startDate") LocalDateTime startDate,
                                             @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT a FROM Attendance a ORDER BY a.checkInTime DESC")
    List<Attendance> findAllOrderByCheckInTimeDesc();
    
    @Query("SELECT a FROM Attendance a WHERE a.status = 'CHECKED_IN' ORDER BY a.checkInTime DESC")
    List<Attendance> findCurrentlyCheckedInEmployees();
}