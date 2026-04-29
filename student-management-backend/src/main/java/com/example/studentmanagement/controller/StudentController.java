package com.example.studentmanagement.controller;

import com.example.studentmanagement.model.Student;
import com.example.studentmanagement.service.StudentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

/**
 * StudentController - REST API Layer
 * Handles all HTTP requests related to student management.
 * Implements CRUD operations (Create, Read, Update, Delete).
 */
@RestController
@RequestMapping("/students")
@CrossOrigin(origins = "http://localhost:3000") // Enable CORS for React frontend
public class StudentController {

    private static final Logger logger = LoggerFactory.getLogger(StudentController.class);

    @Autowired
    private StudentService studentService;

    /**
     * GET /students
     * Retrieve all students
     * 
     * @return ResponseEntity containing list of all students
     */
    @GetMapping
    public ResponseEntity<List<Student>> getAllStudents() {
        logger.info("GET /students - Fetching all students");
        
        try {
            List<Student> students = studentService.getAllStudents();
            return ResponseEntity.ok(students);
        } catch (Exception e) {
            logger.error("Error fetching all students", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /students/{id}
     * Retrieve a specific student by ID
     * 
     * @param id Student ID
     * @return ResponseEntity containing the student or 404 if not found
     */
    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable Integer id) {
        logger.info("GET /students/{} - Fetching student by ID", id);
        
        try {
            Optional<Student> student = studentService.getStudentById(id);
            
            if (student.isPresent()) {
                return ResponseEntity.ok(student.get());
            } else {
                logger.warn("Student not found with ID: {}", id);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Error fetching student with ID: {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * POST /students
     * Create a new student
     * 
     * @param student Student object to create
     * @return ResponseEntity containing the created student with generated ID
     */
    @PostMapping
    public ResponseEntity<?> createStudent(@RequestBody Student student) {
        logger.info("POST /students - Creating new student");
        
        try {
            // Validate input
            if (student.getName() == null || student.getName().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body("Student name is required");
            }
            
            if (student.getEmail() == null || student.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body("Student email is required");
            }
            
            if (student.getCourse() == null || student.getCourse().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body("Student course is required");
            }
            
            Student createdStudent = studentService.createStudent(student);
            logger.info("Student created successfully with ID: {}", createdStudent.getId());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(createdStudent);
        } catch (IllegalArgumentException e) {
            logger.warn("Validation error while creating student: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            logger.error("Error creating student", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error creating student");
        }
    }

    /**
     * PUT /students/{id}
     * Update an existing student
     * 
     * @param id Student ID to update
     * @param student Updated student data
     * @return ResponseEntity containing the updated student or appropriate error response
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateStudent(@PathVariable Integer id, @RequestBody Student student) {
        logger.info("PUT /students/{} - Updating student", id);
        
        try {
            // Validate input
            if (student.getName() == null || student.getName().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body("Student name is required");
            }
            
            if (student.getEmail() == null || student.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body("Student email is required");
            }
            
            if (student.getCourse() == null || student.getCourse().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body("Student course is required");
            }
            
            Student updatedStudent = studentService.updateStudent(id, student);
            logger.info("Student updated successfully with ID: {}", id);
            
            return ResponseEntity.ok(updatedStudent);
        } catch (IllegalArgumentException e) {
            logger.warn("Error updating student with ID: {} - {}", id, e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.error("Error updating student with ID: {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error updating student");
        }
    }

    /**
     * DELETE /students/{id}
     * Delete a student by ID
     * 
     * @param id Student ID to delete
     * @return ResponseEntity with success message or 404 if not found
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStudent(@PathVariable Integer id) {
        logger.info("DELETE /students/{} - Deleting student", id);
        
        try {
            boolean deleted = studentService.deleteStudent(id);
            
            if (deleted) {
                logger.info("Student deleted successfully with ID: {}", id);
                return ResponseEntity.ok(new ApiResponse("Student deleted successfully", true));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (IllegalArgumentException e) {
            logger.warn("Student not found with ID: {}", id);
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.error("Error deleting student with ID: {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse("Error deleting student", false));
        }
    }

    /**
     * GET /students/count
     * Get total number of students
     * 
     * @return ResponseEntity containing the total count
     */
    @GetMapping("/count")
    public ResponseEntity<Long> getStudentCount() {
        logger.info("GET /students/count - Getting total student count");
        
        try {
            long count = studentService.getTotalStudentCount();
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            logger.error("Error getting student count", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Simple API Response class for error/success messages
     */
    public static class ApiResponse {
        private String message;
        private boolean success;

        public ApiResponse(String message, boolean success) {
            this.message = message;
            this.success = success;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public boolean isSuccess() {
            return success;
        }

        public void setSuccess(boolean success) {
            this.success = success;
        }
    }
}
