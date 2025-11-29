
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/envConfig');
const User = require('../module/user/user.model.js');

exports.checkUserToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('Authorization header:', authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access token missing or invalid"
      });
    }

    const token = authHeader.split(" ")[1];
    console.log('JWT token:', token);

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
      console.log('Decoded token:', decoded);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ success: false, message: "Token has expired" });
      }
      return res.status(401).json({ success: false, message: "Access token is invalid" });
    }

    const user = await User.findById(decoded.userId); 
    console.log('User from DB:', user);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    req.user = user;
    req.id = user._id;
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
 exports.checkAdminToken = (req, res, next) => {
  console.log('Admin check, user:', req.user); 
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      message: "Access denied: admin only"
    });
  }
};
