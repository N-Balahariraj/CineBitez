const user = require("../models/users.model");

module.exports.isNewUser = async function (req, res, next) {
  try {
    const foundUser = await user.findOne({ email: req.body.email });
    if (!foundUser) {
      return next();
    }
    const requestedRole = String(req.body.role || "").trim().toLowerCase();
    const actualRole = String(foundUser.role || "").trim().toLowerCase();
    if (requestedRole !== actualRole) {
      return res
        .status(403)
        .send({ message: "Please select a correct user type" });
    }
    req.user = foundUser;
    next();
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};
