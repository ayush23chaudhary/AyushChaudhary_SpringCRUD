/**
 * App.js - Main Application Component
 * Modern dashboard with sidebar, navbar, and toast notifications
 */

import React, { useState, useEffect } from 'react';
import StudentForm from './StudentForm';
import StudentList from './StudentList';
import Toast from './Toast';
import { getAllStudents, createStudent, updateStudent, deleteStudent } from './api';
import styles from './App.module.css';

const App = () => {
  // State management
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [isOperating, setIsOperating] = useState(false);

  /**
   * Fetch all students on component mount
   */
  useEffect(() => {
    fetchStudents();
  }, []);

  /**
   * Fetch all students from backend
   */
  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getAllStudents();
      setStudents(response.data);
      console.log('Students fetched successfully:', response.data);
    } catch (err) {
      const errorMsg = 'Failed to fetch students. Make sure the backend is running.';
      setError(errorMsg);
      showToast(errorMsg, 'error');
      console.error('Error fetching students:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Show toast notification
   */
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  /**
   * Handle form submission (create or update)
   */
  const handleFormSubmit = async (formData, studentId) => {
    try {
      setIsOperating(true);
      setError(null);

      if (studentId) {
        // Update existing student
        const response = await updateStudent(studentId, formData);
        console.log('Student updated successfully:', response.data);
        
        // Update local state
        setStudents(
          students.map((s) => (s.id === studentId ? response.data : s))
        );
        showToast(`Student '${response.data.name}' updated successfully!`, 'success');
      } else {
        // Create new student
        const response = await createStudent(formData);
        console.log('Student created successfully:', response.data);
        
        // Add to local state
        setStudents([...students, response.data]);
        showToast(`Student '${response.data.name}' added successfully!`, 'success');
      }
      
      // Clear editing state
      setEditingStudent(null);
    } catch (err) {
      const errorMsg = err.response?.data || 'Failed to save student. Please try again.';
      setError(errorMsg);
      showToast(errorMsg, 'error');
      console.error('Error saving student:', err);
    } finally {
      setIsOperating(false);
    }
  };

  /**
   * Handle edit button click
   */
  const handleEdit = (student) => {
    setEditingStudent(student);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * Handle delete button click
   */
  const handleDelete = async (id) => {
    try {
      setIsOperating(true);
      setError(null);
      
      await deleteStudent(id);
      console.log('Student deleted successfully');
      
      // Remove from local state
      const studentName = students.find(s => s.id === id)?.name || 'Student';
      setStudents(students.filter((s) => s.id !== id));
      showToast(`${studentName} deleted successfully!`, 'success');
    } catch (err) {
      const errorMsg = 'Failed to delete student. Please try again.';
      setError(errorMsg);
      showToast(errorMsg, 'error');
      console.error('Error deleting student:', err);
    } finally {
      setIsOperating(false);
    }
  };

  /**
   * Handle cancel edit
   */
  const handleCancel = () => {
    setEditingStudent(null);
    setError(null);
  };

  return (
    <div className={styles.app}>
      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Navbar */}
        <nav className={styles.navbar}>
          <h2 className={styles.navTitle}>Student Management</h2>
          <div className={styles.navStats}>
            <span className={styles.statBadge}>{students.length} Students</span>
          </div>
        </nav>

        {/* Page Container */}
        <div className={styles.pageContainer}>
          {/* Header Section */}
          <div className={styles.pageHeader}>
            <div>
              <h1 className={styles.pageTitle}>📚 Student Management System</h1>
              <p className={styles.pageSubtitle}>Manage your students efficiently and effectively</p>
            </div>
          </div>

          {/* Content Grid */}
          <div className={styles.contentGrid}>
            {/* Form Section */}
            <section className={styles.formSection}>
              {/* Error Message */}
              {error && (
                <div className={styles.errorBanner}>
                  <span>❌ {error}</span>
                  <button 
                    className={styles.bannerClose}
                    onClick={() => setError(null)}
                    aria-label="Close error"
                  >
                    ✕
                  </button>
                </div>
              )}

              <StudentForm
                onSubmit={handleFormSubmit}
                editingStudent={editingStudent}
                onCancel={handleCancel}
              />
            </section>

            {/* List Section */}
            <section className={styles.listSection}>
              <StudentList
                students={students}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isLoading={isLoading}
              />
            </section>
          </div>

          {/* Footer */}
          <footer className={styles.footer}>
            <p>
              ✨ Student Management System © 2024 | Built with Spring Boot & React
            </p>
          </footer>
        </div>
      </div>

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default App;
