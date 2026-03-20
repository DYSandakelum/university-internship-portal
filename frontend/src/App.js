import React from 'react';
import RegisterPage from './pages/auth/RegisterPage';
import LoginPage from './pages/auth/LoginPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    {/* Auth Routes */}
                    <Route path="/" element={<h1>Welcome to University Internship Portal</h1>} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/verify-email/:token" element={<VerifyEmailPage />} />

                    {/* Student Routes */}
                    <Route path="/student/dashboard" element={<h1>Student Dashboard</h1>} />

                    {/* Employer Routes */}
                    <Route path="/employer/dashboard" element={<h1>Employer Dashboard</h1>} />

                    {/* Admin Routes */}
                    <Route path="/admin/dashboard" element={<h1>Admin Dashboard</h1>} />

                    {/* 404 Route */}
                    <Route path="*" element={<h1>404 - Page Not Found</h1>} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;