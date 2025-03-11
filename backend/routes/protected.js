const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth"); // Import authentication middleware

// ✅ Protected Route (Requires Authentication)
router.get("/", verifyToken, (req, res) => {
  try {
    res.status(200).json({ message: "Access granted", userId: req.user.id });
  } catch (error) {
    console.error("❌ Error in protected route:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;

