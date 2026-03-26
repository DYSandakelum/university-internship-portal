import React from 'react';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import StudentDashboard from './pages/student/StudentDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import JobDetailsPage from './pages/student/JobDetailsPage';
import ApplicationFormPage from './pages/student/ApplicationFormPage';
import MyApplicationsPage from './pages/student/MyApplicationsPage';
import StudentProfilePage from './pages/student/StudentProfilePage';
import { Layout as JMLayout } from './job_matching_component/components/Layout';
import { Dashboard } from './job_matching_component/pages/Dashboard';
import { Search as JobSearch } from './job_matching_component/pages/Search';
import { Recommended as RecommendedJobs } from './job_matching_component/pages/Recommended';
import { Saved as SavedJobs } from './job_matching_component/pages/Saved';
import { Notifications } from './job_matching_component/pages/Notifications';
import { NotificationSettings } from './job_matching_component/pages/NotificationSettings';
import { OpportunityCentre } from './job_matching_component/pages/OpportunityCentre';
import { NotFound as JMNotFound } from './job_matching_component/pages/NotFound';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    {/* Redirect root to job-matching dashboard */}
                    <Route path="/" element={<Navigate to="/job-matching/dashboard" replace />} />

                    {/* Job Matching Module Routes (scoped Tailwind UI) */}
                    <Route path="/job-matching" element={<JMLayout />}>
                        <Route index element={<Navigate to="dashboard" replace />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="search" element={<JobSearch />} />
                        <Route path="recommended" element={<RecommendedJobs />} />
                        <Route path="saved" element={<SavedJobs />} />
                        <Route path="notifications" element={<Notifications />} />
                        <Route path="notifications/settings" element={<NotificationSettings />} />
                        <Route path="opportunity" element={<OpportunityCentre />} />
                        <Route path="*" element={<JMNotFound />} />
                    </Route>
                    
                    {/* Auth Routes */}
                    <Route path="/home" element={<Navigate to="/" replace />} />
                    <Route path="/login" element={<Navigate to="/" replace />} />
                    <Route path="/register" element={<Navigate to="/" replace />} />
                    <Route path="/verify-email/:token" element={<VerifyEmailPage />} />

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