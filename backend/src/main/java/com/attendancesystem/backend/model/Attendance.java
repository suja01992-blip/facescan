package com.attendancesystem.backend.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDateTime;
import java.time.Duration;

@Entity
@Table(name = "attendance")
public class Attendance {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    @JsonIgnore
    private Employee employee;
    
    @Column(name = "check_in_time")
    private LocalDateTime checkInTime;
    
    @Column(name = "check_out_time")
    private LocalDateTime checkOutTime;
    
    @Column(name = "check_in_location_lat")
    private Double checkInLocationLat;
    
    @Column(name = "check_in_location_lng")
    private Double checkInLocationLng;
    
    @Column(name = "check_out_location_lat")
    private Double checkOutLocationLat;
    
    @Column(name = "check_out_location_lng")
    private Double checkOutLocationLng;
    
    @Enumerated(EnumType.STRING)
    private AttendanceStatus status = AttendanceStatus.CHECKED_IN;
    
    @Column(name = "working_hours")
    private Double workingHours;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public Attendance() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    public Attendance(Employee employee, LocalDateTime checkInTime, Double lat, Double lng) {
        this();
        this.employee = employee;
        this.checkInTime = checkInTime;
        this.checkInLocationLat = lat;
        this.checkInLocationLng = lng;
        this.status = AttendanceStatus.CHECKED_IN;
    }
    
    // PreUpdate callback
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
        calculateWorkingHours();
    }
    
    // Calculate working hours when check out time is set
    public void calculateWorkingHours() {
        if (checkInTime != null && checkOutTime != null) {
            Duration duration = Duration.between(checkInTime, checkOutTime);
            this.workingHours = duration.toMinutes() / 60.0; // Convert to hours
        }
    }
    
    // Check out method
    public void checkOut(LocalDateTime checkOutTime, Double lat, Double lng) {
        this.checkOutTime = checkOutTime;
        this.checkOutLocationLat = lat;
        this.checkOutLocationLng = lng;
        this.status = AttendanceStatus.CHECKED_OUT;
        calculateWorkingHours();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Employee getEmployee() {
        return employee;
    }
    
    public void setEmployee(Employee employee) {
        this.employee = employee;
    }
    
    public Long getEmployeeId() {
        return employee != null ? employee.getId() : null;
    }
    
    public String getEmployeeName() {
        return employee != null ? employee.getFullName() : null;
    }
    
    public String getEmployeeEmail() {
        return employee != null ? employee.getEmail() : null;
    }
    
    public LocalDateTime getCheckInTime() {
        return checkInTime;
    }
    
    public void setCheckInTime(LocalDateTime checkInTime) {
        this.checkInTime = checkInTime;
    }
    
    public LocalDateTime getCheckOutTime() {
        return checkOutTime;
    }
    
    public void setCheckOutTime(LocalDateTime checkOutTime) {
        this.checkOutTime = checkOutTime;
        calculateWorkingHours();
    }
    
    public Double getCheckInLocationLat() {
        return checkInLocationLat;
    }
    
    public void setCheckInLocationLat(Double checkInLocationLat) {
        this.checkInLocationLat = checkInLocationLat;
    }
    
    public Double getCheckInLocationLng() {
        return checkInLocationLng;
    }
    
    public void setCheckInLocationLng(Double checkInLocationLng) {
        this.checkInLocationLng = checkInLocationLng;
    }
    
    public Double getCheckOutLocationLat() {
        return checkOutLocationLat;
    }
    
    public void setCheckOutLocationLat(Double checkOutLocationLat) {
        this.checkOutLocationLat = checkOutLocationLat;
    }
    
    public Double getCheckOutLocationLng() {
        return checkOutLocationLng;
    }
    
    public void setCheckOutLocationLng(Double checkOutLocationLng) {
        this.checkOutLocationLng = checkOutLocationLng;
    }
    
    public AttendanceStatus getStatus() {
        return status;
    }
    
    public void setStatus(AttendanceStatus status) {
        this.status = status;
    }
    
    public Double getWorkingHours() {
        return workingHours;
    }
    
    public void setWorkingHours(Double workingHours) {
        this.workingHours = workingHours;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public enum AttendanceStatus {
        CHECKED_IN, CHECKED_OUT
    }
}