const express = require("express");
const router = express.Router();

// Temporary controller functions
const reviewController = {
  getAllReviews: async (req, res) => {
    try {
      res.json({ message: "All reviews - working" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
};

router.get("/", reviewController.getAllReviews);


module.exports = router;