package com.example.studentmanagement.service;

import com.example.studentmanagement.model.Student;
import com.example.studentmanagement.repository.StudentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

/**
 * StudentService - Business Logic Layer
 * Contains all business logic for student management operations.
 * Acts as an intermediary between Controller and Repository layers.
 */
@Service
public class StudentService {

    private static final Logger logger = LoggerFactory.getLogger(StudentService.class);

    @Autowired
    private StudentRepository studentRepository;

    /**
     * Create a new student
     * 
     * @param student Student object to be created
     * @return Created Student with generated ID
     * @throws IllegalArgumentException if validation fails
     */
    public Student createStudent(Student student) {
        logger.info("Creating new student: {}", student.getName());
        
        // Validate input
        validateStudent(student);
        
        Student savedStudent = studentRepository.save(student);
        logger.info("Student created successfully with ID: {}", savedStudent.getId());
        
        return savedStudent;
    }

    /**
     * Get all students
     * 
     * @return List of all students
     */
    public List<Student> getAllStudents() {
        logger.debug("Fetching all students");
        List<Student> students = studentRepository.findAll();
        logger.info("Retrieved {} students from database", students.size());
        
        return students;
    }

    /**
     * Get a student by ID
     * 
     * @param id Student ID
     * @return Optional containing the Student if found
     */
    public Optional<Student> getStudentById(Integer id) {
        logger.debug("Fetching student with ID: {}", id);
        Optional<Student> student = studentRepository.findById(id);
        
        if (student.isPresent()) {
            logger.info("Student found with ID: {}", id);
        } else {
            logger.warn("Student not found with ID: {}", id);
        }
        
        return student;
    }

    /**
     * Update an existing student
     * 
     * @param id Student ID to update
     * @param student Updated Student object
     * @return Updated Student if successful
     * @throws IllegalArgumentException if student not found or validation fails
     */
    public Student updateStudent(Integer id, Student student) {
        logger.info("Updating student with ID: {}", id);
        
        // Check if student exists
        if (!studentRepository.existsById(id)) {
            logger.error("Student not found with ID: {}", id);
            throw new IllegalArgumentException("Student with ID " + id + " not found");
        }
        
        // Validate input
        validateStudent(student);
        
        // Perform update
        int rowsUpdated = studentRepository.update(id, student);
        
        if (rowsUpdated > 0) {
            logger.info("Student updated successfully with ID: {}", id);
            student.setId(id);
            return student;
        } else {
            logger.error("Failed to update student with ID: {}", id);
            throw new IllegalArgumentException("Failed to update student");
        }
    }

    /**
     * Delete a student by ID
     * 
     * @param id Student ID to delete
     * @return true if deletion was successful
     * @throws IllegalArgumentException if student not found
     */
    public boolean deleteStudent(Integer id) {
        logger.info("Deleting student with ID: {}", id);
        
        // Check if student exists
        if (!studentRepository.existsById(id)) {
            logger.error("Student not found with ID: {}", id);
            throw new IllegalArgumentException("Student with ID " + id + " not found");
        }
        
        int rowsDeleted = studentRepository.delete(id);
        
        if (rowsDeleted > 0) {
            logger.info("Student deleted successfully with ID: {}", id);
            return true;
        } else {
            logger.error("Failed to delete student with ID: {}", id);
            return false;
        }
    }

    /**
     * Validate student data
     * 
     * @param student Student to validate
     * @throws IllegalArgumentException if validation fails
     */
    private void validateStudent(Student student) {
        if (student.getName() == null || student.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Student name cannot be empty");
        }
        
        if (student.getEmail() == null || student.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Student email cannot be empty");
        }
        
        if (!isValidEmail(student.getEmail())) {
            throw new IllegalArgumentException("Invalid email format");
        }
        
        if (student.getCourse() == null || student.getCourse().trim().isEmpty()) {
            throw new IllegalArgumentException("Student course cannot be empty");
        }
    }

    /**
     * Simple email validation
     * 
     * @param email Email to validate
     * @return true if email format is valid
     */
    private boolean isValidEmail(String email) {
        return email != null && email.contains("@") && email.contains(".");
    }

    /**
     * Get total student count
     * 
     * @return Total number of students
     */
    public long getTotalStudentCount() {
        return studentRepository.count();
    }
}
