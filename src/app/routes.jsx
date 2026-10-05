import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { RegisterPage } from "../features/auth/RegisterPage";
import { CustomerRegistration } from "../features/auth/CustomerRegistration";
import { ExpertRegistration } from "../features/auth/ExpertRegistration";
import CustomerDashboard from "../pages/CustomerDashboard";
import ExpertDashboard from "../pages/ExpertDashboard";
import { LoginPage } from "../features/auth/LoginPage";
import ROUTES from "../routes/routePaths";
import { ProtectedRoute } from "../routes/ProtectedRoute";
import { SessionManager } from "../components/session/SessionManager"
import { HomePage } from "../features/public/HomePage";
import { ExpertsPage } from "../features/public/ExpertsPage";
import { ExpertProfilePage } from "../features/public/ExpertsProfilePage";
import { ExpertsLandingPage } from "../features/public/ExpertsLandingPage";

// Role-Based Router Component
// const RoleBasedDashboard = () => {
//   const savedUser = localStorage.getItem("user");
//   const user = savedUser ? JSON.parse(savedUser) : null;

//   // Strict role check
//   if (user?.role === "Expert") {
//     return <ExpertDashboard />;
//   }

//   if (user?.role === "Customer") {
//     return <CustomerDashboard />;
//   }

//   // If no user/role is found, redirect to registration
//   return <Navigate to="/" replace />;
// };

// Protected Route Wrapper for Specific Path Access


export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Dynamic Root Route based strictly on Role */}
        {/* <Route path="/" element={<RoleBasedDashboard />} /> */}

        <Route path={ROUTES.HOME} element={<HomePage/>}/>
        <Route path={ROUTES.LOGIN} element={<LoginPage/>}/>
        <Route path={ROUTES.EXPERTS} element={<ExpertsPage/>} />
        <Route path={ROUTES.EXPERT_PROFILE} element={<ExpertProfilePage />} />
        <Route path={ROUTES.EXPERT_LANDING} element={<ExpertsLandingPage/>}/>
        <Route path={ROUTES.CATEGORY_EXPERTS} element={<ExpertsPage/>}/>

        {/* Role-Protected Explicit Dashboard Routes */}
        <Route
         path={ROUTES.CUSTOMER_DASHBOARD} element={
         <ProtectedRoute allowedRoles={[1]}>
                  <CustomerDashboard/>
                </ProtectedRoute>}
        />


         <Route
         path={ROUTES.EXPERT_DASHBOARD}
          element={<ExpertDashboard />}
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
 
 