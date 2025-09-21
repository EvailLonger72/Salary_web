# Salary_web Implementation Guide

**Author:** Manus AI  
**Date:** September 2025  
**Version:** 1.0

## Table of Contents

1. [Introduction](#introduction)
2. [Project Setup and Environment Configuration](#project-setup)
3. [Database Design and Implementation](#database-design)
4. [Backend Development](#backend-development)
5. [Frontend Development](#frontend-development)
6. [Authentication and Security](#authentication-security)
7. [Core Feature Implementation](#core-features)
8. [Testing Strategy](#testing-strategy)
9. [Deployment and DevOps](#deployment-devops)
10. [Maintenance and Monitoring](#maintenance-monitoring)

## Introduction

This comprehensive implementation guide provides detailed, step-by-step instructions for developing a modern salary management web application. Based on extensive research of industry best practices and successful payroll systems, this guide offers practical code examples, architectural decisions, and implementation strategies that will result in a scalable, secure, and user-friendly payroll management system.

The implementation approach outlined in this guide follows modern web development principles, incorporating proven technologies and frameworks that have been successfully deployed in production environments. The guide is structured to take developers from initial project setup through to production deployment, with each section building upon the previous one to create a cohesive and robust application.

Modern salary management systems require careful consideration of multiple factors including data security, regulatory compliance, user experience, and system performance. This guide addresses each of these concerns through detailed implementation instructions that incorporate industry-standard security practices, efficient database design patterns, and responsive user interface development techniques.

The recommended technology stack leverages the power of React.js for the frontend, Node.js with Express.js for the backend, and PostgreSQL for data persistence. This combination provides excellent performance characteristics, strong community support, and extensive ecosystem of supporting libraries and tools. The implementation strategy emphasizes modularity, maintainability, and scalability to ensure the application can grow with organizational needs.

Throughout this guide, special attention is paid to the unique requirements of payroll systems, including effective dating for historical data management, complex calculation engines for salary processing, and comprehensive audit trails for compliance purposes. The implementation examples demonstrate how to handle these specialized requirements while maintaining clean, maintainable code architecture.



## Project Setup and Environment Configuration

### Development Environment Prerequisites

Before beginning development of the Salary_web application, it is essential to establish a consistent and reliable development environment. The modern web development ecosystem requires several key tools and technologies to be properly configured to ensure smooth development workflow and consistent results across different development machines.

Node.js serves as the foundation for both frontend and backend development in this project. The recommended version is Node.js 18 or higher, which provides the latest JavaScript features and optimal performance characteristics. The Node Version Manager (nvm) should be used to manage Node.js versions, allowing developers to easily switch between different versions as needed for various projects.

```bash
# Install Node.js 18 using nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18
nvm alias default 18
```

PostgreSQL database server must be installed and configured for local development. PostgreSQL 14 or higher is recommended for optimal performance and feature availability. The database server should be configured with appropriate authentication settings and a dedicated database user for the application.

```bash
# Install PostgreSQL on Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql
CREATE DATABASE salary_web_dev;
CREATE USER salary_web_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE salary_web_dev TO salary_web_user;
\q
```

Redis server installation is required for session management and caching functionality. Redis provides high-performance in-memory data storage that significantly improves application response times and enables efficient session handling across multiple application instances.

```bash
# Install Redis on Ubuntu/Debian
sudo apt install redis-server

# Start Redis service
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Test Redis installation
redis-cli ping
```

### Project Structure and Initialization

The project structure should follow modern full-stack application conventions, with clear separation between frontend and backend components. This organization facilitates independent development and deployment of different application layers while maintaining clear boundaries and dependencies.

```
salary-web/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── app.js
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   ├── tests/
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── store/
│   │   ├── utils/
│   │   └── App.jsx
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── docs/
├── docker-compose.yml
└── README.md
```

### Backend Project Initialization

The backend application should be initialized as a Node.js project with TypeScript support for enhanced development experience and code reliability. TypeScript provides static type checking that catches errors during development rather than runtime, significantly improving code quality and maintainability.

```bash
# Create and initialize backend project
mkdir salary-web && cd salary-web
mkdir backend && cd backend
npm init -y

# Install core dependencies
npm install express cors helmet morgan dotenv bcryptjs jsonwebtoken
npm install @prisma/client prisma
npm install redis connect-redis express-session
npm install joi express-rate-limit winston

# Install development dependencies
npm install -D typescript @types/node @types/express @types/cors
npm install -D @types/bcryptjs @types/jsonwebtoken @types/morgan
npm install -D nodemon ts-node eslint prettier
npm install -D @typescript-eslint/eslint-plugin @typescript-eslint/parser
npm install -D jest @types/jest supertest @types/supertest
```

The TypeScript configuration should be optimized for Node.js development with strict type checking enabled to catch potential issues early in the development process.

```json
// backend/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "removeComments": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

### Frontend Project Initialization

The frontend application should be created using Vite for optimal development experience and build performance. Vite provides fast hot module replacement and efficient bundling that significantly improves development workflow compared to traditional build tools.

```bash
# Create React frontend with Vite
cd ../
npm create vite@latest frontend -- --template react-ts
cd frontend

# Install additional dependencies
npm install @reduxjs/toolkit react-redux react-router-dom
npm install axios react-hook-form @hookform/resolvers zod
npm install @tanstack/react-query @tanstack/react-query-devtools
npm install lucide-react framer-motion react-hot-toast
npm install recharts date-fns clsx tailwind-merge

# Install and configure Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

The Tailwind CSS configuration should be customized to include the project's design system colors, typography, and spacing scales that align with modern UI design principles.

```javascript
// frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#f8fafc',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          900: '#0f172a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      }
    },
  },
  plugins: [],
}
```

### Environment Configuration

Environment variables should be properly configured for different deployment environments, with clear separation between development, testing, and production configurations. This approach ensures sensitive information is properly protected while allowing for flexible configuration management.

```bash
# backend/.env.example
NODE_ENV=development
PORT=5000
DATABASE_URL="postgresql://salary_web_user:your_secure_password@localhost:5432/salary_web_dev"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-in-production"
SESSION_SECRET="your-super-secret-session-key-change-in-production"
CORS_ORIGIN="http://localhost:3000"
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

The frontend environment configuration should include API endpoints and feature flags that allow for flexible deployment across different environments.

```bash
# frontend/.env.example
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME="Salary Web Management System"
VITE_APP_VERSION=1.0.0
VITE_ENABLE_DEVTOOLS=true
VITE_ENABLE_ANALYTICS=false
```

### Development Scripts and Automation

Package.json scripts should be configured to provide convenient development commands that streamline common development tasks and ensure consistent execution across different development environments.

```json
// backend/package.json scripts section
{
  "scripts": {
    "dev": "nodemon --exec ts-node src/app.ts",
    "build": "tsc",
    "start": "node dist/app.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src/**/*.ts",
    "lint:fix": "eslint src/**/*.ts --fix",
    "format": "prettier --write src/**/*.ts",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio",
    "db:seed": "ts-node prisma/seed.ts"
  }
}
```

```json
// frontend/package.json scripts section
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "format": "prettier --write src/**/*.{ts,tsx}",
    "type-check": "tsc --noEmit"
  }
}
```

### Docker Development Environment

Docker configuration should be implemented to provide consistent development environments across different machines and operating systems. This approach eliminates "works on my machine" issues and simplifies onboarding for new team members.

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: salary_web_dev
      POSTGRES_USER: salary_web_user
      POSTGRES_PASSWORD: your_secure_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backend/prisma/init.sql:/docker-entrypoint-initdb.d/init.sql

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.dev
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://salary_web_user:your_secure_password@postgres:5432/salary_web_dev
      - REDIS_URL=redis://redis:6379
    volumes:
      - ./backend:/app
      - /app/node_modules
    depends_on:
      - postgres
      - redis

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    environment:
      - VITE_API_BASE_URL=http://localhost:5000/api
    volumes:
      - ./frontend:/app
      - /app/node_modules
    depends_on:
      - backend

volumes:
  postgres_data:
  redis_data:
```

The Docker development setup provides isolated, reproducible environments that can be easily shared across team members and deployment environments. This configuration includes hot reloading for both frontend and backend applications, enabling efficient development workflow while maintaining consistency with production environments.


## Database Design and Implementation

### Database Schema Architecture

The database design for a salary management system requires careful consideration of data relationships, temporal data management, and audit trail requirements. The schema must support complex payroll calculations while maintaining data integrity and providing efficient query performance for reporting and analytics functions.

The core database architecture follows a normalized relational design that eliminates data redundancy while maintaining referential integrity. The schema incorporates effective dating principles to track historical changes in employee information, salary adjustments, and organizational structure modifications over time.

Effective dating is a critical concept in payroll systems that allows the storage of time-sensitive data with specific validity periods. This approach enables the system to maintain accurate historical records while supporting retroactive payroll adjustments and compliance reporting requirements. Each record that requires temporal tracking includes effective start and end dates that define the period during which the data is valid.

### Prisma Schema Definition

The Prisma schema provides a type-safe, declarative approach to database modeling that generates both database migrations and TypeScript types. This approach ensures consistency between the database structure and application code while providing excellent developer experience through auto-completion and compile-time error checking.

```prisma
// backend/prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id          String   @id @default(cuid())
  email       String   @unique
  password    String
  role        UserRole @default(EMPLOYEE)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  lastLoginAt DateTime?

  // Relationships
  employee    Employee?
  auditLogs   AuditLog[]
  createdEmployees Employee[] @relation("CreatedByUser")
  
  @@map("users")
}

model Employee {
  id              String    @id @default(cuid())
  employeeNumber  String    @unique
  firstName       String
  lastName        String
  middleName      String?
  email           String    @unique
  phoneNumber     String?
  dateOfBirth     DateTime?
  hireDate        DateTime
  terminationDate DateTime?
  isActive        Boolean   @default(true)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  // Address Information
  streetAddress   String?
  city            String?
  state           String?
  postalCode      String?
  country         String?

  // Emergency Contact
  emergencyContactName  String?
  emergencyContactPhone String?
  emergencyContactRelation String?

  // Relationships
  userId          String?   @unique
  user            User?     @relation(fields: [userId], references: [id])
  createdById     String
  createdBy       User      @relation("CreatedByUser", fields: [createdById], references: [id])
  
  positions       EmployeePosition[]
  salaryRecords   SalaryRecord[]
  attendanceRecords AttendanceRecord[]
  payrollRecords  PayrollRecord[]
  deductions      EmployeeDeduction[]
  
  @@map("employees")
}

model Department {
  id          String   @id @default(cuid())
  name        String   @unique
  description String?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relationships
  positions   Position[]
  
  @@map("departments")
}

model Position {
  id           String   @id @default(cuid())
  title        String
  description  String?
  salaryGrade  String?
  isActive     Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  // Relationships
  departmentId String
  department   Department @relation(fields: [departmentId], references: [id])
  employees    EmployeePosition[]
  
  @@map("positions")
}

model EmployeePosition {
  id          String    @id @default(cuid())
  effectiveDate DateTime
  endDate     DateTime?
  isActive    Boolean   @default(true)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  // Relationships
  employeeId  String
  employee    Employee  @relation(fields: [employeeId], references: [id])
  positionId  String
  position    Position  @relation(fields: [positionId], references: [id])
  
  @@map("employee_positions")
}

model SalaryRecord {
  id            String      @id @default(cuid())
  baseSalary    Decimal     @db.Decimal(12, 2)
  salaryType    SalaryType  @default(MONTHLY)
  effectiveDate DateTime
  endDate       DateTime?
  currency      String      @default("USD")
  isActive      Boolean     @default(true)
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  // Relationships
  employeeId    String
  employee      Employee    @relation(fields: [employeeId], references: [id])
  
  @@map("salary_records")
}

model AttendanceRecord {
  id          String          @id @default(cuid())
  date        DateTime        @db.Date
  clockIn     DateTime?
  clockOut    DateTime?
  breakStart  DateTime?
  breakEnd    DateTime?
  hoursWorked Decimal?        @db.Decimal(4, 2)
  overtimeHours Decimal?      @db.Decimal(4, 2)
  status      AttendanceStatus @default(PRESENT)
  notes       String?
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt

  // Relationships
  employeeId  String
  employee    Employee        @relation(fields: [employeeId], references: [id])
  
  @@unique([employeeId, date])
  @@map("attendance_records")
}

model PayrollRecord {
  id              String    @id @default(cuid())
  payPeriodStart  DateTime  @db.Date
  payPeriodEnd    DateTime  @db.Date
  payDate         DateTime  @db.Date
  baseSalary      Decimal   @db.Decimal(12, 2)
  overtimePay     Decimal   @db.Decimal(12, 2) @default(0)
  bonuses         Decimal   @db.Decimal(12, 2) @default(0)
  grossPay        Decimal   @db.Decimal(12, 2)
  totalDeductions Decimal   @db.Decimal(12, 2) @default(0)
  netPay          Decimal   @db.Decimal(12, 2)
  status          PayrollStatus @default(DRAFT)
  processedAt     DateTime?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  // Relationships
  employeeId      String
  employee        Employee  @relation(fields: [employeeId], references: [id])
  deductions      PayrollDeduction[]
  
  @@map("payroll_records")
}

model DeductionType {
  id          String    @id @default(cuid())
  name        String    @unique
  description String?
  category    DeductionCategory
  isActive    Boolean   @default(true)
  isMandatory Boolean   @default(false)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  // Relationships
  employeeDeductions EmployeeDeduction[]
  payrollDeductions  PayrollDeduction[]
  
  @@map("deduction_types")
}

model EmployeeDeduction {
  id            String      @id @default(cuid())
  amount        Decimal?    @db.Decimal(12, 2)
  percentage    Decimal?    @db.Decimal(5, 4)
  effectiveDate DateTime
  endDate       DateTime?
  isActive      Boolean     @default(true)
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  // Relationships
  employeeId      String
  employee        Employee      @relation(fields: [employeeId], references: [id])
  deductionTypeId String
  deductionType   DeductionType @relation(fields: [deductionTypeId], references: [id])
  
  @@map("employee_deductions")
}

model PayrollDeduction {
  id            String        @id @default(cuid())
  amount        Decimal       @db.Decimal(12, 2)
  createdAt     DateTime      @default(now())

  // Relationships
  payrollRecordId String
  payrollRecord   PayrollRecord @relation(fields: [payrollRecordId], references: [id])
  deductionTypeId String
  deductionType   DeductionType @relation(fields: [deductionTypeId], references: [id])
  
  @@map("payroll_deductions")
}

model AuditLog {
  id          String    @id @default(cuid())
  tableName   String
  recordId    String
  action      AuditAction
  oldValues   Json?
  newValues   Json?
  timestamp   DateTime  @default(now())

  // Relationships
  userId      String
  user        User      @relation(fields: [userId], references: [id])
  
  @@map("audit_logs")
}

// Enums
enum UserRole {
  SUPER_ADMIN
  ADMIN
  HR_MANAGER
  PAYROLL_CLERK
  EMPLOYEE
}

enum SalaryType {
  HOURLY
  DAILY
  WEEKLY
  MONTHLY
  YEARLY
}

enum AttendanceStatus {
  PRESENT
  ABSENT
  LATE
  HALF_DAY
  SICK_LEAVE
  VACATION
  HOLIDAY
}

enum PayrollStatus {
  DRAFT
  CALCULATED
  APPROVED
  PAID
  CANCELLED
}

enum DeductionCategory {
  TAX
  INSURANCE
  RETIREMENT
  LOAN
  OTHER
}

enum AuditAction {
  CREATE
  UPDATE
  DELETE
}
```

### Database Indexing Strategy

Proper indexing is crucial for payroll system performance, especially when dealing with large datasets and complex reporting queries. The indexing strategy should focus on commonly queried fields and support efficient data retrieval for payroll processing and reporting functions.

```sql
-- Performance indexes for common queries
CREATE INDEX idx_employees_employee_number ON employees(employee_number);
CREATE INDEX idx_employees_email ON employees(email);
CREATE INDEX idx_employees_hire_date ON employees(hire_date);
CREATE INDEX idx_employees_is_active ON employees(is_active);

-- Composite indexes for payroll processing
CREATE INDEX idx_salary_records_employee_effective ON salary_records(employee_id, effective_date DESC);
CREATE INDEX idx_attendance_employee_date ON attendance_records(employee_id, date DESC);
CREATE INDEX idx_payroll_records_employee_period ON payroll_records(employee_id, pay_period_start, pay_period_end);

-- Indexes for reporting and analytics
CREATE INDEX idx_payroll_records_pay_date ON payroll_records(pay_date);
CREATE INDEX idx_payroll_records_status ON payroll_records(status);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX idx_audit_logs_table_record ON audit_logs(table_name, record_id);
```

### Data Validation and Constraints

Database-level constraints ensure data integrity and prevent invalid data from being stored in the system. These constraints work in conjunction with application-level validation to provide comprehensive data protection.

```sql
-- Check constraints for data validation
ALTER TABLE salary_records ADD CONSTRAINT chk_salary_positive 
  CHECK (base_salary > 0);

ALTER TABLE attendance_records ADD CONSTRAINT chk_hours_valid 
  CHECK (hours_worked >= 0 AND hours_worked <= 24);

ALTER TABLE attendance_records ADD CONSTRAINT chk_overtime_valid 
  CHECK (overtime_hours >= 0 AND overtime_hours <= 12);

ALTER TABLE payroll_records ADD CONSTRAINT chk_pay_period_valid 
  CHECK (pay_period_end >= pay_period_start);

ALTER TABLE payroll_records ADD CONSTRAINT chk_gross_pay_positive 
  CHECK (gross_pay >= 0);

ALTER TABLE employee_deductions ADD CONSTRAINT chk_deduction_amount_or_percentage 
  CHECK ((amount IS NOT NULL AND percentage IS NULL) OR 
         (amount IS NULL AND percentage IS NOT NULL));
```

### Database Migration Strategy

Database migrations should be carefully planned and executed to ensure data integrity during schema changes. The migration strategy includes both forward migrations for applying changes and rollback procedures for reverting changes if necessary.

```typescript
// backend/prisma/migrations/001_initial_schema.sql
-- Initial schema creation with all tables and relationships
-- This migration establishes the foundation database structure

-- Create users table
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'EMPLOYEE',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_login_at TIMESTAMP
);

-- Create employees table with comprehensive employee information
CREATE TABLE employees (
  id TEXT PRIMARY KEY,
  employee_number TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  middle_name TEXT,
  email TEXT UNIQUE NOT NULL,
  phone_number TEXT,
  date_of_birth TIMESTAMP,
  hire_date TIMESTAMP NOT NULL,
  termination_date TIMESTAMP,
  is_active BOOLEAN NOT NULL DEFAULT true,
  street_address TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  emergency_contact_relation TEXT,
  user_id TEXT UNIQUE REFERENCES users(id),
  created_by_id TEXT NOT NULL REFERENCES users(id),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### Database Seeding and Test Data

Database seeding provides initial data for development and testing environments. The seed data should include realistic examples that cover various scenarios and edge cases that the application needs to handle.

```typescript
// backend/prisma/seed.ts
import { PrismaClient, UserRole, SalaryType, AttendanceStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@salarywebapp.com',
      password: adminPassword,
      role: UserRole.SUPER_ADMIN,
    },
  });

  // Create HR manager user
  const hrPassword = await bcrypt.hash('hr123', 12);
  const hrUser = await prisma.user.create({
    data: {
      email: 'hr@salarywebapp.com',
      password: hrPassword,
      role: UserRole.HR_MANAGER,
    },
  });

  // Create departments
  const itDepartment = await prisma.department.create({
    data: {
      name: 'Information Technology',
      description: 'Software development and IT infrastructure',
    },
  });

  const hrDepartment = await prisma.department.create({
    data: {
      name: 'Human Resources',
      description: 'Employee relations and organizational development',
    },
  });

  // Create positions
  const developerPosition = await prisma.position.create({
    data: {
      title: 'Software Developer',
      description: 'Full-stack web application development',
      salaryGrade: 'Grade 5',
      departmentId: itDepartment.id,
    },
  });

  const hrManagerPosition = await prisma.position.create({
    data: {
      title: 'HR Manager',
      description: 'Human resources management and strategy',
      salaryGrade: 'Grade 7',
      departmentId: hrDepartment.id,
    },
  });

  // Create sample employees
  const employee1 = await prisma.employee.create({
    data: {
      employeeNumber: 'EMP001',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@salarywebapp.com',
      phoneNumber: '+1-555-0123',
      hireDate: new Date('2023-01-15'),
      streetAddress: '123 Main Street',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'USA',
      createdById: adminUser.id,
    },
  });

  // Create employee positions with effective dating
  await prisma.employeePosition.create({
    data: {
      employeeId: employee1.id,
      positionId: developerPosition.id,
      effectiveDate: new Date('2023-01-15'),
    },
  });

  // Create salary records with effective dating
  await prisma.salaryRecord.create({
    data: {
      employeeId: employee1.id,
      baseSalary: 75000,
      salaryType: SalaryType.YEARLY,
      effectiveDate: new Date('2023-01-15'),
      currency: 'USD',
    },
  });

  // Create deduction types
  await prisma.deductionType.createMany({
    data: [
      {
        name: 'Federal Income Tax',
        description: 'Federal income tax withholding',
        category: 'TAX',
        isMandatory: true,
      },
      {
        name: 'State Income Tax',
        description: 'State income tax withholding',
        category: 'TAX',
        isMandatory: true,
      },
      {
        name: 'Health Insurance',
        description: 'Employee health insurance premium',
        category: 'INSURANCE',
        isMandatory: false,
      },
      {
        name: '401(k) Contribution',
        description: 'Employee retirement contribution',
        category: 'RETIREMENT',
        isMandatory: false,
      },
    ],
  });

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

The database design incorporates industry best practices for payroll systems, including proper normalization, effective dating for temporal data, comprehensive audit trails, and performance optimization through strategic indexing. This foundation provides the reliability and scalability required for a production-grade salary management system.


## Backend Development

### Application Architecture and Structure

The backend application follows a layered architecture pattern that promotes separation of concerns, maintainability, and testability. This architectural approach organizes code into distinct layers, each with specific responsibilities and clear interfaces between layers.

The controller layer handles HTTP requests and responses, serving as the entry point for all API interactions. Controllers are responsible for request validation, calling appropriate service methods, and formatting responses. They should remain thin, delegating business logic to service layers while focusing on HTTP-specific concerns.

The service layer contains the core business logic and orchestrates interactions between different domain entities. Services handle complex business rules, coordinate database operations, and implement the application's core functionality. This layer is independent of HTTP concerns and can be easily tested in isolation.

The repository layer provides an abstraction over data access operations, encapsulating database queries and data manipulation logic. This pattern allows for easy testing through mock implementations and provides flexibility to change data storage mechanisms without affecting business logic.

```typescript
// backend/src/app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import RedisStore from 'connect-redis';
import { createClient } from 'redis';
import { PrismaClient } from '@prisma/client';

import authRoutes from './routes/auth.routes';
import employeeRoutes from './routes/employee.routes';
import payrollRoutes from './routes/payroll.routes';
import reportRoutes from './routes/report.routes';
import { errorHandler } from './middleware/error.middleware';
import { logger } from './utils/logger';

const app = express();
const prisma = new PrismaClient();

// Redis client for session storage
const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.connect().catch(console.error);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Session configuration
app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/reports', reportRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  logger.info(`Server running on port ${PORT}`);
});

export default app;
```

### Authentication and Authorization System

The authentication system implements JWT-based authentication with refresh token rotation for enhanced security. This approach provides stateless authentication while maintaining the ability to revoke access through refresh token management.

```typescript
// backend/src/services/auth.service.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient, User, UserRole } from '@prisma/client';
import { AppError } from '../utils/errors';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  private readonly JWT_SECRET = process.env.JWT_SECRET!;
  private readonly JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
  private readonly ACCESS_TOKEN_EXPIRY = '15m';
  private readonly REFRESH_TOKEN_EXPIRY = '7d';

  async register(userData: {
    email: string;
    password: string;
    role?: UserRole;
  }): Promise<{ user: Omit<User, 'password'>; tokens: AuthTokens }> {
    const { email, password, role = UserRole.EMPLOYEE } = userData;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError('User already exists with this email', 400);
    }

    // Hash password
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
      },
    });

    // Generate tokens
    const tokens = this.generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    logger.info(`User registered: ${email}`);

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, tokens };
  }

  async login(email: string, password: string): Promise<{
    user: Omit<User, 'password'>;
    tokens: AuthTokens;
  }> {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.isActive) {
      throw new AppError('Invalid credentials', 401);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    // Generate tokens
    const tokens = this.generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    logger.info(`User logged in: ${email}`);

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, tokens };
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      const payload = jwt.verify(refreshToken, this.JWT_REFRESH_SECRET) as TokenPayload;
      
      // Verify user still exists and is active
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
      });

      if (!user || !user.isActive) {
        throw new AppError('Invalid refresh token', 401);
      }

      // Generate new tokens
      return this.generateTokens({
        userId: user.id,
        email: user.email,
        role: user.role,
      });
    } catch (error) {
      throw new AppError('Invalid refresh token', 401);
    }
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new AppError('Current password is incorrect', 400);
    }

    // Hash new password
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    logger.info(`Password changed for user: ${user.email}`);
  }

  private generateTokens(payload: TokenPayload): AuthTokens {
    const accessToken = jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.ACCESS_TOKEN_EXPIRY,
    });

    const refreshToken = jwt.sign(payload, this.JWT_REFRESH_SECRET, {
      expiresIn: this.REFRESH_TOKEN_EXPIRY,
    });

    return { accessToken, refreshToken };
  }

  async verifyToken(token: string): Promise<TokenPayload> {
    try {
      return jwt.verify(token, this.JWT_SECRET) as TokenPayload;
    } catch (error) {
      throw new AppError('Invalid token', 401);
    }
  }
}
```

### Middleware Implementation

Middleware functions provide cross-cutting concerns such as authentication, authorization, validation, and error handling. These functions execute in the request-response cycle and can modify request and response objects or terminate the request cycle.

```typescript
// backend/src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { AppError } from '../utils/errors';
import { UserRole } from '@prisma/client';

const authService = new AuthService();

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: UserRole;
  };
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Access token required', 401);
    }

    const token = authHeader.substring(7);
    const payload = await authService.verifyToken(token);
    
    req.user = payload;
    next();
  } catch (error) {
    next(error);
  }
};

export const authorize = (...roles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('Insufficient permissions', 403));
    }

    next();
  };
};

// backend/src/middleware/validation.middleware.ts
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { AppError } from '../utils/errors';

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errorMessage = error.details
        .map(detail => detail.message)
        .join(', ');
      
      return next(new AppError(errorMessage, 400));
    }
    
    next();
  };
};

// Validation schemas
export const employeeValidationSchema = Joi.object({
  employeeNumber: Joi.string().required().min(3).max(20),
  firstName: Joi.string().required().min(1).max(50),
  lastName: Joi.string().required().min(1).max(50),
  middleName: Joi.string().optional().max(50),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().optional().pattern(/^\+?[\d\s\-\(\)]+$/),
  dateOfBirth: Joi.date().optional().max('now'),
  hireDate: Joi.date().required().max('now'),
  streetAddress: Joi.string().optional().max(200),
  city: Joi.string().optional().max(100),
  state: Joi.string().optional().max(100),
  postalCode: Joi.string().optional().max(20),
  country: Joi.string().optional().max(100),
});

export const salaryRecordValidationSchema = Joi.object({
  baseSalary: Joi.number().positive().required(),
  salaryType: Joi.string().valid('HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY').required(),
  effectiveDate: Joi.date().required(),
  endDate: Joi.date().optional().greater(Joi.ref('effectiveDate')),
  currency: Joi.string().length(3).default('USD'),
});
```

### Service Layer Implementation

The service layer implements the core business logic for payroll processing, employee management, and system operations. Services coordinate between different domain entities and handle complex business rules.

```typescript
// backend/src/services/employee.service.ts
import { PrismaClient, Employee, EmployeePosition, SalaryRecord } from '@prisma/client';
import { AppError } from '../utils/errors';
import { AuditService } from './audit.service';

const prisma = new PrismaClient();

export class EmployeeService {
  private auditService = new AuditService();

  async createEmployee(employeeData: {
    employeeNumber: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    email: string;
    phoneNumber?: string;
    dateOfBirth?: Date;
    hireDate: Date;
    streetAddress?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    emergencyContactRelation?: string;
    createdById: string;
  }): Promise<Employee> {
    // Check for duplicate employee number
    const existingEmployee = await prisma.employee.findUnique({
      where: { employeeNumber: employeeData.employeeNumber },
    });

    if (existingEmployee) {
      throw new AppError('Employee number already exists', 400);
    }

    // Check for duplicate email
    const existingEmail = await prisma.employee.findUnique({
      where: { email: employeeData.email },
    });

    if (existingEmail) {
      throw new AppError('Email already exists', 400);
    }

    const employee = await prisma.employee.create({
      data: employeeData,
    });

    // Create audit log
    await this.auditService.logAction({
      tableName: 'employees',
      recordId: employee.id,
      action: 'CREATE',
      newValues: employee,
      userId: employeeData.createdById,
    });

    return employee;
  }

  async updateEmployee(
    employeeId: string,
    updateData: Partial<Employee>,
    updatedById: string
  ): Promise<Employee> {
    const existingEmployee = await prisma.employee.findUnique({
      where: { id: employeeId },
    });

    if (!existingEmployee) {
      throw new AppError('Employee not found', 404);
    }

    const updatedEmployee = await prisma.employee.update({
      where: { id: employeeId },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
    });

    // Create audit log
    await this.auditService.logAction({
      tableName: 'employees',
      recordId: employeeId,
      action: 'UPDATE',
      oldValues: existingEmployee,
      newValues: updatedEmployee,
      userId: updatedById,
    });

    return updatedEmployee;
  }

  async getEmployeeById(employeeId: string): Promise<Employee | null> {
    return prisma.employee.findUnique({
      where: { id: employeeId },
      include: {
        positions: {
          include: {
            position: {
              include: {
                department: true,
              },
            },
          },
          where: { isActive: true },
        },
        salaryRecords: {
          where: { isActive: true },
          orderBy: { effectiveDate: 'desc' },
          take: 1,
        },
      },
    });
  }

  async getEmployees(params: {
    page?: number;
    limit?: number;
    search?: string;
    department?: string;
    isActive?: boolean;
  }): Promise<{
    employees: Employee[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const { page = 1, limit = 10, search, department, isActive = true } = params;
    const skip = (page - 1) * limit;

    const where: any = { isActive };

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { employeeNumber: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (department) {
      where.positions = {
        some: {
          position: {
            department: {
              name: department,
            },
          },
          isActive: true,
        },
      };
    }

    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          positions: {
            include: {
              position: {
                include: {
                  department: true,
                },
              },
            },
            where: { isActive: true },
          },
          salaryRecords: {
            where: { isActive: true },
            orderBy: { effectiveDate: 'desc' },
            take: 1,
          },
        },
      }),
      prisma.employee.count({ where }),
    ]);

    return {
      employees,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async assignPosition(
    employeeId: string,
    positionId: string,
    effectiveDate: Date,
    assignedById: string
  ): Promise<EmployeePosition> {
    // End current position if exists
    await prisma.employeePosition.updateMany({
      where: {
        employeeId,
        isActive: true,
      },
      data: {
        endDate: effectiveDate,
        isActive: false,
      },
    });

    const employeePosition = await prisma.employeePosition.create({
      data: {
        employeeId,
        positionId,
        effectiveDate,
      },
    });

    // Create audit log
    await this.auditService.logAction({
      tableName: 'employee_positions',
      recordId: employeePosition.id,
      action: 'CREATE',
      newValues: employeePosition,
      userId: assignedById,
    });

    return employeePosition;
  }

  async updateSalary(
    employeeId: string,
    salaryData: {
      baseSalary: number;
      salaryType: string;
      effectiveDate: Date;
      currency?: string;
    },
    updatedById: string
  ): Promise<SalaryRecord> {
    // End current salary record if exists
    await prisma.salaryRecord.updateMany({
      where: {
        employeeId,
        isActive: true,
      },
      data: {
        endDate: salaryData.effectiveDate,
        isActive: false,
      },
    });

    const salaryRecord = await prisma.salaryRecord.create({
      data: {
        employeeId,
        ...salaryData,
      },
    });

    // Create audit log
    await this.auditService.logAction({
      tableName: 'salary_records',
      recordId: salaryRecord.id,
      action: 'CREATE',
      newValues: salaryRecord,
      userId: updatedById,
    });

    return salaryRecord;
  }

  async deactivateEmployee(
    employeeId: string,
    terminationDate: Date,
    deactivatedById: string
  ): Promise<Employee> {
    const existingEmployee = await prisma.employee.findUnique({
      where: { id: employeeId },
    });

    if (!existingEmployee) {
      throw new AppError('Employee not found', 404);
    }

    const updatedEmployee = await prisma.employee.update({
      where: { id: employeeId },
      data: {
        isActive: false,
        terminationDate,
        updatedAt: new Date(),
      },
    });

    // End active positions and salary records
    await Promise.all([
      prisma.employeePosition.updateMany({
        where: { employeeId, isActive: true },
        data: { endDate: terminationDate, isActive: false },
      }),
      prisma.salaryRecord.updateMany({
        where: { employeeId, isActive: true },
        data: { endDate: terminationDate, isActive: false },
      }),
    ]);

    // Create audit log
    await this.auditService.logAction({
      tableName: 'employees',
      recordId: employeeId,
      action: 'UPDATE',
      oldValues: existingEmployee,
      newValues: updatedEmployee,
      userId: deactivatedById,
    });

    return updatedEmployee;
  }
}
```

The backend implementation provides a robust foundation for the salary management system with comprehensive authentication, authorization, validation, and business logic handling. The layered architecture ensures maintainability and testability while the service-oriented design promotes code reusability and separation of concerns.


## Frontend Development

### React Application Architecture

The frontend application follows a component-based architecture that promotes reusability, maintainability, and testability. The application structure is organized around feature-based modules, with shared components and utilities available across the entire application.

The component hierarchy follows React best practices with clear separation between presentational and container components. Presentational components focus on rendering UI elements and handling user interactions, while container components manage state and coordinate with backend services.

State management is handled through a combination of React's built-in state management capabilities and Redux Toolkit for complex application state. This hybrid approach provides optimal performance while maintaining predictable state updates and debugging capabilities.

```typescript
// frontend/src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';

import { store } from './store/store';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Layout } from './components/layout/Layout';

// Page imports
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import EmployeesPage from './pages/employees/EmployeesPage';
import EmployeeDetailPage from './pages/employees/EmployeeDetailPage';
import PayrollPage from './pages/payroll/PayrollPage';
import ReportsPage from './pages/reports/ReportsPage';
import SettingsPage from './pages/settings/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                }}
              />
              
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                
                <Route
                  path="/*"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Routes>
                          <Route path="/" element={<Navigate to="/dashboard" replace />} />
                          <Route path="/dashboard" element={<DashboardPage />} />
                          <Route path="/employees" element={<EmployeesPage />} />
                          <Route path="/employees/:id" element={<EmployeeDetailPage />} />
                          <Route path="/payroll" element={<PayrollPage />} />
                          <Route path="/reports" element={<ReportsPage />} />
                          <Route path="/settings" element={<SettingsPage />} />
                          <Route path="*" element={<NotFoundPage />} />
                        </Routes>
                      </Layout>
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </div>
          </Router>
        </AuthProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
```

### State Management with Redux Toolkit

Redux Toolkit provides a modern, efficient approach to state management that reduces boilerplate code while maintaining predictable state updates. The store configuration includes middleware for development tools and persistence capabilities.

```typescript
// frontend/src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import authSlice from './slices/authSlice';
import employeeSlice from './slices/employeeSlice';
import payrollSlice from './slices/payrollSlice';
import uiSlice from './slices/uiSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Only persist auth state
};

const persistedAuthReducer = persistReducer(persistConfig, authSlice);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    employees: employeeSlice,
    payroll: payrollSlice,
    ui: uiSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// frontend/src/store/slices/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authAPI } from '../../services/api/authAPI';

interface User {
  id: string;
  email: string;
  role: string;
  isActive: boolean;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const refreshAccessToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      const refreshToken = state.auth.refreshToken;
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await authAPI.refreshToken(refreshToken);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Token refresh failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    try {
      await authAPI.logout();
    } catch (error) {
      // Continue with logout even if API call fails
    } finally {
      dispatch(clearAuth());
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuth: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateTokens: (state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.tokens.accessToken;
        state.refreshToken = action.payload.tokens.refreshToken;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      // Refresh token
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(refreshAccessToken.rejected, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearAuth, clearError, updateTokens } = authSlice.actions;
export default authSlice.reducer;
```

### API Service Layer

The API service layer provides a centralized approach to handling HTTP requests with automatic token management, error handling, and request/response transformation.

```typescript
// frontend/src/services/api/apiClient.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { store } from '../../store/store';
import { refreshAccessToken, clearAuth } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';

class APIClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (error?: any) => void;
  }> = [];

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const state = store.getState();
        const token = state.auth.accessToken;
        
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            }).then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return this.client(originalRequest);
            }).catch((err) => {
              return Promise.reject(err);
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const resultAction = await store.dispatch(refreshAccessToken());
            
            if (refreshAccessToken.fulfilled.match(resultAction)) {
              const newToken = resultAction.payload.accessToken;
              this.processQueue(null, newToken);
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.client(originalRequest);
            } else {
              this.processQueue(new Error('Token refresh failed'), null);
              store.dispatch(clearAuth());
              window.location.href = '/login';
              return Promise.reject(error);
            }
          } catch (refreshError) {
            this.processQueue(refreshError, null);
            store.dispatch(clearAuth());
            window.location.href = '/login';
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        // Handle other errors
        if (error.response?.status >= 500) {
          toast.error('Server error. Please try again later.');
        } else if (error.response?.status === 403) {
          toast.error('You do not have permission to perform this action.');
        }

        return Promise.reject(error);
      }
    );
  }

  private processQueue(error: any, token: string | null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });
    
    this.failedQueue = [];
  }

  // HTTP methods
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.get(url, config);
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.post(url, data, config);
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.put(url, data, config);
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.patch(url, data, config);
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.delete(url, config);
  }
}

export const apiClient = new APIClient();

// frontend/src/services/api/employeeAPI.ts
import { apiClient } from './apiClient';

export interface Employee {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  hireDate: string;
  terminationDate?: string;
  isActive: boolean;
  streetAddress?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  positions?: any[];
  salaryRecords?: any[];
}

export interface CreateEmployeeData {
  employeeNumber: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  hireDate: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface EmployeesResponse {
  employees: Employee[];
  total: number;
  page: number;
  totalPages: number;
}

export const employeeAPI = {
  getEmployees: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    department?: string;
    isActive?: boolean;
  }) => apiClient.get<EmployeesResponse>('/employees', { params }),

  getEmployeeById: (id: string) => 
    apiClient.get<Employee>(`/employees/${id}`),

  createEmployee: (data: CreateEmployeeData) => 
    apiClient.post<Employee>('/employees', data),

  updateEmployee: (id: string, data: Partial<CreateEmployeeData>) => 
    apiClient.put<Employee>(`/employees/${id}`, data),

  deactivateEmployee: (id: string, terminationDate: string) => 
    apiClient.patch<Employee>(`/employees/${id}/deactivate`, { terminationDate }),

  assignPosition: (employeeId: string, data: {
    positionId: string;
    effectiveDate: string;
  }) => apiClient.post(`/employees/${employeeId}/positions`, data),

  updateSalary: (employeeId: string, data: {
    baseSalary: number;
    salaryType: string;
    effectiveDate: string;
    currency?: string;
  }) => apiClient.post(`/employees/${employeeId}/salary`, data),
};
```

### Component Development

React components are developed following modern patterns with hooks, TypeScript, and accessibility best practices. Components are designed to be reusable, testable, and maintainable.

```typescript
// frontend/src/components/employees/EmployeeList.tsx
import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  UserCheck,
  UserX 
} from 'lucide-react';

import { employeeAPI, Employee } from '../../services/api/employeeAPI';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Table } from '../ui/Table';
import { Badge } from '../ui/Badge';
import { DropdownMenu } from '../ui/DropdownMenu';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { EmptyState } from '../ui/EmptyState';
import { useDebounce } from '../../hooks/useDebounce';
import { formatDate, formatCurrency } from '../../utils/formatters';

interface EmployeeListProps {
  onCreateEmployee: () => void;
  onEditEmployee: (employee: Employee) => void;
  onDeactivateEmployee: (employee: Employee) => void;
}

export const EmployeeList: React.FC<EmployeeListProps> = ({
  onCreateEmployee,
  onEditEmployee,
  onDeactivateEmployee,
}) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [isActive, setIsActive] = useState<boolean | undefined>(true);

  const debouncedSearch = useDebounce(search, 300);

  const {
    data: employeesData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['employees', page, debouncedSearch, department, isActive],
    queryFn: () => employeeAPI.getEmployees({
      page,
      limit: 10,
      search: debouncedSearch,
      department,
      isActive,
    }),
    keepPreviousData: true,
  });

  const columns = useMemo(() => [
    {
      key: 'employeeNumber',
      header: 'Employee #',
      render: (employee: Employee) => (
        <Link
          to={`/employees/${employee.id}`}
          className="font-medium text-blue-600 hover:text-blue-800"
        >
          {employee.employeeNumber}
        </Link>
      ),
    },
    {
      key: 'name',
      header: 'Name',
      render: (employee: Employee) => (
        <div>
          <div className="font-medium text-gray-900">
            {`${employee.firstName} ${employee.lastName}`}
          </div>
          <div className="text-sm text-gray-500">{employee.email}</div>
        </div>
      ),
    },
    {
      key: 'position',
      header: 'Position',
      render: (employee: Employee) => {
        const currentPosition = employee.positions?.[0];
        return currentPosition ? (
          <div>
            <div className="font-medium">{currentPosition.position.title}</div>
            <div className="text-sm text-gray-500">
              {currentPosition.position.department.name}
            </div>
          </div>
        ) : (
          <span className="text-gray-400">No position assigned</span>
        );
      },
    },
    {
      key: 'salary',
      header: 'Current Salary',
      render: (employee: Employee) => {
        const currentSalary = employee.salaryRecords?.[0];
        return currentSalary ? (
          <div>
            <div className="font-medium">
              {formatCurrency(currentSalary.baseSalary, currentSalary.currency)}
            </div>
            <div className="text-sm text-gray-500 capitalize">
              {currentSalary.salaryType.toLowerCase()}
            </div>
          </div>
        ) : (
          <span className="text-gray-400">No salary set</span>
        );
      },
    },
    {
      key: 'hireDate',
      header: 'Hire Date',
      render: (employee: Employee) => formatDate(employee.hireDate),
    },
    {
      key: 'status',
      header: 'Status',
      render: (employee: Employee) => (
        <Badge
          variant={employee.isActive ? 'success' : 'secondary'}
          icon={employee.isActive ? UserCheck : UserX}
        >
          {employee.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (employee: Employee) => (
        <DropdownMenu
          trigger={
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          }
          items={[
            {
              label: 'Edit',
              icon: Edit,
              onClick: () => onEditEmployee(employee),
            },
            {
              label: employee.isActive ? 'Deactivate' : 'Activate',
              icon: employee.isActive ? UserX : UserCheck,
              onClick: () => onDeactivateEmployee(employee),
              variant: employee.isActive ? 'destructive' : 'default',
            },
          ]}
        />
      ),
    },
  ], [onEditEmployee, onDeactivateEmployee]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Failed to load employees</p>
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>
    );
  }

  const employees = employeesData?.data.employees || [];
  const total = employeesData?.data.total || 0;
  const totalPages = employeesData?.data.totalPages || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
          <p className="text-gray-600">Manage your organization's employees</p>
        </div>
        <Button onClick={onCreateEmployee} icon={Plus}>
          Add Employee
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={Search}
          />
        </div>
        <Select
          placeholder="All Departments"
          value={department}
          onChange={setDepartment}
          options={[
            { value: '', label: 'All Departments' },
            { value: 'Information Technology', label: 'Information Technology' },
            { value: 'Human Resources', label: 'Human Resources' },
            { value: 'Finance', label: 'Finance' },
            { value: 'Marketing', label: 'Marketing' },
          ]}
        />
        <Select
          placeholder="Status"
          value={isActive?.toString() || ''}
          onChange={(value) => setIsActive(value === '' ? undefined : value === 'true')}
          options={[
            { value: '', label: 'All Status' },
            { value: 'true', label: 'Active' },
            { value: 'false', label: 'Inactive' },
          ]}
        />
      </div>

      {/* Table */}
      {employees.length > 0 ? (
        <div className="bg-white rounded-lg shadow">
          <Table
            columns={columns}
            data={employees}
            pagination={{
              currentPage: page,
              totalPages,
              totalItems: total,
              onPageChange: setPage,
            }}
          />
        </div>
      ) : (
        <EmptyState
          title="No employees found"
          description="Get started by adding your first employee"
          action={{
            label: 'Add Employee',
            onClick: onCreateEmployee,
            icon: Plus,
          }}
        />
      )}
    </div>
  );
};
```

### Custom Hooks

Custom hooks encapsulate reusable logic and provide clean interfaces for common functionality such as API calls, form handling, and state management.

```typescript
// frontend/src/hooks/useEmployees.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { employeeAPI, Employee, CreateEmployeeData } from '../services/api/employeeAPI';

export const useEmployees = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  department?: string;
  isActive?: boolean;
}) => {
  return useQuery({
    queryKey: ['employees', params],
    queryFn: () => employeeAPI.getEmployees(params),
    keepPreviousData: true,
  });
};

export const useEmployee = (id: string) => {
  return useQuery({
    queryKey: ['employee', id],
    queryFn: () => employeeAPI.getEmployeeById(id),
    enabled: !!id,
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEmployeeData) => employeeAPI.createEmployee(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Employee created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create employee');
    },
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateEmployeeData> }) =>
      employeeAPI.updateEmployee(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['employee', id] });
      toast.success('Employee updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update employee');
    },
  });
};

// frontend/src/hooks/useDebounce.ts
import { useState, useEffect } from 'react';

export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// frontend/src/hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';

export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};
```

The frontend implementation provides a modern, responsive user interface built with React and TypeScript. The component architecture promotes reusability and maintainability while the state management approach ensures predictable data flow and optimal performance. The API service layer provides robust error handling and automatic token management for seamless user experience.


## Testing Strategy

### Backend Testing Implementation

Comprehensive testing ensures the reliability and maintainability of the salary management system. The testing strategy encompasses unit tests, integration tests, and end-to-end tests that cover critical business logic and user workflows.

```typescript
// backend/tests/services/employee.service.test.ts
import { PrismaClient } from '@prisma/client';
import { EmployeeService } from '../../src/services/employee.service';
import { AppError } from '../../src/utils/errors';

// Mock Prisma client
jest.mock('@prisma/client');
const mockPrisma = new PrismaClient() as jest.Mocked<PrismaClient>;

describe('EmployeeService', () => {
  let employeeService: EmployeeService;

  beforeEach(() => {
    employeeService = new EmployeeService();
    jest.clearAllMocks();
  });

  describe('createEmployee', () => {
    const mockEmployeeData = {
      employeeNumber: 'EMP001',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      hireDate: new Date('2023-01-15'),
      createdById: 'user-123',
    };

    it('should create employee successfully', async () => {
      const mockCreatedEmployee = {
        id: 'emp-123',
        ...mockEmployeeData,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.employee.findUnique.mockResolvedValue(null);
      mockPrisma.employee.create.mockResolvedValue(mockCreatedEmployee);

      const result = await employeeService.createEmployee(mockEmployeeData);

      expect(mockPrisma.employee.findUnique).toHaveBeenCalledTimes(2);
      expect(mockPrisma.employee.create).toHaveBeenCalledWith({
        data: mockEmployeeData,
      });
      expect(result).toEqual(mockCreatedEmployee);
    });

    it('should throw error for duplicate employee number', async () => {
      mockPrisma.employee.findUnique.mockResolvedValueOnce({
        id: 'existing-emp',
        employeeNumber: 'EMP001',
      } as any);

      await expect(employeeService.createEmployee(mockEmployeeData))
        .rejects
        .toThrow(new AppError('Employee number already exists', 400));
    });

    it('should throw error for duplicate email', async () => {
      mockPrisma.employee.findUnique
        .mockResolvedValueOnce(null) // First call for employee number
        .mockResolvedValueOnce({ // Second call for email
          id: 'existing-emp',
          email: 'john.doe@example.com',
        } as any);

      await expect(employeeService.createEmployee(mockEmployeeData))
        .rejects
        .toThrow(new AppError('Email already exists', 400));
    });
  });

  describe('getEmployees', () => {
    it('should return paginated employees with search', async () => {
      const mockEmployees = [
        {
          id: 'emp-1',
          employeeNumber: 'EMP001',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
        },
      ];

      mockPrisma.employee.findMany.mockResolvedValue(mockEmployees as any);
      mockPrisma.employee.count.mockResolvedValue(1);

      const result = await employeeService.getEmployees({
        page: 1,
        limit: 10,
        search: 'John',
      });

      expect(result).toEqual({
        employees: mockEmployees,
        total: 1,
        page: 1,
        totalPages: 1,
      });

      expect(mockPrisma.employee.findMany).toHaveBeenCalledWith({
        where: {
          isActive: true,
          OR: [
            { firstName: { contains: 'John', mode: 'insensitive' } },
            { lastName: { contains: 'John', mode: 'insensitive' } },
            { employeeNumber: { contains: 'John', mode: 'insensitive' } },
            { email: { contains: 'John', mode: 'insensitive' } },
          ],
        },
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: expect.any(Object),
      });
    });
  });
});

// backend/tests/routes/employee.routes.test.ts
import request from 'supertest';
import app from '../../src/app';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

jest.mock('@prisma/client');
const mockPrisma = new PrismaClient() as jest.Mocked<PrismaClient>;

describe('Employee Routes', () => {
  const mockUser = {
    userId: 'user-123',
    email: 'admin@example.com',
    role: 'ADMIN',
  };

  const mockToken = jwt.sign(mockUser, process.env.JWT_SECRET!, { expiresIn: '1h' });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/employees', () => {
    const validEmployeeData = {
      employeeNumber: 'EMP001',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      hireDate: '2023-01-15',
    };

    it('should create employee with valid data', async () => {
      const mockCreatedEmployee = {
        id: 'emp-123',
        ...validEmployeeData,
        hireDate: new Date(validEmployeeData.hireDate),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.employee.findUnique.mockResolvedValue(null);
      mockPrisma.employee.create.mockResolvedValue(mockCreatedEmployee);

      const response = await request(app)
        .post('/api/employees')
        .set('Authorization', `Bearer ${mockToken}`)
        .send(validEmployeeData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.employeeNumber).toBe(validEmployeeData.employeeNumber);
    });

    it('should return 400 for invalid data', async () => {
      const invalidData = {
        firstName: 'John',
        // Missing required fields
      };

      const response = await request(app)
        .post('/api/employees')
        .set('Authorization', `Bearer ${mockToken}`)
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('required');
    });

    it('should return 401 without authentication', async () => {
      await request(app)
        .post('/api/employees')
        .send(validEmployeeData)
        .expect(401);
    });
  });
});
```

### Frontend Testing Implementation

Frontend testing focuses on component behavior, user interactions, and integration with backend services. The testing approach combines unit tests for individual components and integration tests for complete user workflows.

```typescript
// frontend/src/components/employees/__tests__/EmployeeList.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import { EmployeeList } from '../EmployeeList';
import { employeeAPI } from '../../../services/api/employeeAPI';
import authSlice from '../../../store/slices/authSlice';

// Mock API
jest.mock('../../../services/api/employeeAPI');
const mockEmployeeAPI = employeeAPI as jest.Mocked<typeof employeeAPI>;

// Test utilities
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const createTestStore = () => configureStore({
  reducer: {
    auth: authSlice,
  },
  preloadedState: {
    auth: {
      user: { id: '1', email: 'test@example.com', role: 'ADMIN', isActive: true },
      accessToken: 'mock-token',
      refreshToken: 'mock-refresh-token',
      isAuthenticated: true,
      isLoading: false,
      error: null,
    },
  },
});

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = createTestQueryClient();
  const store = createTestStore();

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  );
};

describe('EmployeeList', () => {
  const mockProps = {
    onCreateEmployee: jest.fn(),
    onEditEmployee: jest.fn(),
    onDeactivateEmployee: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders employee list successfully', async () => {
    const mockEmployees = [
      {
        id: '1',
        employeeNumber: 'EMP001',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        hireDate: '2023-01-15',
        isActive: true,
        positions: [{
          position: {
            title: 'Software Developer',
            department: { name: 'IT' },
          },
        }],
        salaryRecords: [{
          baseSalary: 75000,
          currency: 'USD',
          salaryType: 'YEARLY',
        }],
      },
    ];

    mockEmployeeAPI.getEmployees.mockResolvedValue({
      data: {
        employees: mockEmployees,
        total: 1,
        page: 1,
        totalPages: 1,
      },
    } as any);

    render(
      <TestWrapper>
        <EmployeeList {...mockProps} />
      </TestWrapper>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('EMP001')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
      expect(screen.getByText('Software Developer')).toBeInTheDocument();
      expect(screen.getByText('$75,000')).toBeInTheDocument();
    });
  });

  it('handles search functionality', async () => {
    mockEmployeeAPI.getEmployees.mockResolvedValue({
      data: { employees: [], total: 0, page: 1, totalPages: 1 },
    } as any);

    render(
      <TestWrapper>
        <EmployeeList {...mockProps} />
      </TestWrapper>
    );

    const searchInput = screen.getByPlaceholderText('Search employees...');
    fireEvent.change(searchInput, { target: { value: 'John' } });

    await waitFor(() => {
      expect(mockEmployeeAPI.getEmployees).toHaveBeenCalledWith(
        expect.objectContaining({
          search: 'John',
        })
      );
    }, { timeout: 500 }); // Account for debounce
  });

  it('calls onCreateEmployee when add button is clicked', () => {
    mockEmployeeAPI.getEmployees.mockResolvedValue({
      data: { employees: [], total: 0, page: 1, totalPages: 1 },
    } as any);

    render(
      <TestWrapper>
        <EmployeeList {...mockProps} />
      </TestWrapper>
    );

    const addButton = screen.getByText('Add Employee');
    fireEvent.click(addButton);

    expect(mockProps.onCreateEmployee).toHaveBeenCalled();
  });
});

// frontend/src/hooks/__tests__/useEmployees.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEmployees, useCreateEmployee } from '../useEmployees';
import { employeeAPI } from '../../services/api/employeeAPI';

jest.mock('../../services/api/employeeAPI');
const mockEmployeeAPI = employeeAPI as jest.Mocked<typeof employeeAPI>;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useEmployees', () => {
  it('fetches employees successfully', async () => {
    const mockResponse = {
      data: {
        employees: [{ id: '1', firstName: 'John', lastName: 'Doe' }],
        total: 1,
        page: 1,
        totalPages: 1,
      },
    };

    mockEmployeeAPI.getEmployees.mockResolvedValue(mockResponse as any);

    const { result } = renderHook(() => useEmployees(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.data.employees).toHaveLength(1);
    expect(mockEmployeeAPI.getEmployees).toHaveBeenCalled();
  });
});
```

## Deployment and DevOps

### Production Environment Setup

The production deployment strategy emphasizes reliability, scalability, and security through containerization, orchestration, and comprehensive monitoring. The deployment architecture supports both cloud and on-premises environments with automated scaling and failover capabilities.

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backup:/backup
    ports:
      - "5432:5432"
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 30s
      timeout: 10s
      retries: 3

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "--raw", "incr", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
      - REDIS_URL=redis://:${REDIS_PASSWORD}@redis:6379
      - JWT_SECRET=${JWT_SECRET}
      - JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
      - SESSION_SECRET=${SESSION_SECRET}
    ports:
      - "5000:5000"
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./ssl:/etc/ssl/certs
    depends_on:
      - backend
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl/certs
    depends_on:
      - backend
      - frontend
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

### CI/CD Pipeline Implementation

Continuous integration and deployment pipelines ensure code quality, automated testing, and reliable deployments. The pipeline includes multiple stages for testing, security scanning, and deployment across different environments.

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '18'
  POSTGRES_VERSION: '14'

jobs:
  test-backend:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
      
      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379

    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json
      
      - name: Install dependencies
        working-directory: ./backend
        run: npm ci
      
      - name: Run linting
        working-directory: ./backend
        run: npm run lint
      
      - name: Run type checking
        working-directory: ./backend
        run: npm run type-check
      
      - name: Run database migrations
        working-directory: ./backend
        run: npm run db:migrate
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
      
      - name: Run tests
        working-directory: ./backend
        run: npm run test:coverage
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
          REDIS_URL: redis://localhost:6379
          JWT_SECRET: test-secret
          JWT_REFRESH_SECRET: test-refresh-secret
          SESSION_SECRET: test-session-secret
      
      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          file: ./backend/coverage/lcov.info
          flags: backend

  test-frontend:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      
      - name: Install dependencies
        working-directory: ./frontend
        run: npm ci
      
      - name: Run linting
        working-directory: ./frontend
        run: npm run lint
      
      - name: Run type checking
        working-directory: ./frontend
        run: npm run type-check
      
      - name: Run tests
        working-directory: ./frontend
        run: npm run test:coverage
      
      - name: Build application
        working-directory: ./frontend
        run: npm run build
        env:
          VITE_API_BASE_URL: https://api.salarywebapp.com
      
      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          file: ./frontend/coverage/lcov.info
          flags: frontend

  security-scan:
    runs-on: ubuntu-latest
    needs: [test-backend, test-frontend]
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          format: 'sarif'
          output: 'trivy-results.sarif'
      
      - name: Upload Trivy scan results
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: 'trivy-results.sarif'

  deploy-staging:
    runs-on: ubuntu-latest
    needs: [test-backend, test-frontend, security-scan]
    if: github.ref == 'refs/heads/develop'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to staging
        run: |
          echo "Deploying to staging environment"
          # Add deployment commands here

  deploy-production:
    runs-on: ubuntu-latest
    needs: [test-backend, test-frontend, security-scan]
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to production
        run: |
          echo "Deploying to production environment"
          # Add deployment commands here
```

## Maintenance and Monitoring

### Application Monitoring

Comprehensive monitoring ensures system reliability and provides insights into application performance, user behavior, and potential issues. The monitoring strategy includes application metrics, infrastructure monitoring, and user experience tracking.

```typescript
// backend/src/utils/monitoring.ts
import winston from 'winston';
import { Request, Response, NextFunction } from 'express';

// Logger configuration
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'salary-web-backend' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Performance monitoring middleware
export const performanceMonitoring = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logData = {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
    };
    
    if (res.statusCode >= 400) {
      logger.error('HTTP Error', logData);
    } else {
      logger.info('HTTP Request', logData);
    }
    
    // Send metrics to monitoring service
    if (process.env.MONITORING_ENDPOINT) {
      // Implementation for external monitoring service
    }
  });
  
  next();
};

// Health check endpoint
export const healthCheck = async (req: Request, res: Response) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version,
    environment: process.env.NODE_ENV,
  };
  
  try {
    // Check database connection
    // Check Redis connection
    // Check external services
    
    res.json(health);
  } catch (error) {
    logger.error('Health check failed', error);
    res.status(503).json({
      ...health,
      status: 'unhealthy',
      error: error.message,
    });
  }
};
```

### Database Maintenance

Regular database maintenance ensures optimal performance and data integrity. The maintenance strategy includes automated backups, performance optimization, and data archival procedures.

```bash
#!/bin/bash
# scripts/db-maintenance.sh

# Database backup script
backup_database() {
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_file="backup/salary_web_backup_${timestamp}.sql"
    
    echo "Creating database backup: ${backup_file}"
    pg_dump $DATABASE_URL > $backup_file
    
    # Compress backup
    gzip $backup_file
    
    # Upload to cloud storage
    aws s3 cp "${backup_file}.gz" s3://salary-web-backups/
    
    # Clean up old local backups (keep last 7 days)
    find backup/ -name "*.sql.gz" -mtime +7 -delete
    
    echo "Backup completed successfully"
}

# Database optimization
optimize_database() {
    echo "Running database optimization..."
    
    # Update table statistics
    psql $DATABASE_URL -c "ANALYZE;"
    
    # Reindex tables
    psql $DATABASE_URL -c "REINDEX DATABASE salary_web_prod;"
    
    # Vacuum tables
    psql $DATABASE_URL -c "VACUUM ANALYZE;"
    
    echo "Database optimization completed"
}

# Archive old data
archive_old_data() {
    echo "Archiving old payroll records..."
    
    # Archive payroll records older than 7 years
    local archive_date=$(date -d '7 years ago' +%Y-%m-%d)
    
    psql $DATABASE_URL << EOF
    -- Create archive table if not exists
    CREATE TABLE IF NOT EXISTS payroll_records_archive (LIKE payroll_records INCLUDING ALL);
    
    -- Move old records to archive
    WITH archived_records AS (
        DELETE FROM payroll_records 
        WHERE pay_date < '$archive_date'
        RETURNING *
    )
    INSERT INTO payroll_records_archive SELECT * FROM archived_records;
EOF
    
    echo "Data archival completed"
}

# Main execution
case "$1" in
    backup)
        backup_database
        ;;
    optimize)
        optimize_database
        ;;
    archive)
        archive_old_data
        ;;
    all)
        backup_database
        optimize_database
        archive_old_data
        ;;
    *)
        echo "Usage: $0 {backup|optimize|archive|all}"
        exit 1
        ;;
esac
```

This comprehensive implementation guide provides detailed instructions for developing a modern, scalable salary management web application. The guide covers all aspects from initial setup through production deployment and ongoing maintenance, ensuring developers have the knowledge and tools necessary to build a robust payroll system that meets enterprise requirements.

The implementation approach emphasizes security, performance, and maintainability while following industry best practices for web application development. The modular architecture and comprehensive testing strategy ensure the application can evolve with changing business requirements while maintaining reliability and user satisfaction.

## References

[1] Paylocity - Payroll Software Features: https://www.paylocity.com/resources/learn/articles/payroll-software-features/
[2] People Managing People - Payroll Software Features: https://peoplemanagingpeople.com/payroll-compensation/payroll-software-features/
[3] Medium - Software Architecture Snippets: Payroll App: https://medium.com/pythoneers/software-architecture-snippets-payroll-app-9626d0552cfa
[4] GitHub - MERN Employee Salary Management: https://github.com/berthutapea/mern-employee-salary-management
[5] Springer - Web-based Payroll Management System: https://link.springer.com/article/10.1186/s43067-023-00082-5

