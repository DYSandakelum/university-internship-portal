const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employer",
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    reviewText: {
      type: String,
    },

    isAnonymous: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["active", "hidden", "reported"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);