package com.example.studentmanagement.repository;

import com.example.studentmanagement.model.Student;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

/**
 * StudentRepository - Data Access Layer
 * Handles all database operations using JdbcTemplate.
 * Note: We're using JDBC, NOT JPA/Hibernate.
 */
@Repository
public class StudentRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * RowMapper to convert database rows to Student objects
     */
    private static class StudentRowMapper implements RowMapper<Student> {
        @Override
        public Student mapRow(ResultSet rs, int rowNum) throws SQLException {
            Student student = new Student();
            student.setId(rs.getInt("id"));
            student.setName(rs.getString("name"));
            student.setEmail(rs.getString("email"));
            student.setCourse(rs.getString("course"));
            return student;
        }
    }

    /**
     * Save a new student to the database
     * 
     * @param student Student object to be saved
     * @return The saved Student object with generated ID
     */
    public Student save(Student student) {
        String sql = "INSERT INTO students (name, email, course) VALUES (?, ?, ?)";
        
        // Execute update and get the generated ID
        int result = jdbcTemplate.update(sql, 
            student.getName(), 
            student.getEmail(), 
            student.getCourse());
        
        if (result > 0) {
            // Fetch the last inserted ID
            Integer generatedId = jdbcTemplate.queryForObject(
                "SELECT lastval() as id", Integer.class);
            student.setId(generatedId);
            return student;
        }
        
        return null;
    }

    /**
     * Find all students in the database
     * 
     * @return List of all Student objects
     */
    public List<Student> findAll() {
        String sql = "SELECT id, name, email, course FROM students";
        return jdbcTemplate.query(sql, new StudentRowMapper());
    }

    /**
     * Find a student by ID
     * 
     * @param id Student ID
     * @return Optional containing the Student if found
     */
    public Optional<Student> findById(Integer id) {
        String sql = "SELECT id, name, email, course FROM students WHERE id = ?";
        
        try {
            Student student = jdbcTemplate.queryForObject(sql, new StudentRowMapper(), id);
            return Optional.of(student);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    /**
     * Update an existing student
     * 
     * @param id Student ID
     * @param student Updated Student object
     * @return Number of rows updated
     */
    public int update(Integer id, Student student) {
        String sql = "UPDATE students SET name = ?, email = ?, course = ? WHERE id = ?";
        
        return jdbcTemplate.update(sql,
            student.getName(),
            student.getEmail(),
            student.getCourse(),
            id);
    }

    /**
     * Delete a student by ID
     * 
     * @param id Student ID
     * @return Number of rows deleted
     */
    public int delete(Integer id) {
        String sql = "DELETE FROM students WHERE id = ?";
        return jdbcTemplate.update(sql, id);
    }

    /**
     * Check if a student exists
     * 
     * @param id Student ID
     * @return true if student exists, false otherwise
     */
    public boolean existsById(Integer id) {
        String sql = "SELECT COUNT(*) FROM students WHERE id = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, id);
        return count != null && count > 0;
    }

    /**
     * Get total count of students
     * 
     * @return Total number of students
     */
    public long count() {
        String sql = "SELECT COUNT(*) FROM students";
        Long count = jdbcTemplate.queryForObject(sql, Long.class);
        return count != null ? count : 0;
    }
}
