# 📚 Library Management System

A full-stack web application designed for managing library operations, digital book reading, publisher content management, and user borrowing records.

Built with **Spring Boot 3**, **React 18 (TypeScript + Material UI)**, and **MySQL**, fully dockerized for containerized deployment.

---

## ✨ Features

### 👑 Admin Panel
- **Master Management**: Full control over books, categories, authors, users, and borrowing logs.
- **System Settings**: Manage system credentials and super-admin configuration.

### 🏢 Publisher Panel
- **Publisher Dashboard**: Dedicated workspace for publishers to upload, edit, and publish books.
- **Data Isolation**: Each publisher strictly sees and manages only their own uploaded content, categories, and authors.
- **Payment Setup**: Upload custom UPI ID and payment QR codes for paid books.

### 📖 Reader / User Portal
- **Browse & Search**: Filter books by title, author, category, or availability.
- **In-App PDF Reader**: Read digital book PDFs directly in the browser with full page control.
- **Book Issuing & Return**: Request and return books with automated availability tracking.
- **Direct UPI Payments**: Pay for premium books directly to the publisher's QR code.

### 🔐 Security & Auth
- **JWT Authentication**: Secure token-based authentication with 24-hour expiration.
- **Role-Based Access Control (RBAC)**: Enforced endpoints for `ADMIN`, `PUBLISHER`, and `USER`.

---

## 🛠️ Tech Stack

- **Backend**: Java 17, Spring Boot 3, Spring Security, Spring Data JPA, JWT, Hibernate
- **Frontend**: React 18, TypeScript, Vite, Material-UI (MUI), Axios, React Router
- **Database**: MySQL 8.0
- **Containerization**: Docker, Docker Compose

---

## 🔑 Default Admin Account

The backend automatically bootstraps the master admin account on initial launch:

- **Email**: `leader@gmail.com`
- **Password**: `Kshitiz977@`

---

## 🚀 Quick Start (Docker)

Run the entire system (Spring Boot + MySQL) with Docker Compose:

```bash
cd library-management-system
docker-compose up -d --build
```

- **Frontend API URL**: `http://localhost:8080`
- **MySQL Database Port**: `3307` (mapped to `3306`)

---

## 💻 Local Development

### 1. Backend Setup
```bash
cd library-management-system
mvn clean package -DskipTests
mvn spring-boot:run
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

---

## 📁 Project Structure

```
├── frontend/                     # React + TypeScript + Vite Frontend
│   ├── src/                      # UI Components, Pages, Context, Services
│   ├── package.json
│   └── vite.config.ts
├── library-management-system/    # Spring Boot Backend
│   ├── src/main/java/            # Controllers, Entities, Services, Security
│   ├── src/main/resources/       # application.properties & data.sql
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── pom.xml
├── .gitignore                    # Git Ignore Configuration
└── README.md                     # Documentation
```
