import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage.jsx";
import EmployeeDashboard from "./pages/EmployeeDashboardPage.jsx";
import ClientDashboard from "./pages/ClientDashboardPage.jsx";
import UsersPage from "./pages/UsersPage.jsx";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
        <Route path="/client/dashboard" element={<ClientDashboard />} />
        <Route path="/employee/users" element={<UsersPage />} />
      </Routes>
    </Router>
  );
}

export default App;
