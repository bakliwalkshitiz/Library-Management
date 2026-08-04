# 📚 Library Management System

A full-stack web application for managing library operations, digital book reading, publisher content management, and user borrowing records.

Built with **Spring Boot 3** on the backend and **React 18 (TypeScript)** on the frontend with **MySQL** database.

---

## 💡 About The Project

This Library Management System supports three distinct user roles:

1. **Admin**: Has full access to manage all books, categories, authors, users, and borrowing records.
2. **Publisher**: Dedicated panel where publishers can create and manage their own books, authors, and categories, as well as set up UPI payment details for paid books.
3. **User / Reader**: Can browse available books, read digital PDFs directly in the browser, issue/return books, and make payments for premium books.

---

## ⚡ Key Features

- **🔐 Authentication & Security**: JWT-based login with 24-hour token expiration and role-based access control (`ADMIN`, `PUBLISHER`, `USER`).
- **📖 In-App PDF Reader**: View digital book PDFs directly inside the app with smooth page navigation.
- **🏢 Publisher Isolation**: Publishers only see and manage their own created books, authors, and categories.
- **💳 Payment Integration**: Support for paid books with custom UPI ID and QR code payment upload.
- **🤖 AI Reading Assistant**: OpenAI integration for book summaries and reader Q&A.
- **📊 Interactive Dashboards**: Live counters and statistics for Admin and Publisher panels.

---

## 🛠️ Tech Stack

### Backend
- **Framework**: Java 17, Spring Boot 3.3
- **Security**: Spring Security + JWT
- **Database & ORM**: MySQL 8.0, Spring Data JPA / Hibernate
- **Build Tool**: Maven

### Frontend
- **Framework**: React 18, TypeScript, Vite
- **UI Library**: Material UI (MUI), Lucide Icons, Tailwind CSS
- **HTTP Client**: Axios with JWT Interceptors

---

## 🔑 Default Login Credentials

When the backend starts for the first time, a master admin account is automatically created:

- **Email**: `leader@gmail.com`
- **Password**: `Kshitiz977@`
- **Role**: `ADMIN`

---

## 🚀 How to Run Locally

### Prerequisites
Make sure you have installed:
- **Java 17** or higher
- **Node.js** (v18 or higher)
- **MySQL Database** (running locally on port `3306`)

---

### Step 1: Set Up MySQL Database

Ensure your local MySQL server is running. The application will automatically create the database `library_db` on launch.

- **Host**: `localhost:3306`
- **Database Name**: `library_db`
- **Default Username**: `root`
- **Default Password**: `Bakliwal@mysql` *(update in `application-dev.properties` if your password is different)*

---

### Step 2: Start the Backend (Spring Boot)

Open a terminal and run:

```bash
cd library-management-system
./mvnw spring-boot:run
```

The backend server will start at: **`http://localhost:8080`**

---

### Step 3: Start the Frontend (React + Vite)

Open a second terminal and run:

```bash
cd frontend
npm install
npm run dev
```

The frontend application will start at: **`http://localhost:5173`**

Open your browser and navigate to **`http://localhost:5173`**.

---

## 📡 API Endpoints Summary

Below is a simple overview of the main backend API controllers:

| Controller | Route | Description |
| :--- | :--- | :--- |
| **`AuthController`** | `/auth` | User registration (`/register`) and login (`/login`) |
| **`BookController`** | `/books` | Search, filter, add, edit, and delete books |
| **`BookDetailController`** | `/books` | Upload and fetch digital PDF content |
| **`AuthorController`** | `/authors` | Manage authors for books |
| **`CategoryController`** | `/categories` | Manage book categories |
| **`UserController`** | `/users` | Manage user profiles and roles |
| **`BorrowRecordController`** | `/borrow-records` | Issue, return, and track borrowed books |
| **`DashboardController`** | `/dashboard` | Fetch summary stats for Admin/Publisher |
| **`PaymentConfigController`** | `/payment-config` | Manage UPI & QR payment settings |
| **`AiAssistantController`** | `/ai` | AI-powered reading assistant endpoint |

---

## 📁 Folder Structure

```
library-management-system/
├── frontend/                     # React Vite Frontend App
│   ├── src/                      # Components, Pages, API, Context
│   └── package.json
├── library-management-system/    # Spring Boot Backend App
│   ├── src/main/java/            # Controllers, Entities, Services, Security
│   ├── src/main/resources/       # Configuration properties & initial data
│   ├── Dockerfile
│   └── pom.xml
├── .gitignore                    # Git ignore file
└── README.md                     # Documentation
```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
