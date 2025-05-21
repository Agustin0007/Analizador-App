import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import Login from './components/login/Login';
import Register from './components/register/Register';
import Gastos from './components/gastos/Gastos';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { GastosProvider } from './context/GastosContext';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Dashboard from './components/dashboard/Dashboard';

const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Cargando...</div>
      </div>
    );
  }
  
  return currentUser ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <ThemeProvider>
          <GastosProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              <Route path="/gastos" element={
                <PrivateRoute>
                  <Gastos />
                </PrivateRoute>
              } />
              <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
            <ToastContainer />
          </GastosProvider>
        </ThemeProvider>
      </HashRouter>
    </AuthProvider>
  );
}

export default App;
