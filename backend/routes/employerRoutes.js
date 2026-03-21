const express = require("express");
const router = express.Router();

// Temporary controller functions (මේවා පස්සේ වෙනම file එකකට ගෙනියන්න)
const employerController = {
  // Get all employers
  getEmployers: async (req, res) => {
    try {
      res.json({ message: "All employers - working" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get single employer
  getEmployerById: async (req, res) => {
    try {
      const { id } = req.params;
      res.json({ message: `Employer ${id} - working` });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Create employer
  createEmployer: async (req, res) => {
    try {
      res.json({ message: "Employer created - working" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update employer
  updateEmployer: async (req, res) => {
    try {
      const { id } = req.params;
      res.json({ message: `Employer ${id} updated - working` });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Delete employer
  deleteEmployer: async (req, res) => {
    try {
      const { id } = req.params;
      res.json({ message: `Employer ${id} deleted - working` });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

// Routes
router.get("/", employerController.getEmployers);
router.get("/:id", employerController.getEmployerById);
router.post("/", employerController.createEmployer);
router.put("/:id", employerController.updateEmployer);
router.delete("/:id", employerController.deleteEmployer);

module.exports = router;