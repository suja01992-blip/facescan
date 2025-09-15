package com.attendancesystem.backend.service;

import com.attendancesystem.backend.model.Employee;
import com.attendancesystem.backend.repository.EmployeeRepository;
import com.attendancesystem.backend.security.EmployeeUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class EmployeeDetailsService implements UserDetailsService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Employee employee = employeeRepository.findByEmailAndIsActive(email, true)
                .orElseThrow(() -> new UsernameNotFoundException("Employee not found with email: " + email));

        return new EmployeeUserDetails(employee);
    }

    public UserDetails loadUserByEmployeeId(Long employeeId) throws UsernameNotFoundException {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new UsernameNotFoundException("Employee not found with ID: " + employeeId));

        if (!employee.isActive()) {
            throw new UsernameNotFoundException("Employee account is disabled");
        }

        return new EmployeeUserDetails(employee);
    }
}