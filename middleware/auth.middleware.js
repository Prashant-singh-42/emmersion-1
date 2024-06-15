const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");

const verifyJWT = async (req, res, next) => {
  const token = req.cookies?.accessToken;
  if (!token) {
    return res.status(401).json("token not found");
  }
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded?._id);
    if (!user) return res.status(404).json("user not found");
    req.user = user;
    next();
  } catch (err) {
    return res.status(400).json("invalid token");
  }
};

module.exports = verifyJWT;
