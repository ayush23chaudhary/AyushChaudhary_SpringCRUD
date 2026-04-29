/**
 * StudentList.js - Modern Table Component
 * Displays all students with modern styling and interactions
 */

import React, { useState } from 'react';
import styles from './StudentList.module.css';

const StudentList = ({ students, onEdit, onDelete, isLoading }) => {
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [sortBy, setSortBy] = useState('name'); // name, email, course
  const [filterCourse, setFilterCourse] = useState(''); // Filter by course

  // Get unique courses for filter dropdown
  const uniqueCourses = [...new Set(students.map((s) => s.course))].sort();

  // Filter students by course if selected
  const filteredStudents = filterCourse
    ? students.filter((s) => s.course === filterCourse)
    : students;

  // Sort students
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'email':
        return a.email.localeCompare(b.email);
      case 'course':
        return a.course.localeCompare(b.course);
      default:
        return 0;
    }
  });

  const handleDeleteConfirm = (id) => {
    setDeleteConfirm(id);
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm(null);
  };

  const handleDeleteConfirmation = async (id) => {
    await onDelete(id);
    setDeleteConfirm(null);
  };

  const getCourseColor = (course) => {
    const colors = {
      'Computer Science': '#6366f1',
      'Business Administration': '#8b5cf6',
      'Engineering': '#ec4899',
      'Medicine': '#f43f5e',
      'Arts': '#f59e0b',
      'Science': '#06b6d4',
    };
    return colors[course] || '#6366f1';
  };

  if (isLoading) {
    return (
      <div className={styles.listContainer}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p className={styles.loadingText}>Loading students...</p>
        </div>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className={styles.listContainer}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>�</div>
          <h3 className={styles.emptyTitle}>No Students Yet</h3>
          <p className={styles.emptyDescription}>
            Get started by adding your first student using the form above.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.listContainer}>
      {/* Header with Stats */}
      <div className={styles.listHeader}>
        <div className={styles.headerContent}>
          <h3 className={styles.listTitle}>📋 Student List</h3>
          <p className={styles.listSubtitle}>
            {sortedStudents.length} student{sortedStudents.length !== 1 ? 's' : ''} registered
          </p>
        </div>

        {/* Controls */}
        <div className={styles.controls}>
          <div className={styles.sortControl}>
            <label htmlFor="sort" className={styles.controlLabel}>
              Sort by:
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={styles.selectInput}
            >
              <option value="name">Name</option>
              <option value="email">Email</option>
              <option value="course">Course</option>
            </select>
          </div>

          {uniqueCourses.length > 0 && (
            <div className={styles.filterControl}>
              <label htmlFor="filter" className={styles.controlLabel}>
                Filter by:
              </label>
              <select
                id="filter"
                value={filterCourse}
                onChange={(e) => setFilterCourse(e.target.value)}
                className={styles.selectInput}
              >
                <option value="">All Courses</option>
                {uniqueCourses.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.tableHeader}>
              <th className={styles.colId}>ID</th>
              <th className={styles.colName}>Name</th>
              <th className={styles.colEmail}>Email</th>
              <th className={styles.colCourse}>Course</th>
              <th className={styles.colActions}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedStudents.map((student, index) => (
              <tr key={student.id} className={`${styles.tableRow} ${index % 2 === 0 ? styles.zebra : ''}`}>
                <td className={styles.colId}>
                  <span className={styles.idBadge}>#{student.id}</span>
                </td>
                <td className={styles.colName}>
                  <span className={styles.nameText}>{student.name}</span>
                </td>
                <td className={styles.colEmail}>
                  <span className={styles.emailText}>{student.email}</span>
                </td>
                <td className={styles.colCourse}>
                  <span
                    className={styles.courseBadge}
                    style={{ backgroundColor: `${getCourseColor(student.course)}15`, color: getCourseColor(student.course) }}
                  >
                    {student.course}
                  </span>
                </td>
                <td className={styles.colActions}>
                  <div className={styles.actionButtons}>
                    <button
                      onClick={() => onEdit(student)}
                      className={styles.editBtn}
                      title="Edit student"
                      aria-label="Edit student"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteConfirm(student.id)}
                      className={styles.deleteBtn}
                      title="Delete student"
                      aria-label="Delete student"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm !== null && (
        <div className={styles.modalOverlay} onClick={handleDeleteCancel}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalIcon}>⚠️</div>
            <h4 className={styles.modalTitle}>Delete Student?</h4>
            <p className={styles.modalMessage}>
              This action cannot be undone. The student record will be permanently deleted.
            </p>
            <div className={styles.modalButtons}>
              <button
                onClick={handleDeleteCancel}
                className={styles.modalCancelBtn}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteConfirmation(deleteConfirm)}
                className={styles.modalDeleteBtn}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;
