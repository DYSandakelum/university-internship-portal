const express = require("express");
const router = express.Router();
const {
  adminLogin,
  getDashboardStats,
  getCompanies,
  createCompany,
  hideReview,
  getReports,
} = require("../controllers/adminController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.post("/login", adminLogin);

router.use(protect, authorizeRoles("admin"));

router.get("/stats", getDashboardStats);
router.get("/companies", getCompanies);
router.post("/companies", createCompany);
router.put("/hide-review/:id", hideReview);
router.get("/reports", getReports);

module.exports = router;