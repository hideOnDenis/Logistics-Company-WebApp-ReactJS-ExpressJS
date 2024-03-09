import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage.jsx";
import EmployeeDashboard from "./pages/EmployeeDashboardPage.jsx";
import ShipmentPage from "./pages/ShipmentPage.jsx";
import UsersPage from "./pages/UsersPage.jsx";
import CompanyPage from "./pages/CompanyPage.jsx";
import ShipmentPageClient from "./pages/ShipmentPageClient.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import OfficePage from "./pages/OfficePage.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/client/shipments"
          element={
            <ProtectedRoute>
              <ShipmentPageClient />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee/dashboard"
          element={
            <ProtectedRoute roles={["admin"]}>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/shipments"
          element={
            <ProtectedRoute roles={["admin"]}>
              <ShipmentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/users"
          element={
            <ProtectedRoute roles={["admin"]}>
              <UsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/companies"
          element={
            <ProtectedRoute roles={["admin"]}>
              <CompanyPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/offices"
          element={
            <ProtectedRoute roles={["admin"]}>
              <OfficePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
