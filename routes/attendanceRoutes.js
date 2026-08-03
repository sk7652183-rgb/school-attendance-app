const express = require("express");
const {
  markAttendance,
  getAttendance,
  updateAttendance,
  deleteAttendance,
} = require("../controllers/attendanceController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/role");

const router = express.Router();

router.use(protect);

// Both admin and teacher can mark and view attendance
router.post("/", authorize("admin", "teacher"), markAttendance);
router.get("/", getAttendance);
router.put("/:id", authorize("admin", "teacher"), updateAttendance);
router.delete("/:id", authorize("admin"), deleteAttendance);

module.exports = router;
