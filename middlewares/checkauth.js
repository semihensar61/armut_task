const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    let s = req.headers.authorization;
    const token_ = s.split(" ");
    const token = token_[1];
    const decoded = jwt.verify(token, "ArmutTask"); // a string to create and decode token
    req.userData = { username: decoded.username, _id: decoded._id };
    next();
  } catch (error) {
    res.status(401).json({ message: "Auth failed" });
  }
};
