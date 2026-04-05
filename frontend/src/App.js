import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Auth
import HomePage from './pages/HomePage';
import RegisterPage from './pages/auth/RegisterPage';
import LoginPage from './pages/auth/LoginPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';

// Route Guards
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

// Student
import StudentDashboard from './pages/student/StudentDashboard';
import JobDetailsPage from './pages/student/JobDetailsPage';
import ApplicationFormPage from './pages/student/ApplicationFormPage';
import MyApplicationsPage from './pages/student/MyApplicationsPage';
import StudentProfilePage from './pages/student/StudentProfilePage';

// Employer
import EmployerDashboard from './pages/employer/EmployerDashboard';
import EmployerLogin from './pages/employer/EmployerLogin';
import PostJob from './pages/employer/PostJob';
import MyJobs from './pages/employer/MyJobs';
import ViewApplications from './pages/employer/ViewApplications';
import EmployerProfile from './pages/employer/EmployerProfile';

// Admin
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';

// Reviews
import Home from './Home';
import EmployerList from './EmployerList';
import AddEmployer from './AddEmployer';
import EmployerDetails from './EmployerDetails';
import AddReview from './AddReview';
import AddReviews from './AddReviews';
import ReviewDisplay from './ReviewDisplay';
import CompanyReviews from './CompanyReviews';
import AllReviews from './AllReviews';
import Analytics from './Analytics';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={
                        <PublicRoute>
                            <LoginPage />
                        </PublicRoute>
                    } />
                    <Route path="/register" element={
                        <PublicRoute>
                            <RegisterPage />
                        </PublicRoute>
                    } />
                    <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
                    <Route path="/admin/login" element={
                        <PublicRoute>
                            <AdminLoginPage />
                        </PublicRoute>
                    } />
                    <Route path="/home" element={<Home />} />
                    <Route path="/student/home" element={<Home />} />
                    <Route path="/student/Home" element={<Home />} />
                    <Route path="/employers" element={<EmployerList />} />
                    <Route path="/add-employer" element={<AddEmployer />} />
                    <Route path="/employer/:id" element={<EmployerDetails />} />

                    {/* Student Routes */}
                    <Route path="/student/dashboard" element={
                        <ProtectedRoute allowedRoles={['student']}>
                            <StudentDashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/student/jobs/:id" element={
                        <ProtectedRoute allowedRoles={['student']}>
                            <JobDetailsPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/student/apply/:jobId" element={
                        <ProtectedRoute allowedRoles={['student']}>
                            <ApplicationFormPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/student/applications" element={
                        <ProtectedRoute allowedRoles={['student']}>
                            <MyApplicationsPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/student/profile" element={
                        <ProtectedRoute allowedRoles={['student']}>
                            <StudentProfilePage />
                        </ProtectedRoute>
                    } />

                    {/* Employer Routes */}
                    <Route path="/employer/login" element={<EmployerLogin />} />
                    <Route path="/employer/dashboard" element={<EmployerDashboard />} />
                    <Route path="/employer/post-job" element={<PostJob />} />
                    <Route path="/employer/edit-job/:id" element={<PostJob />} />
                    <Route path="/employer/my-jobs" element={<MyJobs />} />
                    <Route path="/employer/applications" element={<ViewApplications />} />
                    <Route path="/employer/profile" element={<EmployerProfile />} />

                    {/* Review Routes */}
                    <Route path="/add-review/:companyId" element={<AddReview />} />
                    <Route path="/student/AddReviews" element={<AddReviews />} />
                    <Route path="/student/add-reviews" element={<AddReviews />} />
                    <Route path="/reviews/:companyId" element={<ReviewDisplay />} />
                    <Route path="/all-reviews" element={<AllReviews />} />
                    <Route path="/student/AllReviews" element={<AllReviews />} />
                    <Route path="/student/all-reviews" element={<AllReviews />} />
                    <Route path="/company-reviews" element={<CompanyReviews />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/student/analytics" element={<Analytics />} />

                    {/* Admin Routes */}
                    <Route path="/admin/dashboard" element={
                        <ProtectedRoute allowedRoles={['admin']} redirectTo="/admin/login">
                            <AdminDashboard />
                        </ProtectedRoute>
                    } />


        



                    {/* 404 Route */}
                    <Route path="*" element={<div style={{ textAlign: 'center', padding: '50px' }}><h1>404 - Page Not Found</h1><a href="/">Go Home</a></div>} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;