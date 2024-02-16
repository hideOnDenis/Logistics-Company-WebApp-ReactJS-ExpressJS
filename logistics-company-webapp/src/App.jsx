import { useState } from "react";
import Button from "@mui/material/Button";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        // Define other routes...
      </Routes>
    </Router>
  );
}

export default App;
