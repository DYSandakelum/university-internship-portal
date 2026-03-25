import React from 'react';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/auth/RegisterPage';
import LoginPage from './pages/auth/LoginPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import StudentDashboard from './pages/student/StudentDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import JobDetailsPage from './pages/student/JobDetailsPage';
import ApplicationFormPage from './pages/student/ApplicationFormPage';
import MyApplicationsPage from './pages/student/MyApplicationsPage';
import StudentProfilePage from './pages/student/StudentProfilePage';
import PublicRoute from './components/PublicRoute';
import Dashboard from './job_matching_component/pages/Dashboard';
import OpportunityCentre from './job_matching_component/pages/OpportunityCentre';
import JobSearch from './job_matching_component/pages/JobSearch';
import RecommendedJobs from './job_matching_component/pages/RecommendedJobs';
import SavedJobs from './job_matching_component/pages/SavedJobs';
import Notifications from './job_matching_component/pages/Notifications';
import NotificationSettings from './job_matching_component/pages/NotificationSettings';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    {/* Auth Routes */}
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

                    {/* Job Matching Routes */}
                    <Route path="/job-matching" element={<Navigate to="/job-matching/dashboard" replace />} />
                    <Route path="/job-matching/dashboard" element={<Dashboard />} />
                    <Route path="/job-matching/opportunity" element={<OpportunityCentre />} />
                    <Route path="/job-matching/search" element={<JobSearch />} />
                    <Route path="/job-matching/recommended" element={<RecommendedJobs />} />
                    <Route path="/job-matching/saved" element={<SavedJobs />} />
                    <Route path="/job-matching/notifications" element={<Notifications />} />
                    <Route path="/job-matching/notifications/settings" element={<NotificationSettings />} />

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