package com.attendancesystem.backend.repository;

import com.attendancesystem.backend.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    
    Optional<Employee> findByEmail(String email);
    
    Optional<Employee> findByEmailAndIsActive(String email, boolean isActive);
    
    List<Employee> findByIsActive(boolean isActive);
    
    List<Employee> findByRole(Employee.Role role);
    
    boolean existsByEmail(String email);
    
    @Query("SELECT e FROM Employee e WHERE e.isActive = true AND e.role = 'EMPLOYEE'")
    List<Employee> findActiveEmployees();
    
    @Query("SELECT e FROM Employee e WHERE e.isActive = true AND e.role = 'ADMIN'")
    List<Employee> findActiveAdmins();
    
    @Query("SELECT e FROM Employee e WHERE e.faceEncoding IS NOT NULL AND e.isActive = true")
    List<Employee> findEmployeesWithFaceEncoding();
    
    @Query("SELECT COUNT(e) FROM Employee e WHERE e.isActive = true")
    long countActiveEmployees();
    
    @Query("SELECT e FROM Employee e WHERE LOWER(e.firstName) LIKE LOWER(CONCAT('%', :name, '%')) " +
           "OR LOWER(e.lastName) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Employee> findByNameContainingIgnoreCase(@Param("name") String name);
}