# Student Management System

Full-stack CRUD app with Spring Boot and React.

## Stack
- **Backend:** Spring Boot 2.7.14, JDBC, PostgreSQL
- **Frontend:** React 18.2.0, CSS Modules

## Setup

**Backend:**
```bash
cd student-management-backend
mvn clean install
java -jar target/student-management-backend-1.0.0.jar
```

**Frontend:**
```bash
cd student-management-frontend
npm install --legacy-peer-deps
npm start
```

**Ports:** Backend http://localhost:8080 | Frontend http://localhost:3000

## Database
```sql
CREATE DATABASE studentdb;
CREATE TABLE students (id SERIAL PRIMARY KEY, name VARCHAR(100), email VARCHAR(100), course VARCHAR(100));
```

## Features
Add, edit, delete, sort, filter students | Form validation | Real-time notifications
