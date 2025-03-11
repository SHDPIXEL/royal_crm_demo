import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import Dashboard from "./pages/Dashboard"
import MainLayout from './layout/MainLayout';
import AddLogs from './pages/Logs/AddLogs';
import ListLogs from './pages/Logs/ListLogs';
import ProtectedRoute from './helper/ProtectedRoute';
import Login from './pages/Login';
import { Toaster } from 'react-hot-toast';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const tokenExpiry = localStorage.getItem('tokenExpiry');

    if (token && tokenExpiry && Date.now() < parseInt(tokenExpiry, 10)) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      localStorage.removeItem('authToken');
      localStorage.removeItem('tokenExpiry');
    }
  }, []);

  return (
    <>
      <Toaster position="top-right" autoClose={3000} />
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={<Login setIsAuthenticated={setIsAuthenticated} />}
          />

          <Route path='/' element={
            <ProtectedRoute>
              <MainLayout setIsAuthenticated={setIsAuthenticated} />
            </ProtectedRoute>
          }>
            <Route
              index
              element={
                isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/logs/add' element={<AddLogs />} />
            <Route path='/logs/list' element={<ListLogs />} />
          </Route>
          <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
        </Routes>
      </BrowserRouter >
    </>
  )
}

export default App
