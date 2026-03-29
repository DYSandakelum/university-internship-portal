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
import EmployerDashboard from './pages/employer/EmployerDashboard';
import EmployerLogin from './pages/employer/EmployerLogin';
import PostJob from './pages/employer/PostJob';
import MyJobs from './pages/employer/MyJobs';
import ViewApplications from './pages/employer/ViewApplications';
import EmployerProfile from './pages/employer/EmployerProfile';

import Dashboard from './pages/job_matching_component/pages/Dashboard';
import JobSearch from './pages/job_matching_component/pages/JobSearch';
import RecommendedJobs from './pages/job_matching_component/pages/RecommendedJobs';
import SavedJobs from './pages/job_matching_component/pages/SavedJobs';
import Notifications from './pages/job_matching_component/pages/Notifications';
import NotificationSettings from './pages/job_matching_component/pages/NotificationSettings';
import OpportunityCentre from './pages/job_matching_component/pages/OpportunityCentre';
import PracticeInterview from './pages/job_matching_component/pages/PracticeInterview';
import PracticeInterviewAttempt from './pages/job_matching_component/pages/PracticeInterviewAttempt';
import JobMatchingShell from './pages/job_matching_component/components/JobMatchingShell';

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

                    {/* Job Matching Module Routes */}
                    <Route path="/job-matching" element={<JobMatchingShell />}>
                        <Route index element={<Navigate to="dashboard" replace />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="search" element={<JobSearch />} />
                        <Route path="recommended" element={<RecommendedJobs />} />
                        <Route path="saved" element={<SavedJobs />} />
                        <Route path="notifications" element={<Notifications />} />
                        <Route path="notifications/settings" element={<NotificationSettings />} />
                        <Route path="opportunity" element={<OpportunityCentre />} />
                        <Route
                            path="practice-interview"
                            element={
                                <ProtectedRoute allowedRoles={['student']}>
                                    <PracticeInterview />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="practice-interview/attempt/:attemptId"
                            element={
                                <ProtectedRoute allowedRoles={['student']}>
                                    <PracticeInterviewAttempt />
                                </ProtectedRoute>
                            }
                        />
                    </Route>

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