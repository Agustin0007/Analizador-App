import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
  
  if (loading) return <div>Cargando...</div>;
  
  return currentUser ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <GastosProvider>
          <Router>
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
              <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
            <ToastContainer />
          </Router>
        </GastosProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
