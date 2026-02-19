import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    {/* Auth Routes */}
                    <Route path="/" element={<h1>Welcome to University Internship Portal</h1>} />
                    <Route path="/register" element={<h1>Register Page</h1>} />
                    <Route path="/login" element={<h1>Login Page</h1>} />
                    <Route path="/verify-email/:token" element={<h1>Verify Email Page</h1>} />

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