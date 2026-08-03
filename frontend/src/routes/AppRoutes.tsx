import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import NotFound from "../pages/NotFound";
import AccessDenied from "../pages/AccessDenied";

import AdminLayout from "../layouts/AdminLayout";
import UserLayout from "../layouts/UserLayout";
import ProtectedRoute from "./ProtectedRoute";

import Dashboard from "../pages/admin/Dashboard";
import PublisherDashboard from "../pages/admin/PublisherDashboard";
import Books from "../pages/admin/Books";
import Authors from "../pages/admin/Authors";
import Categories from "../pages/admin/Categories";
import Users from "../pages/admin/Users";
import BorrowRecords from "../pages/admin/BorrowRecords";
import Settings from "../pages/admin/Settings";
import BookContentEditor from "../pages/admin/BookContentEditor";

import Home from "../pages/user/Home";
import Browse from "../pages/user/Browse";
import MyBooks from "../pages/user/MyBooks";
import Profile from "../pages/user/Profile";
import BookReader from "../pages/user/BookReader";
import { useAuth } from "../context/AuthContext";

function AdminIndexRedirect() {
  const { isAdmin } = useAuth();
  return isAdmin ? <Dashboard /> : <PublisherDashboard />;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Navigate to="/user" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/403" element={<AccessDenied />} />

        {/* Management panel — admin (full access) and publisher (own books/borrows/settings only) */}
        <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminIndexRedirect />} />
          <Route path="books" element={<Books />} />
          <Route path="books/:id/content" element={<BookContentEditor />} />
          <Route path="authors" element={<Authors />} />
          <Route path="categories" element={<Categories />} />
          <Route path="users" element={<ProtectedRoute requireSuperAdmin><Users /></ProtectedRoute>} />
          <Route path="borrow" element={<BorrowRecords />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* User area — browsing is public (no login wall). Only My Books & Profile require an account. */}
        <Route path="/user" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="browse" element={<Browse />} />
          <Route path="read/:id" element={<BookReader />} />
          <Route path="my-books" element={<ProtectedRoute><MyBooks /></ProtectedRoute>} />
          <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
