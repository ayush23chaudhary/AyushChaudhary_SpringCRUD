/**
 * api.js - Axios API Configuration
 * Centralized API client for all backend requests
 */

import axios from 'axios';

// Create an axios instance with base URL
const API_BASE_URL = 'http://localhost:8080/students';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API methods for student management

/**
 * Fetch all students
 * @returns {Promise} Response containing array of students
 */
export const getAllStudents = () => {
  return api.get('/');
};

/**
 * Fetch a specific student by ID
 * @param {number} id - Student ID
 * @returns {Promise} Response containing student data
 */
export const getStudentById = (id) => {
  return api.get(`/${id}`);
};

/**
 * Create a new student
 * @param {Object} student - Student data { name, email, course }
 * @returns {Promise} Response containing created student with ID
 */
export const createStudent = (student) => {
  return api.post('/', student);
};

/**
 * Update an existing student
 * @param {number} id - Student ID
 * @param {Object} student - Updated student data { name, email, course }
 * @returns {Promise} Response containing updated student
 */
export const updateStudent = (id, student) => {
  return api.put(`/${id}`, student);
};

/**
 * Delete a student
 * @param {number} id - Student ID
 * @returns {Promise} Response containing deletion status
 */
export const deleteStudent = (id) => {
  return api.delete(`/${id}`);
};

/**
 * Get total student count
 * @returns {Promise} Response containing total count
 */
export const getStudentCount = () => {
  return api.get('/count');
};

export default api;
