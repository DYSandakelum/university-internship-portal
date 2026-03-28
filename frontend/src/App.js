import React from 'react';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import StudentDashboard from './pages/student/StudentDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import JobDetailsPage from './pages/student/JobDetailsPage';
import ApplicationFormPage from './pages/student/ApplicationFormPage';
import MyApplicationsPage from './pages/student/MyApplicationsPage';
import StudentProfilePage from './pages/student/StudentProfilePage';
import Dashboard from './job_matching_component/pages/Dashboard';
import JobSearch from './job_matching_component/pages/JobSearch';
import RecommendedJobs from './job_matching_component/pages/RecommendedJobs';
import SavedJobs from './job_matching_component/pages/SavedJobs';
import Notifications from './job_matching_component/pages/Notifications';
import NotificationSettings from './job_matching_component/pages/NotificationSettings';
import OpportunityCentre from './job_matching_component/pages/OpportunityCentre';
import PracticeInterview from './job_matching_component/pages/PracticeInterview';
import PracticeInterviewAttempt from './job_matching_component/pages/PracticeInterviewAttempt';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    {/* Redirect root to job-matching dashboard */}
                    <Route path="/" element={<Navigate to="/job-matching/dashboard" replace />} />

                    {/* Job Matching Module Routes */}
                    <Route path="/job-matching/dashboard" element={<Dashboard />} />
                    <Route path="/job-matching/search" element={<JobSearch />} />
                    <Route path="/job-matching/recommended" element={<RecommendedJobs />} />
                    <Route path="/job-matching/saved" element={<SavedJobs />} />
                    <Route path="/job-matching/notifications" element={<Notifications />} />
                    <Route path="/job-matching/notifications/settings" element={<NotificationSettings />} />
                    <Route path="/job-matching/opportunity" element={<OpportunityCentre />} />
                    <Route path="/job-matching/practice-interview" element={
                        <ProtectedRoute allowedRoles={['student']}>
                            <PracticeInterview />
                        </ProtectedRoute>
                    } />
                    <Route path="/job-matching/practice-interview/attempt/:attemptId" element={
                        <ProtectedRoute allowedRoles={['student']}>
                            <PracticeInterviewAttempt />
                        </ProtectedRoute>
                    } />
                    
                    {/* Auth Routes */}
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