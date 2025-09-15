package com.attendancesystem.backend.service;

import com.attendancesystem.backend.model.Employee;
import com.attendancesystem.backend.repository.EmployeeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class EmployeeService {

    private static final Logger logger = LoggerFactory.getLogger(EmployeeService.class);

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Create a new employee
     */
    public Employee createEmployee(Employee employee) {
        try {
            // Check if email already exists
            if (employeeRepository.existsByEmail(employee.getEmail())) {
                throw new RuntimeException("Employee with this email already exists");
            }

            // Encode password
            employee.setPassword(passwordEncoder.encode(employee.getPassword()));
            
            // Set default values
            employee.setActive(true);
            employee.setCreatedAt(LocalDateTime.now());
            employee.setUpdatedAt(LocalDateTime.now());

            Employee savedEmployee = employeeRepository.save(employee);
            logger.info("Employee created successfully: {}", savedEmployee.getEmail());
            return savedEmployee;

        } catch (Exception e) {
            logger.error("Failed to create employee: {}", e.getMessage());
            throw new RuntimeException("Failed to create employee: " + e.getMessage());
        }
    }

    /**
     * Update an existing employee
     */
    public Employee updateEmployee(Long id, Employee updatedEmployee) {
        try {
            Employee existingEmployee = employeeRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Employee not found"));

            // Check if email is being changed and if it already exists
            if (!existingEmployee.getEmail().equals(updatedEmployee.getEmail()) && 
                employeeRepository.existsByEmail(updatedEmployee.getEmail())) {
                throw new RuntimeException("Employee with this email already exists");
            }

            // Update fields
            existingEmployee.setEmail(updatedEmployee.getEmail());
            existingEmployee.setFirstName(updatedEmployee.getFirstName());
            existingEmployee.setLastName(updatedEmployee.getLastName());
            existingEmployee.setRole(updatedEmployee.getRole());
            existingEmployee.setUpdatedAt(LocalDateTime.now());

            // Only update password if provided
            if (updatedEmployee.getPassword() != null && !updatedEmployee.getPassword().isEmpty()) {
                existingEmployee.setPassword(passwordEncoder.encode(updatedEmployee.getPassword()));
            }

            Employee savedEmployee = employeeRepository.save(existingEmployee);
            logger.info("Employee updated successfully: {}", savedEmployee.getEmail());
            return savedEmployee;

        } catch (Exception e) {
            logger.error("Failed to update employee {}: {}", id, e.getMessage());
            throw new RuntimeException("Failed to update employee: " + e.getMessage());
        }
    }

    /**
     * Get employee by ID
     */
    public Optional<Employee> getEmployeeById(Long id) {
        return employeeRepository.findById(id);
    }

    /**
     * Get employee by email
     */
    public Optional<Employee> getEmployeeByEmail(String email) {
        return employeeRepository.findByEmail(email);
    }

    /**
     * Get all active employees
     */
    public List<Employee> getAllActiveEmployees() {
        return employeeRepository.findByIsActive(true);
    }

    /**
     * Get all employees (including inactive)
     */
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    /**
     * Deactivate employee (soft delete)
     */
    public Employee deactivateEmployee(Long id) {
        try {
            Employee employee = employeeRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Employee not found"));

            employee.setActive(false);
            employee.setUpdatedAt(LocalDateTime.now());

            Employee savedEmployee = employeeRepository.save(employee);
            logger.info("Employee deactivated: {}", savedEmployee.getEmail());
            return savedEmployee;

        } catch (Exception e) {
            logger.error("Failed to deactivate employee {}: {}", id, e.getMessage());
            throw new RuntimeException("Failed to deactivate employee: " + e.getMessage());
        }
    }

    /**
     * Activate employee
     */
    public Employee activateEmployee(Long id) {
        try {
            Employee employee = employeeRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Employee not found"));

            employee.setActive(true);
            employee.setUpdatedAt(LocalDateTime.now());

            Employee savedEmployee = employeeRepository.save(employee);
            logger.info("Employee activated: {}", savedEmployee.getEmail());
            return savedEmployee;

        } catch (Exception e) {
            logger.error("Failed to activate employee {}: {}", id, e.getMessage());
            throw new RuntimeException("Failed to activate employee: " + e.getMessage());
        }
    }

    /**
     * Delete employee permanently
     */
    public void deleteEmployee(Long id) {
        try {
            Employee employee = employeeRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Employee not found"));

            employeeRepository.delete(employee);
            logger.info("Employee deleted permanently: {}", employee.getEmail());

        } catch (Exception e) {
            logger.error("Failed to delete employee {}: {}", id, e.getMessage());
            throw new RuntimeException("Failed to delete employee: " + e.getMessage());
        }
    }

    /**
     * Search employees by name
     */
    public List<Employee> searchEmployeesByName(String name) {
        return employeeRepository.findByNameContainingIgnoreCase(name);
    }

    /**
     * Get employees by role
     */
    public List<Employee> getEmployeesByRole(Employee.Role role) {
        return employeeRepository.findByRole(role);
    }

    /**
     * Get active employees count
     */
    public long getActiveEmployeesCount() {
        return employeeRepository.countActiveEmployees();
    }

    /**
     * Update employee face encoding
     */
    public Employee updateFaceEncoding(Long id, String faceEncoding) {
        try {
            Employee employee = employeeRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Employee not found"));

            employee.setFaceEncoding(faceEncoding);
            employee.setUpdatedAt(LocalDateTime.now());

            Employee savedEmployee = employeeRepository.save(employee);
            logger.info("Face encoding updated for employee: {}", savedEmployee.getEmail());
            return savedEmployee;

        } catch (Exception e) {
            logger.error("Failed to update face encoding for employee {}: {}", id, e.getMessage());
            throw new RuntimeException("Failed to update face encoding: " + e.getMessage());
        }
    }

    /**
     * Reset employee password
     */
    public Employee resetPassword(Long id, String newPassword) {
        try {
            Employee employee = employeeRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Employee not found"));

            employee.setPassword(passwordEncoder.encode(newPassword));
            employee.setUpdatedAt(LocalDateTime.now());

            Employee savedEmployee = employeeRepository.save(employee);
            logger.info("Password reset for employee: {}", savedEmployee.getEmail());
            return savedEmployee;

        } catch (Exception e) {
            logger.error("Failed to reset password for employee {}: {}", id, e.getMessage());
            throw new RuntimeException("Failed to reset password: " + e.getMessage());
        }
    }

    /**
     * Create default admin user if none exists
     */
    public void createDefaultAdminIfNotExists() {
        List<Employee> admins = employeeRepository.findActiveAdmins();
        
        if (admins.isEmpty()) {
            Employee admin = new Employee();
            admin.setEmail("admin@company.com");
            admin.setFirstName("System");
            admin.setLastName("Administrator");
            admin.setRole(Employee.Role.ADMIN);
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setActive(true);
            admin.setCreatedAt(LocalDateTime.now());
            admin.setUpdatedAt(LocalDateTime.now());

            employeeRepository.save(admin);
            logger.info("Default admin user created: admin@company.com");
        }
    }
}