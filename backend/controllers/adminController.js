const User = require("../models/User");
const Review = require("../models/review");
const Report = require("../models/report");
const AdminLog = require("../models/AdminLog");

/* ➤ Dashboard Stats */
exports.getDashboardStats = async (req, res) => {
  try {
    const users = await User.countDocuments();
    const reviews = await Review.countDocuments();
    const reports = await Report.countDocuments();

    res.json({ users, reviews, reports });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ➤ Hide Review */
exports.hideReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status: "hidden" },
      { new: true }
    );

    await AdminLog.create({
      adminId: req.body.adminId,
      action: "Hide Review",
      targetId: review._id,
      targetType: "Review",
    });

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ➤ Get All Reports */
exports.getReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("reviewId")
      .populate("reportedBy", "name email");

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};