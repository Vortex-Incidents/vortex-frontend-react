import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './pages/Login';
import Landing from './pages/Landing';
import EmployeeDashboard from './pages/EmployeeDashboard';
import CreateIncident from './pages/CreateIncident';
import SupportDashboard from './pages/SupportDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import Feedback from './pages/Feedback';
import Layout from './components/Layout';
import { useAuth } from './context/AuthContext';

// Protected Route Wrapper
const ProtectedRoute = ({ allowedRoles }: { allowedRoles?: string[] }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <div className="p-8 text-center text-red-500">Access Denied: Insufficient Permissions (Role: {user.role})</div>;
  }

  return <Outlet />;
};

const App: React.FC = () => {
  // Theme state moved to Layout or Context in a real app, keeping simple locally for now or passing down
  // For this refactor, let's assume Layout handles theme toggle or we pass it
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) setTheme(savedTheme);
    else if (window.matchMedia('(prefers-color-scheme: dark)').matches) setTheme('dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  // Sync document class
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);


  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing onStart={() => window.location.href = '/login'} />} />
      <Route path="/login" element={<Login />} />
      <Route path="/feedback" element={<Feedback />} />

      {/* Protected Routes with Layout */}
      <Route element={<Layout theme={theme} toggleTheme={toggleTheme} />}>
        <Route element={<ProtectedRoute allowedRoles={['employee', 'admin', 'support']} />}>
          <Route path="/profile" element={<Profile user={{ name: 'User', email: '', role: 'employee', avatar: '' }} theme={theme} onThemeToggle={toggleTheme} />} />
        </Route>

        {/* Employee Area */}
        <Route element={<ProtectedRoute allowedRoles={['employee']} />}>
          <Route path="/employee" element={<EmployeeDashboard onCreate={() => { }} onIncidentClick={() => { }} refreshKey={0} />} />
          <Route path="/employee/create" element={<CreateIncident onBack={() => window.history.back()} />} />
        </Route>

        {/* Support Area */}
        <Route element={<ProtectedRoute allowedRoles={['support', 'admin']} />}>
          <Route path="/support" element={<SupportDashboard onIncidentClick={() => { }} refreshKey={0} />} />
        </Route>

        {/* Admin Area */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminDashboard onIncidentClick={() => { }} refreshKey={0} />} />
        </Route>
      </Route>

      {/* Catch All */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;