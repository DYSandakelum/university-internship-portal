import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// ===== Import Components =====
// Layout Components
import Navbar from './components/Navbar';
import Home from './components/Home';

// Employer Components
import EmployerList from './components/Employers/EmployerList';
import AddEmployer from './components/Employers/AddEmployer';
import EmployerDetails from './components/Employers/EmployerDetails';

// Review Components
// ReviewList එක ඉවත් කළා (පාවිච්චි නැති නිසා)
import AddReview from './components/Reviews/AddReview';
import ReviewDisplay from './components/Reviews/ReviewDisplay';
import AllReviews from './components/Reviews/AllReviews';
import CompanyReviews from './components/Reviews/CompanyReviews';
import Analytics from './components/Analytics';

// ===== Styles =====
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/custom.css';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Navbar - හැම පිටුවකම පෙන්වයි */}
        <Navbar />
        
        {/* Main Content Area */}
        <main style={{ 
          minHeight: 'calc(100vh - 70px)', 
          background: '#f8f9fc',
          padding: '20px 0 40px 0'
        }}>
          <Routes>
            {/* ===== Public Routes ===== */}
            {/* Home Page */}
            <Route path="/" element={<Home />} />
            
            {/* Redirect /home to / */}
            <Route path="/home" element={<Navigate to="/" replace />} />
            
            {/* ===== Employer Routes ===== */}
            {/* List all employers */}
            <Route path="/employers" element={<EmployerList />} />
            
            {/* Add new employer */}
            <Route path="/add-employer" element={<AddEmployer />} />
            
            {/* View employer details */}
            <Route path="/employer/:id" element={<EmployerDetails />} />
            
            {/* ===== Review Routes ===== */}
            {/* View all reviews for a company */}
            <Route path="/reviews/:companyId" element={<ReviewDisplay />} />
            
            {/* Add review for a company */}
            <Route path="/add-review/:companyId" element={<AddReview />} />
            
            {/* All reviews page */}
            <Route path="/all-reviews" element={<AllReviews />} />
            

            <Route path="/analytics" element={<Analytics />} />
            <Route path="/company-reviews" element={<CompanyReviews />} />
            {/* ===== 404 Route - Page Not Found ===== */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        
        {/* Footer */}
        <footer style={{
          background: 'white',
          padding: '20px 0',
          textAlign: 'center',
          borderTop: '1px solid #e3e6f0',
          color: '#858796',
          marginTop: 'auto'
        }}>
          <p style={{ margin: 0 }}>
            © {new Date().getFullYear()} Company Reviews System. All rights reserved.
          </p>
        </footer>
      </div>
    </Router>
  );
}

// 404 Page Component
const NotFoundPage = () => (
  <div style={{ 
    textAlign: 'center', 
    padding: '100px 20px',
    background: 'white',
    borderRadius: '10px',
    maxWidth: '500px',
    margin: '50px auto',
    boxShadow: '0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15)'
  }}>
    <h1 style={{ fontSize: '72px', marginBottom: '20px', color: '#4e73df' }}>404</h1>
    <h2 style={{ marginBottom: '20px', color: '#5a5c69' }}>Page Not Found</h2>
    <p style={{ marginBottom: '30px', color: '#858796' }}>
      The page you are looking for doesn't exist or has been moved.
    </p>
    <button 
      onClick={() => window.location.href = '/'}
      style={{
        padding: '10px 30px',
        background: '#4e73df',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
      }}
      onMouseOver={(e) => e.target.style.background = '#224abe'}
      onMouseOut={(e) => e.target.style.background = '#4e73df'}
    >
      Go Home
    </button>
  </div>
);

export default App;