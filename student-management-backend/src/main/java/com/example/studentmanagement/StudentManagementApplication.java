package com.example.studentmanagement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Student Management Application - Main Entry Point
 * Spring Boot application for managing student records using JDBC and PostgreSQL.
 */
@SpringBootApplication
public class StudentManagementApplication {

    private static final Logger logger = LoggerFactory.getLogger(StudentManagementApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(StudentManagementApplication.class, args);
        logger.info("========================================");
        logger.info("Student Management Application Started!");
        logger.info("Server running on http://localhost:8080");
        logger.info("========================================");
    }
}
