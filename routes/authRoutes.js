const express = require("express");
const { register, login, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/role");

const router = express.Router();

// Only an existing admin can create new accounts (bootstrap the first admin
// directly in the database, then use this route for everyone else).
router.post("/register", protect, authorize("admin"), register);
router.post("/login", login);
router.get("/me", protect, getMe);

module.exports = router;
