const User = require("../models/User");
const Review = require("../models/Review");
const Report = require("../models/Report");
const AdminLog = require("../models/Adminlogs");
const Employer = require("../models/Employer");
const generateToken = require("../utils/generateToken");

const buildTempPassword = () => {
  return `Temp@${Math.random().toString(36).slice(2, 10)}`;
};

/* Admin Login (username + password) */
exports.adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const normalizedUsername = username.trim().toLowerCase();
    const admin = await User.findOne({
      role: "admin",
      $or: [
        { email: normalizedUsername },
        { name: username.trim() },
      ],
    });

    if (!admin) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    res.status(200).json({
      message: "Admin login successful",
      token: generateToken(admin._id, admin.role),
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* Dashboard Stats */
exports.getDashboardStats = async (req, res) => {
  try {
    const [users, reviews, reports, companies] = await Promise.all([
      User.countDocuments(),
      Review.countDocuments(),
      Report.countDocuments(),
      Employer.countDocuments(),
    ]);

    res.json({ users, reviews, reports, companies });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* Admin creates a company/employer profile */
exports.createCompany = async (req, res) => {
  try {
    const {
      name,
      email,
      companyName,
      companyAddress,
      companyDescription,
      password,
    } = req.body;

    if (!name || !email || !companyName || !companyAddress) {
      return res.status(400).json({
        message: "name, email, companyName, and companyAddress are required",
      });
    }

    const existingEmployer = await Employer.findOne({ email: email.toLowerCase().trim() });
    if (existingEmployer) {
      return res.status(400).json({ message: "A company with this email already exists" });
    }

    const newEmployer = await Employer.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: password || buildTempPassword(),
      companyName: companyName.trim(),
      companyAddress: companyAddress.trim(),
      companyDescription: companyDescription || "",
      description: companyDescription || "",
      verificationStatus: "approved",
      status: "approved",
    });

    await AdminLog.create({
      adminId: req.user._id,
      action: "Add Company",
      targetId: newEmployer._id,
      targetType: "Employer",
    });

    res.status(201).json({
      message: "Company added successfully",
      company: {
        _id: newEmployer._id,
        name: newEmployer.name,
        email: newEmployer.email,
        companyName: newEmployer.companyName,
        companyAddress: newEmployer.companyAddress,
        companyDescription: newEmployer.companyDescription,
        verificationStatus: newEmployer.verificationStatus,
        createdAt: newEmployer.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* Admin company list */
exports.getCompanies = async (req, res) => {
  try {
    const companies = await Employer.find()
      .select("name email companyName companyAddress companyDescription verificationStatus createdAt")
      .sort({ createdAt: -1 });

    res.json({ companies });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* Hide Review */
exports.hideReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status: "hidden" },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    await AdminLog.create({
      adminId: req.user._id,
      action: "Hide Review",
      targetId: review._id,
      targetType: "Review",
    });

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* Get All Reports */
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