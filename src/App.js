import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/login";
import Register from "./components/register";
import Dashboard from "./components/dashboard";
import Profile from "./components/Profile";
import { isAuthenticated, getCurrentUser, isAdmin } from "./services/AuthService";
import axios from "axios";

// Protected Route Component untuk user terautentikasi umum
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  return children;
};

// Protected Route khusus untuk admin
const ProtectedAdminRoute = ({ children }) => {
  // Cek apakah user terautentikasi
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  
  // Cek apakah user memiliki role admin
  if (!isAdmin()) {
    return <Navigate to="/profile" />;
  }
  
  return children;
};

function App() {
  // Set up axios interceptor for authentication
  // Di dalam App.js, tambahkan ini
useEffect(() => {
  const user = getCurrentUser();
  console.log("Current User Data:", user);
  console.log("isAdmin result:", isAdmin());
}, []);

  // Fungsi untuk redireksi berdasarkan role
  const redirectBasedOnRole = () => {
    if (!isAuthenticated()) {
      return <Navigate to="/login" />;
    }
    
    return isAdmin() ? <Navigate to="/dashboard" /> : <Navigate to="/profile" />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Halaman Dashboard - hanya untuk admin */}
        <Route
          path="/dashboard"
          element={
            <ProtectedAdminRoute>
              <Dashboard />
            </ProtectedAdminRoute>
          }
        />
        
        {/* Halaman Profile - untuk semua user terautentikasi */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        
        {/* Redirect ke halaman yang sesuai berdasarkan role */}
        <Route path="/" element={redirectBasedOnRole()} />
        <Route path="*" element={redirectBasedOnRole()} />
      </Routes>
    </Router>
  );
}

export default App;