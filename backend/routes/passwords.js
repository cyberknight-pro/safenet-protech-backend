const express = require("express");
const CryptoJS = require("crypto-js");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const Password = require("../models/password");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;

// Ensure SECRET_KEY is present
if (!SECRET_KEY) {
  console.error("❌ SECRET_KEY is missing in .env file!");
  process.exit(1);
}

// 🔐 Encrypt Password Function
const encryptPassword = (password) => {
  try {
    return CryptoJS.AES.encrypt(password, SECRET_KEY).toString();
  } catch (error) {
    console.error("❌ Encryption Error:", error);
    return null;
  }
};

// 🔓 Decrypt Password Function
const decryptPassword = (encryptedPassword) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedPassword, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8) || null;
  } catch (error) {
    console.error("❌ Decryption Error:", error);
    return null;
  }
};

// ✅ GET - Retrieve All Stored Passwords (Decrypted)
router.get("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const passwords = await Password.find({ userId });

    const decryptedPasswords = passwords.map((item) => ({
      id: item._id,
      label: item.label,
      password: decryptPassword(item.password) || "❌ Decryption failed",
    }));

    res.status(200).json(decryptedPasswords);
  } catch (error) {
    console.error("❌ Error fetching passwords:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ POST - Add a Password (Encrypted)
router.post("/add", verifyToken, async (req, res) => {
  try {
    const { label, password } = req.body;
    const userId = req.user.id;

    if (!password || !label) {
      return res.status(400).json({ message: "Label and Password are required" });
    }

    const encryptedPassword = encryptPassword(password);
    if (!encryptedPassword) {
      return res.status(500).json({ message: "Error encrypting password" });
    }

    const newPassword = new Password({ userId, label, password: encryptedPassword });
    await newPassword.save();

    res.status(201).json({ message: "Password saved securely" });
  } catch (error) {
    console.error("❌ Error saving password:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ DELETE - Remove a Specific Password
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const password = await Password.findById(req.params.id);
    if (!password || password.userId.toString() !== req.user.id) {
      return res.status(404).json({ message: "Password not found" });
    }

    await password.deleteOne();
    res.json({ message: "Password deleted" });
  } catch (error) {
    console.error("❌ Error deleting password:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ DELETE - Clear All User's Stored Passwords
router.delete("/clear", verifyToken, async (req, res) => {
  try {
    await Password.deleteMany({ userId: req.user.id });
    res.status(200).json({ message: "All passwords deleted" });
  } catch (error) {
    console.error("❌ Error deleting passwords:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
