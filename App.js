import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Navbar from './Navbar';
import Home from './Home';
import EmployerList from './EmployerList';
import AddEmployer from './AddEmployer';
import EmployerDetails from './EmployerDetails';
import AddReview from './AddReviews';
import ReviewDisplay from './ReviewDisplay';
import AllReviews from './AllReviews';
import CompanyReviews from './CompanyReviews';
import Analytics from './Analytics';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/employers" element={<EmployerList />} />
        <Route path="/add-employer" element={<AddEmployer />} />
        <Route path="/employer/:id" element={<EmployerDetails />} />
        <Route path="/add-review/:companyId" element={<AddReview />} />
        <Route path="/student/AddReviews" element={<AddReview />} />
        <Route path="/student/add-reviews" element={<AddReview />} />
        <Route path="/reviews/:companyId" element={<ReviewDisplay />} />
        <Route path="/all-reviews" element={<AllReviews />} />
        <Route path="/student/AllReviews" element={<AllReviews />} />
        <Route path="/student/all-reviews" element={<AllReviews />} />
        <Route path="/company-reviews" element={<CompanyReviews />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="*" element={
          <div style={{textAlign:'center', padding:'50px'}}>
            <h1 style={{fontSize:'72px', color:'#667eea'}}>404</h1>
            <h2>Page Not Found</h2>
            <a href="/" style={{color:'#667eea', textDecoration:'none'}}>Go Home</a>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;