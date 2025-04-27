const express = require("express");
const {
  createUser,
  loginUser,
  authenticateJWT,
} = require("../Controllers/User.controller");

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", createUser);
router.get("/", authenticateJWT, (req, res) => {
  res.status(200).json({ message: "User authenticated", user: req.user });
});

module.exports = router;
