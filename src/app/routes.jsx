import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { RegisterPage } from "../features/auth/RegisterPage";
import { CustomerRegistration } from "../features/auth/CustomerRegistration";
import { ExpertRegistration } from "../features/auth/ExpertRegistration";
import CustomerDashboard from "../pages/CustomerDashboard";
import ExpertDashboard from "../pages/ExpertDashboard";

// Role-Based Router Component
const RoleBasedDashboard = () => {
  const savedUser = localStorage.getItem("user");
  const user = savedUser ? JSON.parse(savedUser) : null;

  // Strict role check
  if (user?.role === "Expert") {
    return <ExpertDashboard />;
  }

  if (user?.role === "Customer") {
    return <CustomerDashboard />;
  }

  // If no user/role is found, redirect to registration
  return <Navigate to="/register" replace />;
};

// Protected Route Wrapper for Specific Path Access
const ProtectedRoute = ({ allowedRole, children }) => {
  const savedUser = localStorage.getItem("user");
  const user = savedUser ? JSON.parse(savedUser) : null;

  if (!user || user.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Dynamic Root Route based strictly on Role */}
        <Route path="/" element={<RoleBasedDashboard />} />

        {/* Role-Protected Explicit Dashboard Routes */}
        <Route
          path="/customer-dashboard"
          element={
            <ProtectedRoute allowedRole="Customer">
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/expert-dashboard"
          element={
            <ProtectedRoute allowedRole="Expert">
              <ExpertDashboard />
            </ProtectedRoute>
          }
        />

        {/* Auth Routes */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register/customer" element={<CustomerRegistration />} />
        <Route path="/register/expert" element={<ExpertRegistration />} />

        {/* Catch-all Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
