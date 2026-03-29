const mongoose = require("mongoose");

const adminLogSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    action: {
      type: String,
      required: true,
    },

    targetId: {
      type: mongoose.Schema.Types.ObjectId,
    },

    targetType: {
      type: String,
      enum: ["Employer", "Review", "User"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdminLog", adminLogSchema);