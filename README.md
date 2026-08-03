# 📚 Library Management System

![Java 17](https://img.shields.io/badge/Java-17-orange?logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3-brightgreen?logo=springboot)
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?logo=mysql)
![Docker](https://img.shields.io/badge/Docker-Ready-cyan?logo=docker)
![License](https://img.shields.io/badge/License-MIT-green)

A full-stack, enterprise-grade **Library Management System** designed for managing library operations, digital book reading, publisher content management, and user borrowing records.

Built with **Spring Boot 3**, **React 18 (TypeScript + Material UI)**, and **MySQL**, fully dockerized for containerized deployment.

---

## 🌟 Key Features

### 👑 Admin Panel
- **Master Management**: Manage all books, categories, authors, users, and borrowing transactions.
- **Role Assignment**: Elevate accounts and manage user permissions.
- **System Settings**: Control master configuration and super-admin credentials.

### 🏢 Publisher Panel
- **Publisher Dashboard**: Dedicated workspace for publishers to upload, edit, and manage books.
- **Publisher Data Isolation**: Publishers strictly see and manage only their own created books, categories, and authors.
- **Payment Setup**: Upload custom UPI ID and payment QR code for monetized titles.

### 📖 Reader / User Portal
- **Browse & Filter**: Search books by title, author, category, or real-time availability.
- **In-App PDF Reader**: View digital book PDFs directly in the browser with page controls.
- **Book Issuing & Return**: Request and return books with automated availability updates.
- **Direct UPI Payments**: Pay for premium titles directly to the publisher's QR code.

### 🔐 Security & Authentication
- **JWT Security**: 24-hour token expiration with automatic redirection on expiry.
- **Role-Based Access Control (RBAC)**: Strict authorization for `ADMIN`, `PUBLISHER`, and `USER`.

---

## 🌐 Backend REST Controllers API Reference

The backend provides **11 REST Controllers** handling all application modules:

| Controller | Base Path | Roles | Description |
| :--- | :--- | :--- | :--- |
| **`AuthController`** | `/auth` | Public | Signup (`/register`) and Login (`/login`) with JWT generation |
| **`BookController`** | `/books` | `USER`, `PUBLISHER`, `ADMIN` | Book CRUD operations, search, and publisher-isolated book listing |
| **`BookDetailController`** | `/books` | `PUBLISHER`, `ADMIN`, `USER` | Digital PDF content upload and reader endpoint |
| **`AuthorController`** | `/authors` | `ADMIN`, `PUBLISHER`, `USER` | Author management for Admins & Publishers |
| **`CategoryController`** | `/categories` | `ADMIN`, `PUBLISHER`, `USER` | Category creation and isolated publisher category listings |
| **`UserController`** | `/users` | `ADMIN`, `PUBLISHER`, `USER` | User profiles, role updates, and publisher UPI/QR setup |
| **`BorrowRecordController`** | `/borrow-records` | `USER`, `PUBLISHER`, `ADMIN` | Issue books, return books, and user borrowing logs |
| **`DashboardController`** | `/dashboard` | `ADMIN`, `PUBLISHER` | Summary statistics (books, users, authors, borrows) |
| **`PaymentConfigController`** | `/payment-config` | `USER`, `PUBLISHER` | Fetch UPI ID and QR code for paid books |
| **`AiAssistantController`** | `/ai` | `USER`, `PUBLISHER` | OpenAI AI Reading Assistant Integration |
| **`HomeController`** | `/` | Public | API health check status |

---

## 🔑 Default Admin Credentials

The Spring Boot backend automatically seeds a master admin account on initial launch:

- **Email**: `leader@gmail.com`
- **Password**: `Kshitiz977@`

---

## ⚙️ Environment Variables (Cloud / Render Deployment)

Configure the following environment variables when deploying on **Render**, **Railway**, or **Docker**:

```ini
# Database Configuration
SPRING_DATASOURCE_URL=jdbc:mysql://<your-db-host>:3306/library_db
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=your_password

# Application Settings
SPRING_PROFILES_ACTIVE=prod
OPENAI_API_KEY=your_openai_api_key

# Frontend Environment Variable
VITE_API_URL=https://your-backend-api.onrender.com
```

---

## 🚀 Quick Start

### Option 1: Run with Docker Compose

```bash
cd library-management-system
docker-compose up -d --build
```

- **Backend API**: `http://localhost:8080`
- **MySQL DB Port**: `3307` (mapped to `3306`)

---

### Option 2: Run Locally

#### 1. Backend (Spring Boot)
```bash
cd library-management-system
mvn clean package -DskipTests
mvn spring-boot:run
```

#### 2. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```

App will run on `http://localhost:5173`.

---

## 📁 Repository Structure

```
library-management-system/
├── frontend/                     # React + TypeScript + Vite Frontend
│   ├── src/                      # Pages, Components, Services, Context, Types
│   ├── package.json
│   └── vite.config.ts
├── library-management-system/    # Spring Boot Backend
│   ├── src/main/java/            # Controllers, Entities, Services, Security
│   ├── src/main/resources/       # application.properties & data.sql
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── pom.xml
├── .gitignore                    # Git Exclusion Rules
└── README.md                     # Documentation
```
