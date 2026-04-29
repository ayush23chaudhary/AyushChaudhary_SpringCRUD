/**
 * StudentForm.js - Modern Form Component
 * Handles creating new students and editing existing students
 */

import React, { useState, useEffect } from 'react';
import styles from './StudentForm.module.css';

const StudentForm = ({ onSubmit, editingStudent, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    course: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (editingStudent) {
      setFormData({
        name: editingStudent.name,
        email: editingStudent.email,
        course: editingStudent.course,
      });
      setErrors({});
      setTouched({});
    } else {
      setFormData({ name: '', email: '', course: '' });
      setErrors({});
      setTouched({});
    }
  }, [editingStudent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.course.trim()) {
      newErrors.course = 'Course is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData, editingStudent?.id);
      setFormData({ name: '', email: '', course: '' });
      setTouched({});
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', email: '', course: '' });
    setErrors({});
    setTouched({});
    if (onCancel) {
      onCancel();
    }
  };

  const isFormValid = formData.name.trim() && formData.email.trim() && formData.course.trim();

  return (
    <div className={styles.formContainer}>
      <div className={styles.formHeader}>
        <h3 className={styles.formTitle}>
          {editingStudent ? '✏️ Edit Student' : '➕ Add New Student'}
        </h3>
        <p className={styles.formSubtitle}>
          {editingStudent ? 'Update student information' : 'Add a new student to the system'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Name Field */}
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>
            Full Name
          </label>
          <div className={styles.inputWrapper}>
            <span className={styles.inputIcon}>👤</span>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter student name"
              className={`${styles.input} ${errors.name && touched.name ? styles.inputError : ''}`}
              disabled={isSubmitting}
            />
          </div>
          {errors.name && touched.name && (
            <span className={styles.errorText}>⚠️ {errors.name}</span>
          )}
        </div>

        {/* Email Field */}
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>
            Email Address
          </label>
          <div className={styles.inputWrapper}>
            <span className={styles.inputIcon}>📧</span>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="example@email.com"
              className={`${styles.input} ${errors.email && touched.email ? styles.inputError : ''}`}
              disabled={isSubmitting}
            />
          </div>
          {errors.email && touched.email && (
            <span className={styles.errorText}>⚠️ {errors.email}</span>
          )}
        </div>

        {/* Course Field */}
        <div className={styles.formGroup}>
          <label htmlFor="course" className={styles.label}>
            Course
          </label>
          <div className={styles.inputWrapper}>
            <span className={styles.inputIcon}>📚</span>
            <input
              type="text"
              id="course"
              name="course"
              value={formData.course}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g., Computer Science"
              className={`${styles.input} ${errors.course && touched.course ? styles.inputError : ''}`}
              disabled={isSubmitting}
            />
          </div>
          {errors.course && touched.course && (
            <span className={styles.errorText}>⚠️ {errors.course}</span>
          )}
        </div>

        {/* Form Buttons */}
        <div className={styles.buttonGroup}>
          <button
            type="submit"
            disabled={isSubmitting || !isFormValid}
            className={styles.submitBtn}
          >
            {isSubmitting ? (
              <>
                <span className={styles.spinner}></span>
                {editingStudent ? 'Updating...' : 'Adding...'}
              </>
            ) : (
              editingStudent ? '✓ Update Student' : '✓ Add Student'
            )}
          </button>

          {editingStudent && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className={styles.cancelBtn}
            >
              ✕ Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default StudentForm;
