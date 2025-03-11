const jwt = require("jsonwebtoken");

module.exports.verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: "Access Denied. No token provided." });
  }

  // Extract token after "Bearer "
  const tokenParts = token.split(" ");
  if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
    return res.status(400).json({ message: "Invalid token format" });
  }

  const actualToken = tokenParts[1];

  try {
    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded user to request
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid Token." });
  }
};
