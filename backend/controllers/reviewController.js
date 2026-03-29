const Review = require("../models/review");
const Employer = require("../models/Employer");

/* ➤ Create Review */
exports.createReview = async (req, res) => {
  try {
    const review = await Review.create(req.body);
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ➤ Get All Reviews */
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("studentId", "name email")
      .populate("companyId", "companyName");

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ➤ Get Reviews By Company */
exports.getCompanyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      companyId: req.params.companyId,
      status: "active",
    });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ➤ Delete Review (Admin) */
exports.deleteReview = async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};