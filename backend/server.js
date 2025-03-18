require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/auth");
const passwordRoutes = require("./routes/passwords");
const protectedRoutes = require("./routes/protected");

const app = express();

// 🛡️ Security Middleware
app.use(helmet()); // Adds security headers

// ✅ Allow local dev + GitHub Pages + custom domain
const allowedOrigins = [
  "http://localhost:5173",                    // Local frontend dev
  "https://www.safenetprotect.com",           // Your custom production domain
  "https://cyberknight-pro.github.io",        // GitHub Pages base domain
  "https://cyberknight-pro.github.io/safenet-protech", // GitHub Pages project domain
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed from this origin"));
      }
    },
    credentials: true,
  })
);

// JSON Body Parser
app.use(express.json());

// 🚀 Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// 🔗 Routes
app.use("/api/auth", authRoutes);
app.use("/api/passwords", passwordRoutes);
app.use("/api/protected", protectedRoutes);

// ⚠️ Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// 🌍 MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Health Check Endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is running fine!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
