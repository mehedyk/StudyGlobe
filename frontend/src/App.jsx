import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

import LandingPage from './pages/LandingPage';
import { Login, Register, ForgotPassword, ResetPassword } from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Countries from './pages/Countries';
import Universities from './pages/Universities';
import UniversityDetails from './pages/UniversityDetails';
import Programs from './pages/Programs';
import Profile from './pages/Profile';
import { AdminDashboard, AdminUsers, AdminAnalytics } from './pages/Admin';
import ChatBot from './components/ChatBot';

import './styles/globals.css';

// Pages that use full-width layout (no container padding)
const FULL_BLEED_ROUTES = ['/', '/login', '/register', '/forgot-password', '/reset-password'];

function AppShell() {
  const [theme, setTheme] = useState(() => localStorage.getItem('sg_theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('sg_theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  const isFullBleed = FULL_BLEED_ROUTES.some(r => window.location.pathname === r);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--c-bg)' }}>
      <Navbar theme={theme} onThemeToggle={toggleTheme} />
      <main style={isFullBleed ? {} : { maxWidth: 1280, margin: '0 auto', padding: '0 var(--sp-6)' }}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/countries" element={<ProtectedRoute><Countries /></ProtectedRoute>} />
          <Route path="/universities" element={<ProtectedRoute><Universities /></ProtectedRoute>} />
          <Route path="/universities/:id" element={<ProtectedRoute><UniversityDetails /></ProtectedRoute>} />
          <Route path="/programs" element={<ProtectedRoute><Programs /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          {/* Admin */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
          <Route path="/admin/analytics" element={<AdminRoute><AdminAnalytics /></AdminRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <ChatBot />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </Router>
  );
}
