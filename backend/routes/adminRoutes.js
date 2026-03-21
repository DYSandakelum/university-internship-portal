const express = require("express");
const router = express.Router();

// Temporary controller functions (මේවා පස්සේ වෙනම file එකකට ගෙනියන්න)
const adminController = {
  // Dashboard Stats
  getDashboardStats: async (req, res) => {
    try {
      // Temporary response
      res.json({ message: "Dashboard stats - working" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Hide Review
  hideReview: async (req, res) => {
    try {
      const { id } = req.params;
      res.json({ message: `Review ${id} hidden - working` });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get Reports
  getReports: async (req, res) => {
    try {
      res.json({ message: "All reports - working" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

/* ➤ Dashboard Stats */
router.get("/stats", adminController.getDashboardStats);

/* ➤ Hide Review */
router.put("/hide-review/:id", adminController.hideReview);

/* ➤ Get All Reports */
router.get("/reports", adminController.getReports);

module.exports = router;